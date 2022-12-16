/* eslint-disable */

import VideoNodeSpec from './VideoNodeSpec';

const node = {
  attrs: {
    id: '',
    align: null,
    alt: '',
    crop: null,
    height: 113,
    rotate: null,
    src: 'https://www.youtube.com/embed/ru60J99ojJw',
    title: '',
    width: 200,
  },
};

describe('VideoNodeSpec', () => {
  it('dom should have matching node attributes', () => {
    const outputspec = VideoNodeSpec.toDOM(node as any);
  });

  it('parse dom attributes', () => {
    const dom = document.createElement('span');

    dom.setAttribute('height', 113 as any);
    dom.setAttribute('src', 'https://www.youtube.com/embed/ru60J99ojJw' as any);
    dom.setAttribute('width', 200 as any);
    dom.setAttribute('align', 'right');

    const { id, align, alt,
      crop,
      height,
      rotate,
      src,
      title,
      width } = node.attrs;

    const attrs: any = {
      id,
      align,
      alt,
      crop,
      height,
      rotate,
      src,
      title,
      width,
    };
    attrs.alt = null;
    attrs.align = dom.getAttribute('align');
    attrs.height = dom.getAttribute('height') as any;

    attrs.src = dom.getAttribute('src');
    attrs.width = dom.getAttribute('width');
    const getAttrs = VideoNodeSpec.parseDOM[0].getAttrs(dom);
  });


  it('parse dom attributes', () => {
    const dom = document.createElement('span');

    dom.setAttribute('height', 113 as any);
    dom.setAttribute('src', 'https://www.youtube.com/embed/ru60J99ojJw' as any);
    dom.setAttribute('width', 200 as any);

    dom.style.cssFloat = 'left';
    const { id, align, alt,
      crop,
      height,
      rotate,
      src,
      title,
      width } = node.attrs;

    const attrs: any = {
      id,
      align,
      alt,
      crop,
      height,
      rotate,
      src,
      title,
      width,
    };
    attrs.alt = null;
    attrs.align = dom.getAttribute('align');
    attrs.height = dom.getAttribute('height') as any;

    attrs.src = dom.getAttribute('src');
    attrs.width = dom.getAttribute('width');

    const getAttrs = VideoNodeSpec.parseDOM[0].getAttrs(dom);
  });
  it('parse dom attributes', () => {
    const dom = document.createElement('span');

    dom.setAttribute('height', 113 as any);
    dom.setAttribute('src', 'https://www.youtube.com/embed/ru60J99ojJw' as any);
    dom.setAttribute('width', 200 as any);

    dom.style.display = 'block';
    const { id, align, alt,
      crop,
      height,
      rotate,
      src,
      title,
      width } = node.attrs;

    const attrs: any = {
      id,
      align,
      alt,
      crop,
      height,
      rotate,
      src,
      title,
      width,
    };
    attrs.alt = null;
    attrs.align = dom.getAttribute('align');
    attrs.height = dom.getAttribute('height') as any;

    attrs.src = dom.getAttribute('src');
    attrs.width = dom.getAttribute('width');

    const getAttrs = VideoNodeSpec.parseDOM[0].getAttrs(dom);
  });

  it('parse dom attributes', () => {
    const dom = document.createElement('span');

    dom.setAttribute('height', 113 as any);
    dom.setAttribute('src', 'https://www.youtube.com/embed/ru60J99ojJw' as any);
    dom.setAttribute('width', 200 as any);

    dom.style.cssFloat = 'right';
    const { id, align, alt,
      crop,
      height,
      rotate,
      src,
      title,
      width } = node.attrs;

    const attrs: any = {
      id,
      align,
      alt,
      crop,
      height,
      rotate,
      src,
      title,
      width,
    };
    attrs.alt = null;
    attrs.align = dom.getAttribute('align');
    attrs.height = dom.getAttribute('height') as any;

    attrs.src = dom.getAttribute('src');
    attrs.width = dom.getAttribute('width');

    const getAttrs = VideoNodeSpec.parseDOM[0].getAttrs(dom);
  });
});

