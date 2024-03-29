const cached: {[fonst: string]: boolean} = {};

export function canUseCSSFont(fontName: string): Promise<boolean> {
  const doc = document;

  if (cached[fontName]) {
    return Promise.resolve(cached[fontName]);
  }

  if (
    !doc.fonts?.check ||
    !doc.fonts.ready?.then ||
    !doc.fonts.status ||
    !doc.fonts.values
  ) {
    // Feature is not supported, install the CSS anyway
    // https://developer.mozilla.org/en-US/docs/Web/API/FontFaceSet/check#Browser_compatibility
    console.log('FontFaceSet is not supported');
    return Promise.resolve(false);
  }

  return new Promise((resolve) => {
    // https://stackoverflow.com/questions/5680013/how-to-be-notified-once-a-web-font-has-loaded
    // All fonts in use by visible text have loaded.
    const check = () => {
      if (doc.fonts.status !== 'loaded') {
        setTimeout(check, 350);
        return;
      }
      // Do not use `doc.fonts.check()` because it may return falsey result.
      const fontFaces = Array.from(doc.fonts.values());
      const matched = fontFaces.find((ff) => ff['family'] === fontName);
      const result = !!matched;
      cached[fontName] = result;
      resolve(result);
    };
    doc.fonts.ready.then(check);
  });
}
