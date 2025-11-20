import { ImageNodeView, ImageViewBody } from './ImageNodeView';
import { Schema, Node } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { EditorFocused, NodeViewProps } from './CustomNodeView';
import ResizeObserver from './ResizeObserver';
import { PopUpHandle } from '@modusoperandi/licit-ui-commands';

describe('ImageNodeView', () => {
  const mockSchema = new Schema({
    nodes: {
      doc: { content: 'image' },
      text: {},
      image: {
        inline: true,
        attrs: {
          align: { default: 'left' },
          fitToParent: { default: true },
        },
        group: 'inline',
        draggable: true,
        parseDOM: [
          {
            tag: 'img[src]',
            getAttrs(dom: string | HTMLElement) {
              if (typeof dom === 'string') {
                return false;
              }
              return {
                align: dom.getAttribute('align'),
                fitToParent: dom.getAttribute('fitToParent'),
              };
            },
          },
        ],
        toDOM(node) {
          return ['img', { src: node.attrs.src, align: node.attrs.align || '' }];
        },
      },
    },
  });

  const editorState = EditorState.create({
    schema: mockSchema,
    plugins: [],
  });

  const el = document.createElement('div');
  const mockEditorView = {
    state: editorState,
    dispatch: jest.fn(),
    posAtCoords: () => ({
      pos: 1,
      inside: 1,
    }),
    destroy: jest.fn(),
    dom: el,
  };

  const editorfocused = {
    focused: true,
    runtime: {},
    readOnly: true,
    ...mockEditorView,
  } as unknown as EditorFocused;

  const mockImageNode = Node.fromJSON(mockSchema, {
    type: 'image',
    attrs: {
      align: 'left',
      fitToParent: 'fit',
    },
  }) as unknown as Node;

  it('should be defined', () => {
    const imagenodeview = new ImageNodeView(
      mockImageNode,
      editorfocused,
      () => 1,
      []
    );
    expect(imagenodeview).toBeDefined();
  });

  it('should create DOM element with alignment class', () => {
    const imagenodeview = new ImageNodeView(
      mockImageNode,
      editorfocused,
      () => 1,
      []
    );
    imagenodeview.props = {
      decorations: [],
      editorView: editorfocused,
      getPos: () => 1,
      node: { attrs: { align: 'center', fitToParent: false } } as unknown as Node,
      dom: document.createElement('img'),
      selected: true,
      focused: true,
    };
    const domEl = imagenodeview.createDOMElement();
    expect(domEl.className).toContain('molm-czi-image-view');
    expect(domEl.className).toContain('align-center');
  });

  it('should create DOM element without alignment class', () => {
    const imagenodeview = new ImageNodeView(
      mockImageNode,
      editorfocused,
      () => 1,
      []
    );
    imagenodeview.props = {
      decorations: [],
      editorView: editorfocused,
      getPos: () => 1,
      node: { attrs: { align: null, fitToParent: false } } as unknown as Node,
      dom: document.createElement('img'),
      selected: false,
      focused: false,
    };
    const domEl = imagenodeview.createDOMElement();
    expect(domEl.className).toContain('molm-czi-image-view');
    expect(domEl.className).not.toContain('align-');
  });

  it('should apply fitToParent styles', () => {
    const imagenodeview = new ImageNodeView(
      mockImageNode,
      editorfocused,
      () => 1,
      []
    );
    imagenodeview.props = {
      decorations: [],
      editorView: editorfocused,
      getPos: () => 1,
      node: { attrs: { align: 'left', fitToParent: true } } as unknown as Node,
      dom: document.createElement('img'),
      selected: false,
      focused: false,
    };
    const domEl = imagenodeview.createDOMElement();
    expect(domEl.style.width).toBeTruthy();
    expect(domEl.style.padding).toBe('0px');
    expect(domEl.style.margin).toBe('0px');
  });

  it('should update and return true', () => {
    const imagenodeview = new ImageNodeView(
      mockImageNode,
      editorfocused,
      () => 1,
      []
    );
    imagenodeview.props = {
      decorations: [],
      editorView: editorfocused,
      getPos: () => 1,
      node: { attrs: { align: 'left', fitToParent: false } } as unknown as Node,
      dom: document.createElement('img'),
      selected: false,
      focused: false,
    };
    const result = imagenodeview.update(mockImageNode, []);
    expect(result).toBe(true);
  });

  it('should ignore mutations', () => {
    const imagenodeview = new ImageNodeView(
      mockImageNode,
      editorfocused,
      () => 1,
      []
    );
    expect(imagenodeview.ignoreMutation()).toBe(true);
  });
});

