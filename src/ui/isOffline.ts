export default function isOffline(): boolean {
  if (Object.prototype.hasOwnProperty.call(window.navigator, 'onLine')) {
    return !window.navigator.onLine;
  }
  return false;
}
