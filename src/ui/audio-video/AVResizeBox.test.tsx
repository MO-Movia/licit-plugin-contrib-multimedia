import React from 'react';
import ReactDOM from 'react-dom';
import VideoResizeBox, {
  VideoResizeBoxControl,
  MIN_SIZE,
  MAX_SIZE
} from './AVResizeBox';
import { clamp } from '@modusoperandi/licit-ui-commands';

jest.mock('@modusoperandi/licit-ui-commands', () => ({
  clamp: jest.fn((min, val, max) => Math.min(Math.max(val, min), max)),
}));

jest.mock('uuid', () => ({
  v1: jest.fn(() => 'mock-id'),
}));

(global as any).nullthrows = (v: any) => {
  if (v == null) throw new Error('Null value');
  return v;
};

describe('VideoResizeBox (without RTL)', () => {
  let container: HTMLElement;
  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    jest.clearAllMocks();
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      cb(0);
      return 1;
    });
    jest.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(container);
    document.body.innerHTML = '';
    jest.restoreAllMocks();
  });

  it('renders correctly when resizeAllowed=true', () => {
    ReactDOM.render(
      <VideoResizeBox
        height={100}
        width={200}
        src="demo.mp4"
        onResizeEnd={jest.fn()}
        resizeAllowed={true}
      />,
      container
    );

    const span = container.querySelector('.molm-czi-image-resize-box')!;
    expect(span.style.width).toBe('200px');
    expect(span.style.height).toBe('100px');
  });

  it('renders correctly when resizeAllowed=false (renders 8 controls)', () => {
    ReactDOM.render(
      <VideoResizeBox
        height={150}
        width={300}
        src="demo.mp4"
        onResizeEnd={jest.fn()}
        resizeAllowed={false}
      />,
      container
    );
    const controls = container.querySelectorAll('.molm-czi-image-resize-box-control');
    expect(controls.length).toBe(8);
  });
});

describe('VideoResizeBoxControl', () => {
  let container: HTMLElement;
  let el: HTMLElement;
  let onResizeEnd: jest.Mock;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    el = document.createElement('span');
    el.id = 'mock-id';
    el.className = 'molm-czi-image-resize-box';
    document.body.appendChild(el);
    onResizeEnd = jest.fn();

    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      cb(0);
      return 1;
    });
    jest.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(container);
    document.body.innerHTML = '';
    jest.restoreAllMocks();
  });

  function mountControl(direction: any = 'right') {
    ReactDOM.render(
      <VideoResizeBoxControl
        boxID="mock-id"
        direction={direction}
        height={100}
        width={200}
        onResizeEnd={onResizeEnd}
      />,
      container
    );
    return container.querySelector('span') as HTMLElement;
  }

  function triggerMouseEvent(target: HTMLElement | Document, type: string, props: any = {}) {
    const event = new MouseEvent(type, { bubbles: true, cancelable: true, ...props });
    // Object.assign(event, props);
    target.dispatchEvent(event);
  }

  it('renders with direction class', () => {
    const control = mountControl('top_left');
    expect(control.classList.contains('top_left')).toBe(true);
  });

  it('handles mousedown and registers listeners', () => {
    const control = mountControl('right');
    const spyAdd = jest.spyOn(document, 'addEventListener');
    triggerMouseEvent(control, 'mousedown', { clientX: 10, clientY: 10 });
    expect(spyAdd).toHaveBeenCalledWith('mousemove', expect.any(Function), true);
  });

  it('handles mousemove and calls clamp', () => {
    const control = mountControl('bottom_right');
    triggerMouseEvent(control, 'mousedown', { clientX: 5, clientY: 5 });
    triggerMouseEvent(document, 'mousemove', { clientX: 25, clientY: 25 });
    expect(clamp).toHaveBeenCalled();
  });

  it('handles mouseup and triggers onResizeEnd', () => {
    const control = mountControl('bottom');
    triggerMouseEvent(control, 'mousedown', { clientX: 0, clientY: 0 });
    triggerMouseEvent(document, 'mouseup', { clientX: 50, clientY: 50 });
    expect(onResizeEnd).toHaveBeenCalled();
  });

  it('componentWillUnmount cleans up listeners', () => {
    const spy = jest.spyOn(VideoResizeBoxControl.prototype as any, '_end');
    ReactDOM.render(
      <VideoResizeBoxControl
        boxID="mock-id"
        direction="bottom"
        height={100}
        width={200}
        onResizeEnd={onResizeEnd}
      />,
      container
    );
    ReactDOM.unmountComponentAtNode(container);
    expect(spy).toHaveBeenCalled();
  });

  xit('ignores _end when inactive', () => {
    const control = mountControl('left');
    const comp = (control as any)._owner.stateNode;
    comp._active = false;
    comp._end();
    expect(comp._el).toBeUndefined();
  });

 
});