describe('ImageViewBody', () => {
  const mockSchema = new Schema({
    nodes: {
      doc: { content: 'image' },
      text: {},
      image: {
        inline: true,
        attrs: {
          align: { default: 'left' },
          fitToParent: { default: true },
        },
        group: 'inline',
        draggable: true,
        parseDOM: [
          {
            tag: 'img[src]',
            getAttrs(dom: string | HTMLElement) {
              if (typeof dom === 'string') {
                return false;
              }
              return {
                align: dom.getAttribute('align'),
                fitToParent: dom.getAttribute('fitToParent'),
              };
            },
          },
        ],
        toDOM(node) {
          return ['img', { src: node.attrs.src, align: node.attrs.align || '' }];
        },
      },
    },
  });

  const editorState = EditorState.create({
    schema: mockSchema,
    plugins: [],
  });

  const el = document.createElement('div');
  const mockEditorView = {
    state: editorState,
    dispatch: jest.fn(),
    posAtCoords: () => ({
      pos: 1,
      inside: 1,
    }),
    destroy: jest.fn(),
    dom: el,
  };

  const editorfocused = {
    focused: true,
    runtime: {},
    readOnly: true,
    ...mockEditorView,
  } as unknown as EditorFocused;

  const mockImageNode = Node.fromJSON(mockSchema, {
    type: 'image',
    attrs: {
      align: 'left',
      fitToParent: 'fit',
    },
  }) as unknown as Node;

  const mockPopupHandle = {
    close: () => undefined,
    update: () => undefined,
  } as unknown as PopUpHandle;

  it('should be defined', () => {
    const imageviewbody = new ImageViewBody(
      mockImageNode as unknown as NodeViewProps,
      editorfocused
    );
    expect(imageviewbody).toBeDefined();
  });

  it('should handle componentDidMount', () => {
    const imageviewbody = new ImageViewBody(
      mockImageNode as unknown as NodeViewProps,
      editorfocused
    );
    imageviewbody.props = {
      decorations: [],
      editorView: editorfocused,
      getPos: () => 1,
      node: { attrs: { align: 'left', fitToParent: 'fit' } } as unknown as Node,
      dom: document.createElement('img'),
      selected: false,
      focused: false,
    };
    imageviewbody.componentDidMount();
    expect(imageviewbody._mounted).toBe(true);
  });

  it('should handle componentWillUnmount', () => {
    const imageviewbody = new ImageViewBody(
      mockImageNode as unknown as NodeViewProps,
      editorfocused
    );
    imageviewbody._inlineEditor = mockPopupHandle;
    const spy = jest.spyOn(imageviewbody._inlineEditor, 'close');
    imageviewbody.componentWillUnmount();
    expect(spy).toHaveBeenCalled();
    expect(imageviewbody._mounted).toBe(false);
  });

  it('should handle componentWillUnmount without inlineEditor', () => {
    const imageviewbody = new ImageViewBody(
      mockImageNode as unknown as NodeViewProps,
      editorfocused
    );
    imageviewbody._inlineEditor = undefined;
    imageviewbody.componentWillUnmount();
    expect(imageviewbody._mounted).toBe(false);
  });

  it('should handle componentDidUpdate with src change', () => {
    const imageviewbody = new ImageViewBody(
      mockImageNode as unknown as NodeViewProps,
      editorfocused
    );
    const spy = jest.spyOn(imageviewbody, '_resolveOriginalSize');
    const prevNode = {
      attrs: { src: 'old-src', align: 'left' },
    } as unknown as Node;

    imageviewbody.props = {
      decorations: [],
      editorView: editorfocused,
      getPos: () => 1,
      node: { attrs: { src: 'new-src', align: 'left' } } as unknown as Node,
      dom: document.createElement('img'),
      selected: false,
      focused: false,
    };

    imageviewbody.componentDidUpdate({
      ...imageviewbody.props,
      node: prevNode,
    });
    expect(spy).toHaveBeenCalled();
  });

  it('should handle componentDidUpdate without src change', () => {
    const imageviewbody = new ImageViewBody(
      mockImageNode as unknown as NodeViewProps,
      editorfocused
    );
    const spy = jest.spyOn(imageviewbody, '_renderInlineEditor');

    imageviewbody.props = {
      decorations: [],
      editorView: editorfocused,
      getPos: () => 1,
      node: { attrs: { src: 'same-src', align: 'left' } } as unknown as Node,
      dom: document.createElement('img'),
      selected: false,
      focused: false,
    };

    imageviewbody.componentDidUpdate({
      ...imageviewbody.props,
    });
    expect(spy).toHaveBeenCalled();
  });

  it('should render with loading state', () => {
    const imageviewbody = new ImageViewBody(
      mockImageNode as unknown as NodeViewProps,
      editorfocused
    );
    imageviewbody.state = {
      maxSize: {
        width: 10000,
        height: 10000,
        complete: false,
      },
      originalSize: {
        src: '',
        complete: false,
        height: 0,
        width: 0,
      },
    };
    imageviewbody.props = {
      decorations: [],
      editorView: editorfocused,
      getPos: () => 1,
      node: {
        attrs: {
          src: 'test',
          align: 'left',
          crop: null,
          rotate: null,
          width: 100,
          height: 100,
          fitToParent: false,
        },
      } as unknown as Node,
      dom: document.createElement('img'),
      selected: false,
      focused: false,
    };
    const result = imageviewbody.render();
    expect(result).toBeDefined();
    expect(result.props.className).toContain('error');
  });

  it('should render with error state', () => {
    const imageviewbody = new ImageViewBody(
      mockImageNode as unknown as NodeViewProps,
      editorfocused
    );
    imageviewbody.state = {
      maxSize: {
        width: 10000,
        height: 10000,
        complete: true,
      },
      originalSize: {
        src: 'test-src',
        complete: false,
        height: 0,
        width: 0,
      },
    };
    imageviewbody.props = {
      decorations: [],
      editorView: editorfocused,
      getPos: () => 1,
      node: {
        attrs: {
          src: 'test',
          align: 'left',
          crop: null,
          rotate: null,
          width: 100,
          height: 100,
          fitToParent: false,
        },
      } as unknown as Node,
      dom: document.createElement('img'),
      selected: false,
      focused: false,
    };
    const result = imageviewbody.render();
    expect(result).toBeDefined();
    expect(result.props.className).toContain('error');
  });

  it('should render with active state', () => {
    const imageviewbody = new ImageViewBody(
      mockImageNode as unknown as NodeViewProps,
      editorfocused
    );
    editorfocused.readOnly = false;
    imageviewbody.state = {
      maxSize: {
        width: 10000,
        height: 10000,
        complete: true,
      },
      originalSize: {
        src: 'test-src',
        complete: true,
        height: 1000,
        width: 1000,
      },
    };
    imageviewbody.props = {
      decorations: [],
      editorView: editorfocused,
      getPos: () => 1,
      node: {
        attrs: {
          src: 'test',
          align: 'left',
          crop: null,
          rotate: null,
          width: 100,
          height: 100,
          fitToParent: false,
        },
      } as unknown as Node,
      dom: document.createElement('img'),
      selected: false,
      focused: true,
    };
    const result = imageviewbody.render();
    expect(result).toBeDefined();
    expect(result.props.className).toContain('active');
    editorfocused.readOnly = true;
  });

  it('should render with crop data', () => {
    const imageviewbody = new ImageViewBody(
      mockImageNode as unknown as NodeViewProps,
      editorfocused
    );
    imageviewbody.state = {
      maxSize: {
        width: 10000,
        height: 10000,
        complete: true,
      },
      originalSize: {
        src: 'test-src',
        complete: true,
        height: 1000,
        width: 1000,
      },
    };
    imageviewbody.props = {
      decorations: [],
      editorView: editorfocused,
      getPos: () => 1,
      node: {
        attrs: {
          src: 'test',
          align: 'left',
          crop: null,
          rotate: null,
          width: 100,
          height: 100,
          fitToParent: false,
          cropData: {
            width: 50,
            height: 50,
            top: 10,
            left: 10,
          },
        },
      } as unknown as Node,
      dom: document.createElement('img'),
      selected: false,
      focused: false,
    };
    const result = imageviewbody.render();
    expect(result).toBeDefined();
  });

  it('should render with rotate transform', () => {
    const imageviewbody = new ImageViewBody(
      mockImageNode as unknown as NodeViewProps,
      editorfocused
    );
    imageviewbody.state = {
      maxSize: {
        width: 10000,
        height: 10000,
        complete: true,
      },
      originalSize: {
        src: 'test-src',
        complete: true,
        height: 1000,
        width: 1000,
      },
    };
    imageviewbody.props = {
      decorations: [],
      editorView: editorfocused,
      getPos: () => 1,
      node: {
        attrs: {
          src: 'test',
          align: 'left',
          crop: { width: 100, height: 100, left: 0, top: 0 },
          rotate: 1.57,
          width: 100,
          height: 100,
          fitToParent: false,
        },
      } as unknown as Node,
      dom: document.createElement('img'),
      selected: false,
      focused: false,
    };
    const result = imageviewbody.render();
    expect(result).toBeDefined();
  });

  it('should scale down image when exceeds maxSize', () => {
    const imageviewbody = new ImageViewBody(
      mockImageNode as unknown as NodeViewProps,
      editorfocused
    );
    imageviewbody.state = {
      maxSize: {
        width: 500,
        height: 10000,
        complete: true,
      },
      originalSize: {
        src: 'test-src',
        complete: true,
        height: 1000,
        width: 1000,
      },
    };
    imageviewbody.props = {
      decorations: [],
      editorView: editorfocused,
      getPos: () => 1,
      node: {
        attrs: {
          src: 'test',
          align: 'left',
          crop: null,
          rotate: null,
          width: 1000,
          height: 1000,
          fitToParent: false,
        },
      } as unknown as Node,
      dom: document.createElement('img'),
      selected: false,
      focused: false,
    };
    const result = imageviewbody.render();
    expect(result).toBeDefined();
  });

  it('should render with fitToParent styles', () => {
    const imageviewbody = new ImageViewBody(
      mockImageNode as unknown as NodeViewProps,
      editorfocused
    );
    imageviewbody.state = {
      maxSize: {
        width: 10000,
        height: 10000,
        complete: true,
      },
      originalSize: {
        src: 'test-src',
        complete: true,
        height: 1000,
        width: 1000,
      },
    };
    imageviewbody.props = {
      decorations: [],
      editorView: editorfocused,
      getPos: () => 1,
      node: {
        attrs: {
          src: 'test',
          align: 'left',
          crop: null,
          rotate: null,
          width: 100,
          height: 100,
          fitToParent: true,
        },
      } as unknown as Node,
      dom: document.createElement('img'),
      selected: false,
      focused: false,
    };
    const result = imageviewbody.render();
    expect(result).toBeDefined();
  });

  it('should handle assignVal with loading state', () => {
    const imageviewbody = new ImageViewBody(
      mockImageNode as unknown as NodeViewProps,
      editorfocused
    );
    const result = imageviewbody.assignVal(
      {
        src: 'test-src',
        complete: false,
        height: 0,
        width: 0,
      },
      false,
      true
    );
    expect(result.loading).toBe(false);
    expect(result.active).toBe(false);
    expect(result.aspectRatio).toBe(NaN);
    expect(result.error).toBe(true);
  });

  it('should handle assignVal when image is truly loading (default originalSize)', () => {
    const imageviewbody = new ImageViewBody(
      mockImageNode as unknown as NodeViewProps,
      editorfocused
    );
    const defaultOriginalSize = {
      src: '',
      complete: false,
      height: 0,
      width: 0,
    };
    const result = imageviewbody.assignVal(
      defaultOriginalSize,
      true,
      false
    );
    expect(result.loading).toBe(false);
    expect(result.active).toBe(false);
    expect(result.aspectRatio).toBe(NaN);
    expect(result.error).toBe(true);
  });

  it('should handle assignVal with active state', () => {
    const imageviewbody = new ImageViewBody(
      mockImageNode as unknown as NodeViewProps,
      editorfocused
    );
    const result = imageviewbody.assignVal(
      {
        src: 'test.jpg',
        complete: true,
        height: 100,
        width: 200,
      },
      true,
      false
    );
    expect(result.loading).toBe(false);
    expect(result.active).toBe(true);
    expect(result.error).toBe(false);
    expect(result.aspectRatio).toBe(2);
  });

  it('should handle isUnaltered with crop', () => {
    const imageviewbody = new ImageViewBody(
      mockImageNode as unknown as NodeViewProps,
      editorfocused
    );
    const result = imageviewbody.isUnaltered(true, { width: 100 } as unknown as null, null);
    expect(result).toBe(false);
  });

  it('should handle isUnaltered with rotate', () => {
    const imageviewbody = new ImageViewBody(
      mockImageNode as unknown as NodeViewProps,
      editorfocused
    );
    const result = imageviewbody.isUnaltered(true, null, 1.57 as unknown as null);
    expect(result).toBe(false);
  });

  it('should handle calcWidthAndHeight with only width', () => {
    const imageviewbody = new ImageViewBody(
      mockImageNode as unknown as NodeViewProps,
      editorfocused
    );
    const result = imageviewbody.calcWidthAndHeight(100, 0, 2, {
      width: 50,
      height: 50,
      src: 'test',
    });
    expect(result).toEqual({ width: 100, height: 50 });
  });

  it('should handle calcWidthAndHeight with only height', () => {
    const imageviewbody = new ImageViewBody(
      mockImageNode as unknown as NodeViewProps,
      editorfocused
    );
    const result = imageviewbody.calcWidthAndHeight(0, 100, 2, {
      width: 50,
      height: 50,
      src: 'test',
    });
    expect(result).toEqual({ width: 200, height: 100 });
  });

  it('should handle calcWidthAndHeight with neither width nor height', () => {
    const imageviewbody = new ImageViewBody(
      mockImageNode as unknown as NodeViewProps,
      editorfocused
    );
    const result = imageviewbody.calcWidthAndHeight(0, 0, 1, {
      width: 500,
      height: 300,
      src: 'test',
    });
    expect(result).toEqual({ width: 500, height: 300 });
  });

  it('should handle calcWidthAndHeight with placeholder', () => {
    const imageviewbody = new ImageViewBody(
      mockImageNode as unknown as NodeViewProps,
      editorfocused
    );
    const result = imageviewbody.calcWidthAndHeight(0, 0, 1, {
      width: 0,
      height: 0,
      src: 'test',
    });
    expect(result.width).toBe(24);
    expect(result.height).toBe(24);
  });

  it('should handle _renderInlineEditor when not active', () => {
    const imageviewbody = new ImageViewBody(
      mockImageNode as unknown as NodeViewProps,
      editorfocused
    );
    imageviewbody._inlineEditor = mockPopupHandle;
    const spy = jest.spyOn(mockPopupHandle, 'close');
    jest.spyOn(document, 'getElementById').mockReturnValue(null);
    imageviewbody._renderInlineEditor();
    expect(spy).toHaveBeenCalled();
  });

  it('should handle _renderInlineEditor when data-active is false', () => {
    const imageviewbody = new ImageViewBody(
      mockImageNode as unknown as NodeViewProps,
      editorfocused
    );
    imageviewbody._inlineEditor = mockPopupHandle;
    const elem = document.createElement('div');
    elem.setAttribute('data-active', 'false');
    jest.spyOn(document, 'getElementById').mockReturnValue(elem);
    const spy = jest.spyOn(mockPopupHandle, 'close');
    imageviewbody._renderInlineEditor();
    expect(spy).toHaveBeenCalled();
  });

  it('should handle _onResizeEnd with valid position', () => {
    const mockSchema = new Schema({
      nodes: {
        doc: { content: 'block+' },
        paragraph: { content: 'inline*', group: 'block' },
        text: { group: 'inline' },
        image: {
          inline: true,
          attrs: { align: { default: null }, fitToParent: { default: null } },
          group: 'inline',
        },
      },
      marks: {},
    });
    const editorState = EditorState.create({
      doc: mockSchema.nodeFromJSON({
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'image',
                attrs: { src: '/path/to/image.jpg' },
              },
            ],
          },
        ],
      }),
      schema: mockSchema,
    });

    const mockEdView = {
      state: editorState,
      dispatch: jest.fn(),
      dom: document.createElement('div'),
    } as unknown as EditorFocused;

    const imageviewbody = new ImageViewBody(
      mockImageNode as unknown as NodeViewProps,
      mockEdView
    );
    imageviewbody.props = {
      decorations: [],
      editorView: mockEdView,
      getPos: () => 1,
      node: { attrs: { align: 'left' } } as unknown as Node,
      dom: document.createElement('img'),
      selected: false,
      focused: false,
    };
    imageviewbody._onResizeEnd(200, 150);
    expect(mockEdView.dispatch).toHaveBeenCalled();
  });

  it('should handle _onChange with value', () => {
    const mockSchema = new Schema({
      nodes: {
        doc: { content: 'block+' },
        paragraph: { content: 'inline*', group: 'block' },
        text: { group: 'inline' },
        image: {
          inline: true,
          attrs: { align: { default: null }, fitToParent: { default: null } },
          group: 'inline',
        },
      },
      marks: {},
    });
    const editorState = EditorState.create({
      doc: mockSchema.nodeFromJSON({
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'image',
                attrs: { src: '/path/to/image.jpg' },
              },
            ],
          },
        ],
      }),
      schema: mockSchema,
    });

    const mockEdView = {
      state: editorState,
      dispatch: jest.fn(),
      dom: document.createElement('div'),
    } as unknown as EditorFocused;

    const imageviewbody = new ImageViewBody(
      mockImageNode as unknown as NodeViewProps,
      mockEdView
    );
    imageviewbody._mounted = true;
    imageviewbody.props = {
      decorations: [],
      editorView: mockEdView,
      getPos: () => 1,
      node: { attrs: { align: 'left' } } as unknown as Node,
      dom: document.createElement('img'),
      selected: false,
      focused: false,
    };
    imageviewbody._onChange({ align: 'center' });
    expect(mockEdView.dispatch).toHaveBeenCalled();
  });

  it('should handle _onChange without value', () => {
    const mockSchema = new Schema({
      nodes: {
        doc: { content: 'block+' },
        paragraph: { content: 'inline*', group: 'block' },
        text: { group: 'inline' },
        image: {
          inline: true,
          attrs: { align: { default: null }, fitToParent: { default: null } },
          group: 'inline',
        },
      },
      marks: {},
    });
    const editorState = EditorState.create({
      doc: mockSchema.nodeFromJSON({
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'image',
                attrs: { src: '/path/to/image.jpg' },
              },
            ],
          },
        ],
      }),
      schema: mockSchema,
    });

    const mockEdView = {
      state: editorState,
      dispatch: jest.fn(),
      dom: document.createElement('div'),
    } as unknown as EditorFocused;

    const imageviewbody = new ImageViewBody(
      mockImageNode as unknown as NodeViewProps,
      mockEdView
    );
    imageviewbody._mounted = true;
    imageviewbody.props = {
      decorations: [],
      editorView: mockEdView,
      getPos: () => 1,
      node: { attrs: { align: 'left' } } as unknown as Node,
      dom: document.createElement('img'),
      selected: false,
      focused: false,
    };
    imageviewbody._onChange();
    expect(mockEdView.dispatch).toHaveBeenCalled();
  });

  it('should handle _onChange when not mounted', () => {
    const imageviewbody = new ImageViewBody(
      mockImageNode as unknown as NodeViewProps,
      editorfocused
    );
    imageviewbody._mounted = false;
    imageviewbody._onChange({ align: 'center' });
    expect(imageviewbody._mounted).toBe(false);
  });

  it('should handle _onBodyRef with element', () => {
    const imageviewbody = new ImageViewBody(
      mockImageNode as unknown as NodeViewProps,
      editorfocused
    );
    const mockElement = document.createElement('div');
    const spy = jest.spyOn(ResizeObserver, 'observe');
    imageviewbody._onBodyRef(mockElement as unknown as React.ReactInstance);
    expect(spy).toHaveBeenCalled();
  });

  it('should handle _onBodyRef with null to unobserve', () => {
    const imageviewbody = new ImageViewBody(
      mockImageNode as unknown as NodeViewProps,
      editorfocused
    );
    const mockElement = document.createElement('div');
    imageviewbody._body = mockElement;
    const spy = jest.spyOn(ResizeObserver, 'unobserve');
    imageviewbody._onBodyRef(undefined);
    expect(spy).toHaveBeenCalled();
  });

  it('should handle _onBodyResize with contentRect', () => {
    const imageviewbody = new ImageViewBody(
      mockImageNode as unknown as NodeViewProps,
      editorfocused
    );
    const mockElement = document.createElement('div');
    imageviewbody._body = mockElement;
    imageviewbody._onBodyResize({
      target: document.createElement('div'),
      contentRect: {
        x: 1,
        y: 2,
        width: 500,
        height: 400,
        top: 5,
        right: 6,
        bottom: 7,
        left: 8,
      },
    });
    expect(imageviewbody.state.maxSize.width).toBeGreaterThan(0);
  });

  it('should handle _onBodyResize without contentRect', () => {
    const imageviewbody = new ImageViewBody(
      mockImageNode as unknown as NodeViewProps,
      editorfocused
    );
    const mockElement = document.createElement('div');
    imageviewbody._body = mockElement;
    imageviewbody._onBodyResize({
      target: document.createElement('div'),
    } as unknown as ResizeObserverEntry);
    expect(imageviewbody.state.maxSize).toBeDefined();
  });

  it('should handle _onBodyResize without body', () => {
    const imageviewbody = new ImageViewBody(
      mockImageNode as unknown as NodeViewProps,
      editorfocused
    );
    imageviewbody._body = undefined;
    imageviewbody._onBodyResize({
      target: document.createElement('div'),
      contentRect: {
        x: 0,
        y: 0,
        width: 300,
        height: 200,
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    });
    expect(imageviewbody.state.maxSize.complete).toBe(false);
  });

  it('should handle _resolveOriginalSize when already mounted and src is cached', () => {
    const imageviewbody = new ImageViewBody(
      mockImageNode as unknown as NodeViewProps,
      editorfocused
    );
    imageviewbody._mounted = true;
    imageviewbody.state = {
      maxSize: { width: 100, height: 100, complete: true },
      originalSize: {
        src: 'test-src',
        complete: true,
        height: 100,
        width: 100,
      },
    };
    imageviewbody.props = {
      decorations: [],
      editorView: editorfocused,
      getPos: () => 1,
      node: {
        attrs: { src: 'test-src', align: 'left' },
      } as unknown as Node,
      dom: document.createElement('img'),
      selected: false,
      focused: false,
    };
    const result = imageviewbody._resolveOriginalSize();
    expect(result).toBeDefined();
  });

  it('should handle _resolveOriginalSize when not mounted', () => {
    const imageviewbody = new ImageViewBody(
      mockImageNode as unknown as NodeViewProps,
      editorfocused
    );
    imageviewbody._mounted = false;
    const result = imageviewbody._resolveOriginalSize();
    expect(result).toBeDefined();
  });

  it('should sync attrs to maxSize when needed', () => {
    const mockSchema = new Schema({
      nodes: {
        doc: { content: 'block+' },
        paragraph: { content: 'inline*', group: 'block' },
        text: { group: 'inline' },
        image: {
          inline: true,
          attrs: { align: { default: null }, fitToParent: { default: null } },
          group: 'inline',
        },
      },
      marks: {},
    });
    const editorState = EditorState.create({
      doc: mockSchema.nodeFromJSON({
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'image',
                attrs: { src: '/path/to/image.jpg' },
              },
            ],
          },
        ],
      }),
      schema: mockSchema,
    });

    const mockEdView = {
      state: editorState,
      dispatch: jest.fn(),
      dom: document.createElement('div'),
    } as unknown as EditorFocused;

    const imageviewbody = new ImageViewBody(
      mockImageNode as unknown as NodeViewProps,
      mockEdView
    );
    imageviewbody._mounted = true;
    imageviewbody.state = {
      maxSize: { width: 500, height: 500, complete: true },
      originalSize: {
        src: 'test',
        complete: true,
        height: 1000,
        width: 1000,
      },
    };
    imageviewbody.props = {
      decorations: [],
      editorView: mockEdView,
      getPos: () => 1,
      node: {
        attrs: {
          src: 'test',
          width: 1000,
          height: 1000,
          crop: null,
        },
      } as unknown as Node,
      dom: document.createElement('img'),
      selected: false,
      focused: false,
    };
    imageviewbody._syncAttrsToMaxSize();
    expect(mockEdView.dispatch).toHaveBeenCalled();
  });

  it('should not sync attrs when not mounted', () => {
    const imageviewbody = new ImageViewBody(
      mockImageNode as unknown as NodeViewProps,
      editorfocused
    );
    imageviewbody._mounted = false;
    const mockEdView = editorfocused as unknown as EditorFocused;
    const spy = jest.spyOn(mockEdView, 'dispatch');
    imageviewbody._syncAttrsToMaxSize();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should not sync attrs when originalSize not complete', () => {
    const imageviewbody = new ImageViewBody(
      mockImageNode as unknown as NodeViewProps,
      editorfocused
    );
    imageviewbody._mounted = true;
    imageviewbody.state = {
      maxSize: { width: 500, height: 500, complete: true },
      originalSize: {
        src: 'test',
        complete: false,
        height: 0,
        width: 0,
      },
    };
    imageviewbody.props = {
      decorations: [],
      editorView: editorfocused,
      getPos: () => 1,
      node: {
        attrs: { src: 'test', width: 100, height: 100 },
      } as unknown as Node,
      dom: document.createElement('img'),
      selected: false,
      focused: false,
    };
    const result = imageviewbody._syncAttrsToMaxSize();
    expect(result).toBeUndefined();
  });

  it('should not sync attrs when maxSize not complete', () => {
    const imageviewbody = new ImageViewBody(
      mockImageNode as unknown as NodeViewProps,
      editorfocused
    );
    imageviewbody._mounted = true;
    imageviewbody.state = {
      maxSize: { width: 500, height: 500, complete: false },
      originalSize: {
        src: 'test',
        complete: true,
        height: 100,
        width: 100,
      },
    };
    imageviewbody.props = {
      decorations: [],
      editorView: editorfocused,
      getPos: () => 1,
      node: {
        attrs: { src: 'test', width: 100, height: 100 },
      } as unknown as Node,
      dom: document.createElement('img'),
      selected: false,
      focused: false,
    };
    const result = imageviewbody._syncAttrsToMaxSize();
    expect(result).toBeUndefined();
  });

  it('should not dispatch when width and height unchanged', () => {
    const mockSchema = new Schema({
      nodes: {
        doc: { content: 'block+' },
        paragraph: { content: 'inline*', group: 'block' },
        text: { group: 'inline' },
        image: {
          inline: true,
          attrs: { align: { default: null }, fitToParent: { default: null } },
          group: 'inline',
        },
      },
      marks: {},
    });
    const editorState = EditorState.create({
      doc: mockSchema.nodeFromJSON({
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'image',
                attrs: { src: '/path/to/image.jpg' },
              },
            ],
          },
        ],
      }),
      schema: mockSchema,
    });

    const mockEdView = {
      state: editorState,
      dispatch: jest.fn(),
      dom: document.createElement('div'),
    } as unknown as EditorFocused;

    const imageviewbody = new ImageViewBody(
      mockImageNode as unknown as NodeViewProps,
      mockEdView
    );
    imageviewbody._mounted = true;
    imageviewbody.state = {
      maxSize: { width: 500, height: 500, complete: true },
      originalSize: {
        src: 'test',
        complete: true,
        height: 100,
        width: 100,
      },
    };
    imageviewbody.props = {
      decorations: [],
      editorView: mockEdView,
      getPos: () => 1,
      node: {
        attrs: {
          src: 'test',
          width: 100,
          height: 100,
          crop: null,
        },
      } as unknown as Node,
      dom: document.createElement('img'),
      selected: false,
      focused: false,
    };
    imageviewbody._syncAttrsToMaxSize();
    expect(mockEdView.dispatch).not.toHaveBeenCalled();
  });

  it('should render with crop width exceeding maxSize', () => {
    const imageviewbody = new ImageViewBody(
      mockImageNode as unknown as NodeViewProps,
      editorfocused
    );
    imageviewbody.state = {
      maxSize: {
        width: 300,
        height: 10000,
        complete: true,
      },
      originalSize: {
        src: 'test-src',
        complete: true,
        height: 1000,
        width: 1000,
      },
    };
    imageviewbody.props = {
      decorations: [],
      editorView: editorfocused,
      getPos: () => 1,
      node: {
        attrs: {
          src: 'test',
          align: 'left',
          crop: { width: 800, height: 600, left: 0, top: 0 },
          rotate: null,
          width: 1000,
          height: 1000,
          fitToParent: false,
        },
      } as unknown as Node,
      dom: document.createElement('img'),
      selected: false,
      focused: false,
    };
    const result = imageviewbody.render();
    expect(result).toBeDefined();
  });

  it('should handle crop with displayScale applied', () => {
    const imageviewbody = new ImageViewBody(
      mockImageNode as unknown as NodeViewProps,
      editorfocused
    );
    imageviewbody.state = {
      maxSize: {
        width: 500,
        height: 10000,
        complete: true,
      },
      originalSize: {
        src: 'test-src',
        complete: true,
        height: 1000,
        width: 1000,
      },
    };
    imageviewbody.props = {
      decorations: [],
      editorView: editorfocused,
      getPos: () => 1,
      node: {
        attrs: {
          src: 'test',
          align: 'left',
          crop: { width: 800, height: 600, left: 50, top: 50 },
          rotate: null,
          width: 1000,
          height: 1000,
          fitToParent: false,
        },
      } as unknown as Node,
      dom: document.createElement('img'),
      selected: false,
      focused: false,
    };
    const result = imageviewbody.render();
    expect(result).toBeDefined();
  });

  it('should render with selected state', () => {
    const imageviewbody = new ImageViewBody(
      mockImageNode as unknown as NodeViewProps,
      editorfocused
    );
    imageviewbody.state = {
      maxSize: {
        width: 10000,
        height: 10000,
        complete: true,
      },
      originalSize: {
        src: 'test-src',
        complete: true,
        height: 100,
        width: 100,
      },
    };
    imageviewbody.props = {
      decorations: [],
      editorView: editorfocused,
      getPos: () => 1,
      node: {
        attrs: {
          src: 'test',
          align: 'left',
          crop: null,
          rotate: null,
          width: 100,
          height: 100,
          fitToParent: false,
        },
      } as unknown as Node,
      dom: document.createElement('img'),
      selected: true,
      focused: false,
    };
    const result = imageviewbody.render();
    expect(result.props.className).toContain('selected');
  });

  it('should render with focused state', () => {
    const imageviewbody = new ImageViewBody(
      mockImageNode as unknown as NodeViewProps,
      editorfocused
    );
    imageviewbody.state = {
      maxSize: {
        width: 10000,
        height: 10000,
        complete: true,
      },
      originalSize: {
        src: 'test-src',
        complete: true,
        height: 100,
        width: 100,
      },
    };
    imageviewbody.props = {
      decorations: [],
      editorView: editorfocused,
      getPos: () => 1,
      node: {
        attrs: {
          src: 'test',
          align: 'left',
          crop: null,
          rotate: null,
          width: 100,
          height: 100,
          fitToParent: false,
        },
      } as unknown as Node,
      dom: document.createElement('img'),
      selected: false,
      focused: true,
    };
    const result = imageviewbody.render();
    expect(result.props.className).toContain('focused');
  });
});