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
  callback: (entry: ResizeObserverEntry) => void
): void {
  const el = node;
  const observer = instance || (instance = new ResizeObserver(onResizeObserve));

  if (nodesObserving.has(el)) {
    // Node is already being observed, just add the new callback
    const callbacks = nodesObserving.get(el);
    if (callbacks) {
      callbacks.push(callback);
    }
  } else {
    // First time observing this node
    nodesObserving.set(el, [callback]);
    observer.observe(el);
  }
}

export function unobserve(node: HTMLElement, callback?: ResizeCallback): void {
  const observer = instance;
  if (!observer) return;

  const el = node;
  observer.unobserve(el);

  if (callback) {
    const existingCallbacks = nodesObserving.get(el);
    if (existingCallbacks) {
      const filteredCallbacks = existingCallbacks.filter(cb => cb !== callback);
      if (filteredCallbacks.length > 0) {
        nodesObserving.set(el, filteredCallbacks);
      } else {
        nodesObserving.delete(el);
      }
    }
  } else {
    // Remove all callbacks if no specific one is provided
    nodesObserving.delete(el);
  }

  // Disconnect the observer if no nodes are left
  if (nodesObserving.size === 0) {
    observer.disconnect();
    instance = null;
  }
}

export default {
  observe,
  unobserve,
};
