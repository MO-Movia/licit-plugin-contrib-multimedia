import React from 'react';

import { v1 as uuid } from 'uuid';
import {
  RESIZE_HANDLE_DIRECTIONS,
  ResizeBoxControl,
  ResizeBoxControlProps,
  ResizeHandleDirection,
} from './ResizeBoxControl';
export {MAX_SIZE, MIN_SIZE} from './ResizeBoxControl';

export type VideoResizeProps = {
  height: number;
  onResizeEnd: (w: number, height: number) => void;
  width: number;
  src: string;// NOSONAR
};

export type ResizeHadleDirection = ResizeHandleDirection;

function applyVideoResizeSize(
  el: HTMLElement,
  direction: ResizeHandleDirection,
  width: number,
  height: number
): void {
  if (direction === 'top' || direction === 'bottom') {
    el.style.height = height + 'px';
    return;
  }

  el.style.width = width + 'px';
  if (direction.includes('_')) {
    el.style.height = height + 'px';
  }
}

type VideoResizeBoxControlProps = ResizeBoxControlProps & {
  src?: string;// NOSONAR
};
export class VideoResizeBoxControl extends ResizeBoxControl<VideoResizeBoxControlProps> {
  declare props: VideoResizeBoxControlProps;

  protected _applyResizeSize(
    el: HTMLElement,
    direction: ResizeHandleDirection,
    width: number,
    height: number
  ): void {
    applyVideoResizeSize(el, direction, width, height);
  }

  protected _getResizeTargetName(): string {
    return 'video';
  }
}

export class VideoResizeBox extends React.PureComponent {
  declare props: VideoResizeProps;

  _id = uuid();

  render(): React.ReactElement<VideoResizeBoxControl> {
    const { onResizeEnd, width, height } = this.props;

    const style = {
      height: height + 'px',
      width: width + 'px',
    };

    const boxID = this._id;

    const controls = RESIZE_HANDLE_DIRECTIONS.map((direction) => {
      return (
        <VideoResizeBoxControl
          boxID={boxID}
          direction={direction}
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
      </span>
    );
  }
}
