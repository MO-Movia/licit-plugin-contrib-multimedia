import {isOffline} from '../isOffline';
import url from 'url';
import { AVEditorState } from './AVEditor';

export type AVResult = {
  complete: boolean;
  height: number;
  id: string;
  src: string;
  width: number;
  isAudio: boolean;
};

const cache: { [src: string]: AVResult } = {};
const queue: {
  config: AVEditorState | undefined;
  resolve: (value: AVResult | PromiseLike<AVResult>) => void;
  reject: (reason?: AVResult | PromiseLike<AVResult>) => void;
}[] = [];

export default function resolveAV(
  config?: AVEditorState
): Promise<AVResult> {
  return new Promise((resolve, reject) => {
    const bag = { config, resolve, reject };
    queue.push(bag);
    processQueue();
  });
}

function processQueue() {
  const bag = queue.shift();
  if (bag) {
    processPromise(bag.config, bag.resolve, bag.reject);
  }
}

function processPromise(
  config: AVEditorState | undefined,
  resolve: (value: AVResult | PromiseLike<AVResult>) => void,
  _reject: (value: AVResult | PromiseLike<AVResult>) => void
): void {
  const result: AVResult = {
    complete: true,
    height: config?.height ?? 100,
    id: config?.id ?? '',
    src: config?.src ?? '',
    width: config?.width ?? 100,
    isAudio: config?.isAudio ?? false,
  };

  if (isOffline()) {
    resolve(result);
    return;
  }

  const srcStr = config?.src ?? '';
  if (!srcStr) {
    resolve(result);
    return;
  } else if (cache[srcStr]) {
    const cachedResult = { ...cache[srcStr] };
    resolve(cachedResult);
    return;
  }

  const parsedURL = url.parse(srcStr);
  // [FS] IRAD-1007 2020-07-13
  // Removed the port validation from here
  const protocol = parsedURL.protocol;
  if (!/(http:|https:|data:)/.test(protocol || window.location.protocol)) {
    resolve(result);
    return;
  }

  resolve(result);
  // [FS] IRAD-1006 2020-07-17
  // Fix: Inconsistent behavior on image load
  // Avoid image caching remove the below line
  cache[srcStr] = { ...result };
}
