import cx from 'classnames';
import nullthrows from 'nullthrows';
import * as React from 'react';

import {clamp} from '@modusoperandi/licit-ui-commands';
import uuid from './uuid';

import './czi-image-resize-box.css';
import {FP_HEIGHT, FP_WIDTH} from '../Constants';

type Props = {
  height: number;
  onResizeEnd: (w: number, height: number) => void;
  src: string;
  width: number;
  fitToParent: boolean;
};

export const MIN_SIZE = 20;
export const MAX_SIZE = 10000;

function setWidth(el: HTMLElement, width: number, fitToParent: boolean): void {
  el.style.width = fitToParent ? FP_WIDTH : width + 'px';
}

function setHeight(
  el: HTMLElement,
  height: number,
  fitToParent: boolean
): void {
  el.style.height = fitToParent ? FP_HEIGHT : height + 'px';
}

function setSize(
  el: HTMLElement,
  width: number,
  height: number,
  fitToParent: boolean
): void {
  el.style.width = fitToParent ? FP_WIDTH : Math.round(width) + 'px';
  el.style.height = fitToParent ? FP_HEIGHT : Math.round(height) + 'px';
}

const ResizeDirection = {
  top: setHeight,
  top_right: setSize,
  right: setWidth,
  bottom_right: setSize,
  bottom: setHeight,
  bottom_left: setSize,
  left: setWidth,
  top_left: setSize,
};

class ImageResizeBoxControl extends React.PureComponent {
  props: {
    boxID: string;
    config;
    direction: string;
    height: number;
    onResizeEnd: (w: number, height: number) => void;
    width: number;
    fitToParent: boolean;
  };

  _active = false;
  _el = null;
  _h = '';
  _rafID = 0;
  _w = '';
  _x1 = 0;
  _x2 = 0;
  _y1 = 0;
  _y2 = 0;
  _ww = 0;
  _hh = 0;

  componentWillUnmount(): void {
    this._end();
  }

  render(): React.ReactElement {
    const {direction} = this.props;

    const className = cx({
      'molm-czi-image-resize-box-control': true,
      [direction]: true,
    });

    return <span className={className} onMouseDown={this._onMouseDown} />;
  }

  _syncSize = (): void => {
    if (!this._active) {
      return;
    }
    const {direction, width, height} = this.props;

    const dx = (this._x2 - this._x1) * (/left/.test(direction) ? -1 : 1);
    const dy = (this._y2 - this._y1) * (/top/.test(direction) ? -1 : 1);

    const el = nullthrows(this._el);
    const fn = nullthrows(ResizeDirection[direction]);
    const aspect = width / height;
    let ww = clamp(MIN_SIZE, width + Math.round(dx), MAX_SIZE);
    let hh = clamp(MIN_SIZE, height + Math.round(dy), MAX_SIZE);

    if (fn === setSize) {
      hh = Math.max(ww / aspect, MIN_SIZE);
      ww = hh * aspect;
    }

    fn(el, Math.round(ww), Math.round(hh), this.props.fitToParent);
    this._ww = ww;
    this._hh = hh;
  };

  _start(e: React.MouseEvent): void {
    if (this._active) {
      this._end();
    }

    this._active = true;

    const {boxID, direction, width, height} = this.props;
    const el = nullthrows(document.getElementById(boxID));
    el.className += ' ' + direction;

    this._el = el;
    this._x1 = e.clientX;
    this._y1 = e.clientY;
    this._x2 = this._x1;
    this._y2 = this._y1;
    this._w = this._el.style.width;
    this._h = this._el.style.height;
    this._ww = width;
    this._hh = height;

    document.addEventListener('mousemove', this._onMouseMove, true);
    document.addEventListener('mouseup', this._onMouseUp, true);
  }

  _end(): void {
    if (!this._active) {
      return;
    }

    this._active = false;
    document.removeEventListener('mousemove', this._onMouseMove, true);
    document.removeEventListener('mouseup', this._onMouseUp, true);

    const el = nullthrows(this._el);
    el.style.width = this._w;
    el.style.height = this._h;
    el.className = 'molm-czi-image-resize-box';
    this._el = null;

    this._rafID && cancelAnimationFrame(this._rafID);
    this._rafID = null;
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

    const {direction} = this.props;
    const el = nullthrows(this._el);
    el.classList.remove(direction);

    this._end();
    this.props.onResizeEnd(this._ww, this._hh);
  };
}

class ImageResizeBox extends React.PureComponent {
  props: Props;

  _id = uuid();

  render(): React.ReactElement {
    const {onResizeEnd, width, height, src, fitToParent} = this.props;

    const style = {
      height: fitToParent ? FP_HEIGHT : height + 'px',
      width: fitToParent ? FP_WIDTH : width + 'px',
    };

    const boxID = this._id;

    const controls = Object.keys(ResizeDirection).map((key) => {
      return (
        <ImageResizeBoxControl
          boxID={boxID}
          config={ResizeDirection[key]}
          direction={key}
          fitToParent={fitToParent}
          height={height}
          key={key}
          onResizeEnd={onResizeEnd}
          width={width}
        />
      );
    });

    return (
      <span className="molm-czi-image-resize-box" id={boxID} style={style}>
        {controls}
        <img className="molm-czi-image-resize-box-image" src={src} />
      </span>
    );
  }
}

export default ImageResizeBox;
