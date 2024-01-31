import {ImageSourceCommand, insertImage } from './ImageSourceCommand';
import { Transform } from 'prosemirror-transform';
import { Schema } from 'prosemirror-model';
describe('insert image', () => {

  const mockSchema = new Schema({
    nodes: {
      doc: { content: 'image' },
      text: {},
      image: {
        inline: true,
        attrs: {
          src: { default: '' },
          alt: { default: null }
        },
        group: 'inline',
        draggable: true,
        parseDOM: [{
          tag: 'img[src]',
          getAttrs(dom: string | HTMLElement) {
            if (typeof dom === 'string') {
              return false;
            }
            return {
              src: dom.getAttribute('src'),
              alt: dom.getAttribute('alt')
            };
          }
        }],
        toDOM(node) {
          return ['img', { src: node.attrs.src, alt: node.attrs.alt || '' }];
        }
      }
    }
  });
  const mockTransaction = {
    // Define any properties or methods that your function requires.
    selection: { from: 0, to: 1 },
    tr: {
      selection: {},
    },
    insert: () => true
  } as unknown as Transform;

  const src = 'new_src';
  it('should handle insertimage', () => {
    expect(insertImage(mockTransaction, mockSchema, src)).toBeDefined();
  });

  it('should handle !selection', () => {
    const mockSchema = new Schema({
      nodes: {
        doc: { content: 'image' },
        text: {},
        image: {
          inline: true,
          attrs: {
            src: { default: '' },
            alt: { default: null }
          },
          group: 'inline',
          draggable: true,
          parseDOM: [{
            tag: 'img[src]',
            getAttrs(dom: string | HTMLElement) {
              if (typeof dom === 'string') {
                return false;
              }
              return {
                src: dom.getAttribute('src'),
                alt: dom.getAttribute('alt')
              };
            }
          }],
          toDOM(node) {
            return ['img', { src: node.attrs.src, alt: node.attrs.alt || '' }];
          }
        }
      }
    });
    const mockTransaction = {
      // Define any properties or methods that your function requires.

      tr: {
        selection: {},
      },
      insert: () => true
    } as unknown as Transform;

    const src = 'new_src';
    expect(insertImage(mockTransaction, mockSchema, src)).toBeDefined();
  });

  it('should handle !image', () => {
    const mockSchema = new Schema({
      nodes: {
        doc: { content: 'paragraph+' },
        text: {},
        paragraph: {
          content: 'text*'
        }
      },
      marks: {
        bold: {},
        italic: {}
      }
    });
    const mockTransaction = {
      // Define any properties or methods that your function requires.
      selection: {},
      tr: {
        selection: {},
      },
      insert: () => true
    } as unknown as Transform;

    const src = 'new_src';
    expect(insertImage(mockTransaction, mockSchema, src)).toBeDefined();
  });

});

describe('ImageSourceCommand ', () => {
  const imagesourcecommand = new ImageSourceCommand();
  it('should handle ImageSourceCommand', () => {
    expect(imagesourcecommand).toBeDefined();
  });
});
describe('inserimage', () => {
  it('should handle inserimage when src null', () => {
    const mockSchema = new Schema({
      nodes: {
        doc: { content: 'image' },
        text: {},
        image: {
          inline: true,
          attrs: {
            src: { default: '' },
            alt: { default: null }
          },
          group: 'inline',
          draggable: true,
          parseDOM: [{
            tag: 'img[src]',
            getAttrs(dom: string | HTMLElement) {
              if (typeof dom === 'string') {
                return false;
              }
              return {
                src: dom.getAttribute('src'),
                alt: dom.getAttribute('alt')
              };
            }
          }],
          toDOM(node) {
            return ['img', { src: node.attrs.src, alt: node.attrs.alt || '' }];
          }
        }
      }
    });
    const mockTransaction = {
      // Define any properties or methods that your function requires.
      selection: {},
      tr: {
        selection: {},
      },
      insert: () => true
    } as unknown as Transform;

    const src = '';
    expect(insertImage(mockTransaction, mockSchema, src)).toBeTruthy();
  });
});
