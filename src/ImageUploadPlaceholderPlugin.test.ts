import ImageUploadPlaceholderPlugin, { customEditorView, uploadImageFiles,findImageUploadPlaceholder } from './ImageUploadPlaceholderPlugin';
import {
  Schema,
  Slice,
  ResolvedPos,
  Node,

  Node as PMNode,
} from 'prosemirror-model';
import { Decoration, DecorationSet } from 'prosemirror-view';
import { EditorState } from 'prosemirror-state';
import { createEditor, doc, p } from 'jest-prosemirror';

import { TextSelection } from 'prosemirror-state';
import { EditorView, DirectEditorProps } from 'prosemirror-view';
import { MultimediaPlugin } from '.';
import { NodeSpec } from './Types';
import { schema } from 'prosemirror-test-builder';
import { number } from 'prop-types';


describe('image upload place holder plugin', () => {
  const plugin = new MultimediaPlugin();
  const editor = createEditor(doc(p('<cursor>')), {
    plugins: [plugin],
  });


  it('should handle uploadImageFiles', () => {

    const state: EditorState = EditorState.create({
      schema: schema,
      selection: editor.selection,
      plugins: [new MultimediaPlugin()],
    });
    const view1 = new EditorView(document.querySelector('#editor'), {
      state,
    });
    const cusEdtView = {
      ...view1 as EditorView, runtime: {},
      readOnly: true,
      disabled: true
    };
    const view: customEditorView = cusEdtView as customEditorView;
    const filex: File = new File([], 'NEW FILE');
    expect(uploadImageFiles(view, [filex], { x: 1, y: 2 })).toBeDefined();


  });
  //  it('should handle uploadImageFiles',()=>{
  //   const imageNodeSpec = {
  //     inline: false,
  //     attrs: {
  //       src: {},
  //       alt: { default: null },
  //     },
  //     group: "block",
  //     draggable: true,
  //     parseDOM: [
  //       {
  //         tag: "img[src]",
  //         getAttrs: (dom) => ({
  //           src: dom.getAttribute("src"),
  //           alt: dom.getAttribute("alt"),
  //         }),
  //       },
  //     ],
  //     toDOM: (node) => ["img", { src: node.attrs.src, alt: node.attrs.alt }],
  //   };
  //   const mySchema = new Schema({
  //     nodes: {
  //       // Include the new image node type in the schema
  //       doc: schema.spec.nodes.doc,
  //       paragraph: schema.spec.nodes.paragraph,
  //       image: imageNodeSpec,
  //     },
  //     marks: schema.spec.marks,
  //   });
  //   const state: EditorState = EditorState.create({
  //       schema: mySchema,
  //       selection: editor.selection,
  //       plugins: [new MultimediaPlugin()],
  //     });
  //     const view1 = new EditorView(document.querySelector('#editor'), {
  //       state,
  //     });
  //     const cusEdtView = {
  //       ...view1 as EditorView, runtime: {},
  //       readOnly: true,
  //       disabled: true
  //     };
  //     const view: customEditorView = cusEdtView as customEditorView;
  //     const filex: File = new File([], 'NEW FILE');
  //   expect(uploadImageFiles(view,[filex],{x:1,y:2})).toBeDefined();


  // })
  it('should handle uploadImageFiles', () => {

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
            getAttrs(dom) {
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
    //const content = DOMParser.fromSchema(schema).parse(document.createElement('div').appendChild(document.createElement('img')));
    const editorState = EditorState.create({
      schema: mockSchema,
      plugins: [new MultimediaPlugin(), new ImageUploadPlaceholderPlugin()]
    });

    const mockEditorView = {
      state: editorState,
      dispatch: jest.fn(),
      posAtCoords: ({ left,
        top }) => {
        return {
          pos: 1,
          inside: 1,
        }
      },
      destroy: jest.fn(),
    };
    const customeditorView = {
      runtime: { canUploadImage: true, uploadImage: true },
      readOnly: false,
      disabled: false,

      ...mockEditorView
    } as unknown as customEditorView
    const mockFiles = [
      new File(['file1 content'], 'file1.jpeg', { type: 'image/jpeg' }),
      new File(['file2 content'], 'file2.gif', { type: 'image/gif' }),
      new File(['file3 content'], 'file3.png', { type: 'image/png' })
    ];

    expect(uploadImageFiles(customeditorView, mockFiles, { x: 1, y: 2 })).toBeDefined();


  })



  it('should handle uploadImageFiles if !imageType', () => {

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
    //const content = DOMParser.fromSchema(schema).parse(document.createElement('div').appendChild(document.createElement('img')));
    const editorState = EditorState.create({
      schema: mockSchema,
      plugins: [new MultimediaPlugin(), new ImageUploadPlaceholderPlugin()]
    });

    const mockEditorView = {
      state: editorState,
      dispatch: jest.fn(),
      posAtCoords: ({ left,
        top }) => {
        return {
          pos: 1,
          inside: 1,
        }
      },
      destroy: jest.fn(),
    };
    const customeditorView = {
      runtime: { canUploadImage: true, uploadImage: true },
      readOnly: false,
      disabled: false,

      ...mockEditorView
    } as unknown as customEditorView
    const mockFiles = [
      new File(['file1 content'], 'file1.jpeg', { type: 'image/jpeg' }),
      new File(['file2 content'], 'file2.gif', { type: 'image/gif' }),
      new File(['file3 content'], 'file3.png', { type: 'image/png' })
    ];

    expect(uploadImageFiles(customeditorView, mockFiles, { x: 1, y: 2 })).toBeFalsy();


  })

  it('should handle uploadImageFiles if files does not contain image filetype', () => {

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
            getAttrs(dom) {
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
    //const content = DOMParser.fromSchema(schema).parse(document.createElement('div').appendChild(document.createElement('img')));
    const editorState = EditorState.create({
      schema: mockSchema,
      plugins: [new MultimediaPlugin(), new ImageUploadPlaceholderPlugin()]
    });

    const mockEditorView = {
      state: editorState,
      dispatch: jest.fn(),
      posAtCoords: ({ left,
        top }) => {
        return {
          pos: 1,
          inside: 1,
        }
      },
      destroy: jest.fn(),
    };
    const customeditorView = {
      runtime: { canUploadImage: true, uploadImage: true },
      readOnly: false,
      disabled: false,

      ...mockEditorView
    } as unknown as customEditorView
    const mockFiles = [
      new File(['file1 content'], 'file1.txt', { type: 'image/txt' }),
      new File(['file2 content'], 'file2.txt', { type: 'image/txt' })

    ];

    expect(uploadImageFiles(customeditorView, mockFiles, { x: 1, y: 2 })).toBeFalsy();


  })

  it('should handle uploadImageFiles if plugins does not contain imageUploadPlaceholderPlugin', () => {

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
            getAttrs(dom) {
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
    //const content = DOMParser.fromSchema(schema).parse(document.createElement('div').appendChild(document.createElement('img')));
    const editorState = EditorState.create({
      schema: mockSchema,
      plugins: [new MultimediaPlugin()]
    });

    const mockEditorView = {
      state: editorState,
      dispatch: jest.fn(),
      posAtCoords: ({ left,
        top }) => {
        return {
          pos: 1,
          inside: 1,
        }
      },
      destroy: jest.fn(),
    };
    const customeditorView = {
      runtime: { canUploadImage: true, uploadImage: true },
      readOnly: false,
      disabled: false,

      ...mockEditorView
    } as unknown as customEditorView
    const mockFiles = [
      new File(['file1 content'], 'file1.jpeg', { type: 'image/jpeg' }),
      new File(['file2 content'], 'file2.gif', { type: 'image/gif' }),
      new File(['file3 content'], 'file3.png', { type: 'image/png' })
    ];

    expect(uploadImageFiles(customeditorView, mockFiles, { x: 1, y: 2 })).toBeFalsy();


  })

  it('should handle uploadImageFiles if poseAtCoords is null', () => {

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
            getAttrs(dom) {
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
    //const content = DOMParser.fromSchema(schema).parse(document.createElement('div').appendChild(document.createElement('img')));
    const editorState = EditorState.create({
      schema: mockSchema,
      plugins: [new MultimediaPlugin(), new ImageUploadPlaceholderPlugin()]
    });

    const mockEditorView = {
      state: editorState,
      dispatch: jest.fn(),
      posAtCoords: ({ left,
        top }) => null,
      destroy: jest.fn(),
    };
    const customeditorView = {
      runtime: { canUploadImage: true, uploadImage: true },
      readOnly: false,
      disabled: false,

      ...mockEditorView
    } as unknown as customEditorView
    const mockFiles = [
      new File(['file1 content'], 'file1.jpeg', { type: 'image/jpeg' }),
      new File(['file2 content'], 'file2.gif', { type: 'image/gif' }),
      new File(['file3 content'], 'file3.png', { type: 'image/png' })
    ];

    expect(uploadImageFiles(customeditorView, mockFiles, { x: 1, y: 2 })).toBeFalsy();


  })

  it('should handle uploadImageFiles if coords is null', () => {

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
            getAttrs(dom) {
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
    //const content = DOMParser.fromSchema(schema).parse(document.createElement('div').appendChild(document.createElement('img')));
    const editorState = EditorState.create({
      schema: mockSchema,
      plugins: [new MultimediaPlugin(), new ImageUploadPlaceholderPlugin()]
    });

    const mockEditorView = {
      state: editorState,
      dispatch: jest.fn(),
      posAtCoords: ({ left,
        top }) => {
        return {
          pos: 1,
          inside: 1,
        }
      },
      destroy: jest.fn(),
    };
    const customeditorView = {
      runtime: { canUploadImage: true, uploadImage: true },
      readOnly: false,
      disabled: false,

      ...mockEditorView
    } as unknown as customEditorView
    const mockFiles = [
      new File(['file1 content'], 'file1.jpeg', { type: 'image/jpeg' }),
      new File(['file2 content'], 'file2.gif', { type: 'image/gif' }),
      new File(['file3 content'], 'file3.png', { type: 'image/png' })
    ];

    expect(uploadImageFiles(customeditorView, mockFiles, undefined as unknown as { x: number; y: number; })).toBeDefined();


  })

  it('should handle uploadImageFiles', () => {

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
            getAttrs(dom) {
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
    //const content = DOMParser.fromSchema(schema).parse(document.createElement('div').appendChild(document.createElement('img')));
    const editorState = EditorState.create({
      schema: mockSchema,
      plugins: [new MultimediaPlugin(), new ImageUploadPlaceholderPlugin()]
    });

    const mockEditorView = {
      state: editorState,
      dispatch: jest.fn(),
      posAtCoords: ({ left,
        top }) => {
        return {
          pos: 1,
          inside: 1,
        }
      },
      destroy: jest.fn(),
    };
    const customeditorView = {
      runtime: { canUploadImage: true, uploadImage: true },
      readOnly: false,
      disabled: false,

      ...mockEditorView
    } as unknown as customEditorView
    const mockFiles = [
      new File(['file1 content'], 'file1.jpeg', { type: 'image/jpeg' }),
      new File(['file2 content'], 'file2.gif', { type: 'image/gif' }),
      new File(['file3 content'], 'file3.png', { type: 'image/png' })
    ];

    expect(uploadImageFiles(customeditorView, mockFiles, { x: 1, y: 2 })).toBeDefined();


  })





})
