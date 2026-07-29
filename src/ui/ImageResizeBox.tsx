import React from 'react';

import {uuid} from './uuid';

import {FP_WIDTH} from '../Constants';
import {
  RESIZE_HANDLE_DIRECTIONS,
  ResizeBoxControl,
  ResizeBoxControlProps,
  ResizeHandleDirection,
} from './ResizeBoxControl';
export {MAX_SIZE, MIN_SIZE} from './ResizeBoxControl';

type Props = {
  height: number;
  onResizeEnd: (w: number, height: number) => void;
  src: string;
  width: number;
  fitToParent: boolean;
};

function applyImageResizeSize(
  el: HTMLElement,
  direction: ResizeHandleDirection,
  width: number,
  height: number,
  fitToParent: boolean
): void {
  if (direction === 'top' || direction === 'bottom') {
    el.style.height = height + 'px';
    return;
  }

  el.style.width = fitToParent ? FP_WIDTH : width + 'px';
  if (direction.includes('_')) {
    el.style.height = height + 'px';
  }
}

type ImageResizwBoxProps = ResizeBoxControlProps & {
  fitToParent: boolean;
};
export class ImageResizeBoxControl extends ResizeBoxControl<ImageResizwBoxProps> {
  declare props: ImageResizwBoxProps;

  protected _applyResizeSize(
    el: HTMLElement,
    direction: ResizeHandleDirection,
    width: number,
    height: number
  ): void {
    applyImageResizeSize(el, direction, width, height, this.props.fitToParent);
  }

  protected _getResizeTargetName(): string {
    return 'image';
  }
}

export class ImageResizeBox extends React.PureComponent {
  declare props: Props;

  _id = uuid();

  render(): React.ReactElement {
    const {onResizeEnd, width, height, src, fitToParent} = this.props;

    const style: React.CSSProperties = {
      height: height + 'px',
      width: fitToParent ? FP_WIDTH : width + 'px',
    };

    if (fitToParent) {
      style.padding = '0';
      style.margin = '0';
    }

    const boxID = this._id;

    const controls = RESIZE_HANDLE_DIRECTIONS.map((direction) => {
      return (
        <ImageResizeBoxControl
          boxID={boxID}
          direction={direction}
          fitToParent={fitToParent}
          height={height}
          key={direction}
          onResizeEnd={onResizeEnd}
          width={width}
        />
      );
    });

    return (
      <span className="molm-czi-image-resize-box" id={boxID} style={style}>
        {controls}
        <img alt='unavailable' className="molm-czi-image-resize-box-image" src={src} />
      </span>
    );
  }
}
