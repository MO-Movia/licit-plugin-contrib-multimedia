import ResizeObserver from 'resize-observer-polyfill';

// flow type copied from
// https://github.com/que-etc/resize-observer-polyfill/blob/master/src/index.js.flow

type ClientRectLikeReadOnly = {
  x: number;
  y: number;
  width: number;
  height: number;
  top: number;
  right: number;
  bottom: number;
  left: number;
};

type ResizeCallback = (r: ResizeObserverEntry) => void;

type Entries = ReadonlyArray<ResizeObserverEntry>;

// Lightweight utilities to make observing resize of DOM element easier
// with `ResizeObserver`.
// See https://developers.google.com/web/updates/2016/10/resizeobserver
// Usage:
//   `ResizeObserver.observe(element, (entry) => console.log(entry))`
//   `ResizeObserver.unobserve(element)`

export type ResizeObserverEntry = {
  target: Element;
  contentRect: ClientRectLikeReadOnly;
};

let instance: ResizeObserver | null = null;

const nodesObserving: Map<Element, Array<ResizeCallback>> = new Map();

function onResizeObserve(entries: Entries): void {
  entries.forEach(handleResizeObserverEntry);
}

function handleResizeObserverEntry(entry: ResizeObserverEntry): void {
  const node = entry.target;
  const callbacks = nodesObserving.get(node);
  const executeCallback = (cb) => cb(entry);
  callbacks?.forEach(executeCallback);
}

export function observe(
  node: HTMLElement,
  callback: (ResizeObserverEntry) => void
): void {
  const el = node;
  const observer = instance || (instance = new ResizeObserver(onResizeObserve));
  if (nodesObserving.has(el)) {
    // Already observing node.
    const callbacks = nodesObserving.get(el);
    callbacks.push(callback);
  } else {
    const callbacks = [callback];
    nodesObserving.set(el, callbacks);
    observer.observe(el);
  }
}

export function unobserve(node: HTMLElement, callback?: ResizeCallback): void {
  const observer = instance;
  if (!observer) {
    return;
  }
  const el = node;
  observer.unobserve(el);

  // Remove the passed in callback from the callbacks of the observed node
  // And, if no more callbacks then stop observing the node
  const callbacks =
    nodesObserving.get(el)?.filter((cb) => cb !== callback) ?? [];
  if (callbacks.length > 0) {
    nodesObserving.set(el, callbacks);
  } else {
    nodesObserving.delete(el);
  }

  if (!nodesObserving.size) {
    // We have nothing to observe. Stop observing, which stops the
    // ResizeObserver instance from receiving notifications of
    // DOM resizing. Until the observe() method is used again.
    // According to specification a ResizeObserver is deleted by the garbage
    // collector if the target element is deleted.
    observer.disconnect();
    instance = null;
  }
}

export default {
  observe,
  unobserve,
};
