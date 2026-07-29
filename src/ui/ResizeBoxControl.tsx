import cx from 'classnames';
import React from 'react';

import {clamp} from '@modusoperandi/licit-ui-commands';

export const MIN_SIZE = 20;
export const MAX_SIZE = 10000;
export const RESIZE_BOX_CLASS_NAME = 'molm-czi-image-resize-box';

export type ResizeHandleDirection =
  | 'top'
  | 'top_right'
  | 'right'
  | 'bottom_right'
  | 'bottom'
  | 'bottom_left'
  | 'left'
  | 'top_left';

export const RESIZE_HANDLE_DIRECTIONS: ResizeHandleDirection[] = [
  'top',
  'top_right',
  'right',
  'bottom_right',
  'bottom',
  'bottom_left',
  'left',
  'top_left',
];

const ResizeCursor: Record<
  ResizeHandleDirection,
  React.CSSProperties['cursor']
> = {
  top: 'n-resize',
  top_right: 'ne-resize',
  right: 'e-resize',
  bottom_right: 'se-resize',
  bottom: 's-resize',
  bottom_left: 'sw-resize',
  left: 'w-resize',
  top_left: 'nw-resize',
};

export type ResizeBoxControlProps = {
  boxID?: string;
  direction?: ResizeHandleDirection;
  height: number;
  onResizeEnd: (w: number, height: number) => void;
  width: number;
};

export class ResizeBoxControl<
  Props extends ResizeBoxControlProps,
> extends React.PureComponent<Props> {
  _active = false;
  _el?: HTMLElement;
  _h = '';
  _rafID?: number;
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
    const direction = this.props.direction ?? 'bottom';

    const className = cx({
      'molm-czi-image-resize-box-control': true,
      [direction]: true,
    });

    return (
      <button
        aria-label={`Resize ${this._getResizeTargetName()} ${direction.replace(
          '_',
          ' '
        )}`}
        className={className}
        onMouseDown={this._onMouseDown}
        style={{cursor: ResizeCursor[direction]}}
        type="button"
      />
    );
  }

  _syncSize = (): void => {
    if (!this._active) {
      return;
    }
    const {direction, width, height} = this.props;
    if (!direction) {
      throw new Error('Resize direction is not defined.');
    }

    const dx = (this._x2 - this._x1) * (/left/.test(direction) ? -1 : 1);
    const dy = (this._y2 - this._y1) * (/top/.test(direction) ? -1 : 1);

    const el = this._el;
    if (!el) {
      throw new Error('Resizable element not initialized.');
    }

    const aspect = width / height;
    let ww = clamp(MIN_SIZE, width + Math.round(dx), MAX_SIZE);
    let hh = clamp(MIN_SIZE, height + Math.round(dy), MAX_SIZE);

    if (direction.includes('_')) {
      hh = Math.max(ww / aspect, MIN_SIZE);
      ww = hh * aspect;
    }

    this._applyResizeSize(el, direction, Math.round(ww), Math.round(hh));
    this._ww = ww;
    this._hh = hh;
  };

  _start(e: React.MouseEvent): void {
    if (this._active) {
      this._end();
    }

    this._active = true;

    const {boxID, direction, width, height} = this.props;
    if (!boxID || !direction) {
      throw new Error('Resize box ID or direction is not defined.');
    }
    const el = document.getElementById(boxID);
    if (!el) {
      throw new Error(`Element with ID '${boxID}' not found.`);
    }
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

    const el = this._el;
    if (!el) {
      throw new Error('Resizable element not initialized.');
    }
    el.style.width = this._w;
    el.style.height = this._h;
    el.className = RESIZE_BOX_CLASS_NAME;
    this._el = undefined;
    if (this._rafID) {
      cancelAnimationFrame(this._rafID);
    }
    this._rafID = undefined;
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
    if (!direction) {
      throw new Error('Resize direction is not defined.');
    }
    const el = this._el;
    if (!el) {
      throw new Error('Resizable element not initialized.');
    }
    el.classList.remove(direction);

    this._end();
    this.props.onResizeEnd(this._ww, this._hh);
  };

  protected _applyResizeSize(
    _el: HTMLElement,
    _direction: ResizeHandleDirection,
    _width: number,
    _height: number
  ): void {
    throw new Error('Resize size handler is not implemented.');
  }

  protected _getResizeTargetName(): string {
    return 'media';
  }
}
