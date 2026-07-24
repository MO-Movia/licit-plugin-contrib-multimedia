import ResizeObserver from './ResizeObserver';

import type {ResizeObserverEntry} from './ResizeObserver';

export const EMPTY_MEDIA_SRC =
  'data:image/gif;base64,' +
  'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

export const MEDIA_NODE_MAX_SIZE = 100000;
export const MEDIA_PLACEHOLDER_SIZE = 24;

/* This value must be synced with the margin defined at .czi-image-view */
const MEDIA_MARGIN = 2;

export function getMaxResizeWidth(
  el: HTMLElement,
  minSize: number
): number {
  let node = el.parentElement;
  while (node && !node.offsetParent) {
    node = node.parentElement;
  }
  const offsetParent = node?.offsetParent;
  if (offsetParent instanceof HTMLElement && offsetParent.offsetWidth > 0) {
    const style = el.ownerDocument.defaultView.getComputedStyle(offsetParent);
    let width = offsetParent.clientWidth - MEDIA_MARGIN * 2;
    if (style.boxSizing === 'border-box') {
      const pl = Number.parseInt(style.paddingLeft, 10);
      const pr = Number.parseInt(style.paddingRight, 10);
      width -= pl + pr;
    }
    return Math.max(width, minSize);
  }
  return MEDIA_NODE_MAX_SIZE;
}

export function syncResizeObserver(
  body: HTMLElement | null | undefined,
  ref: HTMLSpanElement | null | undefined,
  onResize: (info: ResizeObserverEntry) => void
): HTMLElement | null {
  if (ref) {
    ResizeObserver.observe(ref, onResize);
    return ref;
  }

  if (body) {
    ResizeObserver.unobserve(body);
  }
  return null;
}
