import {jest} from '@jest/globals';
import ResizeObserver from './ResizeObserver';
import {
  MEDIA_NODE_MAX_SIZE,
  getMaxResizeWidth,
  syncResizeObserver,
} from './mediaNodeViewUtils';

function setLayoutProp(
  el: HTMLElement,
  prop: 'clientWidth' | 'offsetParent' | 'offsetWidth',
  value: Element | number | null
): void {
  Object.defineProperty(el, prop, {
    configurable: true,
    value,
  });
}

describe('mediaNodeViewUtils', () => {
  it('calculates max resize width from the nearest layout parent', () => {
    const layoutParent = document.createElement('div');
    const wrapper = document.createElement('div');
    const media = document.createElement('span');

    layoutParent.style.boxSizing = 'border-box';
    layoutParent.style.paddingLeft = '10px';
    layoutParent.style.paddingRight = '6px';
    setLayoutProp(layoutParent, 'clientWidth', 200);
    setLayoutProp(layoutParent, 'offsetWidth', 200);
    setLayoutProp(wrapper, 'offsetParent', null);
    setLayoutProp(layoutParent, 'offsetParent', layoutParent);

    wrapper.appendChild(media);
    layoutParent.appendChild(wrapper);

    expect(getMaxResizeWidth(media, 20)).toBe(180);
  });

  it('falls back to minimum and default resize widths', () => {
    const layoutParent = document.createElement('div');
    const media = document.createElement('span');
    setLayoutProp(layoutParent, 'clientWidth', 10);
    setLayoutProp(layoutParent, 'offsetWidth', 10);
    setLayoutProp(layoutParent, 'offsetParent', layoutParent);
    layoutParent.appendChild(media);

    expect(getMaxResizeWidth(media, 20)).toBe(20);
    expect(getMaxResizeWidth(document.createElement('span'), 20)).toBe(
      MEDIA_NODE_MAX_SIZE
    );
  });

  it('observes, unobserves, and clears resize refs', () => {
    const onResize = jest.fn();
    const body = document.createElement('span');
    const ref = document.createElement('span');
    const observeSpy = jest.spyOn(ResizeObserver, 'observe');
    const unobserveSpy = jest.spyOn(ResizeObserver, 'unobserve');

    expect(syncResizeObserver(null, ref, onResize)).toBe(ref);
    expect(observeSpy).toHaveBeenCalledWith(ref, onResize);

    expect(syncResizeObserver(body, null, onResize)).toBeNull();
    expect(unobserveSpy).toHaveBeenCalledWith(body);

    expect(syncResizeObserver(null, null, onResize)).toBeNull();
  });
});
