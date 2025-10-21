import cx from 'classnames';
import React from 'react';
import { clamp } from '@modusoperandi/licit-ui-commands';
import { uuid } from '../uuid';
import { FP_WIDTH } from '../../Constants';

type Props = {
  height: number;
  width: number;
  src: string;
  fitToParent: boolean;
  onResizeEnd: (width: number, height: number) => void;
};

export const MIN_SIZE = 20;
export const MAX_SIZE = 10000;

// Resize functions
function setWidth(el: HTMLElement, width: number, fitToParent: boolean): void {
  el.style.width = fitToParent ? FP_WIDTH : width + 'px';
}

function setHeight(el: HTMLElement, height: number): void {
  el.style.height = height + 'px';
}

function setSize(el: HTMLElement, width: number, height: number, fitToParent: boolean): void {
  el.style.width = fitToParent ? FP_WIDTH : Math.round(width) + 'px';
  el.style.height = Math.round(height) + 'px';
}

// Mapping resize directions to functions
const ResizeDirection: Record<string, Function> = {
  top: setHeight,
  top_right: setSize,
  right: setWidth,
  bottom_right: setSize,
  bottom: setHeight,
  bottom_left: setSize,
  left: setWidth,
  top_left: setSize,
};

// Props for individual resize control
type ImageResizeBoxControlProps = {
  boxID: string;
  direction: string;
  width: number;
  height: number;
  fitToParent: boolean;
  onResizeEnd: (w: number, h: number) => void;
};

export class ImageResizeBoxControl extends React.PureComponent<ImageResizeBoxControlProps> {
  _active = false;
  _el: HTMLElement | null = null;
  _rafID: number | null = null;

  _x1 = 0;
  _y1 = 0;
  _x2 = 0;
  _y2 = 0;
  _ww = 0;
  _hh = 0;
  _w = '';
  _h = '';

  componentWillUnmount(): void {
    this._end();
  }

  render(): React.ReactElement {
    const { direction } = this.props;
    const className = cx('molm-czi-image-resize-box-control', direction);
    return <span className={className} onMouseDown={this._onMouseDown} />;
  }

  _syncSize = (): void => {
    if (!this._active || !this._el) return;

    const { direction, width, height, fitToParent } = this.props;
    const dx = (this._x2 - this._x1) * (/left/.test(direction) ? -1 : 1);
    const dy = (this._y2 - this._y1) * (/top/.test(direction) ? -1 : 1);

    const fn = ResizeDirection[direction];
    if (!fn) return;

    const aspect = width / height;
    let ww = clamp(MIN_SIZE, width + Math.round(dx), MAX_SIZE);
    let hh = clamp(MIN_SIZE, height + Math.round(dy), MAX_SIZE);

    if (fn === setSize) {
      hh = clamp(MIN_SIZE, Math.max(ww / aspect, MIN_SIZE), MAX_SIZE);
      ww = hh * aspect;
    }

    fn(this._el, Math.round(ww), Math.round(hh), fitToParent);
    this._ww = ww;
    this._hh = hh;
  };

  _start(e: React.MouseEvent): void {
    if (this._active) this._end();

    this._active = true;
    const { boxID, direction, width, height } = this.props;
    const el = document.getElementById(boxID);
    if (!el) return;

    el.classList.add(direction);

    this._el = el;
    this._x1 = e.clientX;
    this._y1 = e.clientY;
    this._x2 = this._x1;
    this._y2 = this._y1;
    this._w = el.style.width;
    this._h = el.style.height;
    this._ww = width;
    this._hh = height;

    document.addEventListener('mousemove', this._onMouseMove, true);
    document.addEventListener('mouseup', this._onMouseUp, true);
  }

  _end(): void {
    if (!this._active) return;

    this._active = false;

    document.removeEventListener('mousemove', this._onMouseMove, true);
    document.removeEventListener('mouseup', this._onMouseUp, true);

    if (this._el) {
      this._el.style.width = this._w;
      this._el.style.height = this._h;
      this._el.className = 'molm-czi-image-resize-box';
      this._el = null;
    }

    if (this._rafID) {
      cancelAnimationFrame(this._rafID);
      this._rafID = null;
    }
  }

  _onMouseDown = (e: React.MouseEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    this._end();
    this._start(e);
  };

  _onMouseMove = (e: MouseEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    this._x2 = e.clientX;
    this._y2 = e.clientY;
    this._rafID = requestAnimationFrame(this._syncSize);
  };

  _onMouseUp = (e: MouseEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    this._x2 = e.clientX;
    this._y2 = e.clientY;

    const { direction, onResizeEnd } = this.props;
    if (this._el) this._el.classList.remove(direction);

    this._end();
    onResizeEnd(this._ww, this._hh);
  };
}

export class ImageResizeBox extends React.PureComponent<Props> {
  _id = uuid();

  render(): React.ReactElement {
    const { width, height, src, fitToParent, onResizeEnd } = this.props;

    const style: React.CSSProperties = {
      width: fitToParent ? FP_WIDTH : width + 'px',
      height: height + 'px',
      padding: fitToParent ? '0' : undefined,
      margin: fitToParent ? '0' : undefined,
    };

    const controls = Object.keys(ResizeDirection).map((key) => (
      <ImageResizeBoxControl
        key={key}
        boxID={this._id}
        direction={key}
        width={width}
        height={height}
        fitToParent={fitToParent}
        onResizeEnd={onResizeEnd}
      />
    ));

    return (
      <span className="molm-czi-image-resize-box" id={this._id} style={style}>
        {controls}
        <img className="molm-czi-image-resize-box-image" src={src} />
      </span>
    );
  }
}
