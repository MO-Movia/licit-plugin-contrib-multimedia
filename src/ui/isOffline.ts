export  function isOffline(): boolean {
  if (Object.hasOwn(window.navigator, 'onLine')) {
    return !window.navigator.onLine;
  }
  return false;
}
