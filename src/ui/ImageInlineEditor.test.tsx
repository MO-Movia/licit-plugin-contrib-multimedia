import { ImageInlineEditor, ImageInlineEditorValue, ImageAlterValues } from './ImageInlineEditor';
import { EditorState } from 'prosemirror-state';
import { NodeSelection } from 'prosemirror-state';
import { schema } from 'prosemirror-test-builder';
import { MultimediaPlugin } from '../index';
import { createEditor, doc, p } from 'jest-prosemirror';
import { EditorView } from 'prosemirror-view';
import '@testing-library/jest-dom';
import { Schema } from 'prosemirror-model';
import { createPopUp } from '@modusoperandi/licit-ui-commands';

jest.mock('@modusoperandi/licit-ui-commands', () => ({
  atAnchorTopCenter: 'at-anchor-top-center',
  createPopUp: jest.fn(() => ({
    close: jest.fn(),
  })),
}));

describe('ImageInlineEditor', () => {
  const plugin = new MultimediaPlugin();
  const editor = createEditor(doc(p('<cursor>')), {
    plugins: [plugin],
  });
  const state: EditorState = EditorState.create({
    schema: schema,
    selection: editor.selection,
    plugins: [new MultimediaPlugin()],
  });
  const view1 = new EditorView(document.querySelector('#editor'), {
    state,
  });
  const defaultProps = {
    onSelect: () => undefined,
    value: {
      align: '',
      src: 'test',
    },
    editorView: view1,
  };

  it('should render', () => {
    const imageinlineeditor = new ImageInlineEditor(defaultProps);
    expect(imageinlineeditor).toBeDefined();
  });
  it('should render', () => {
    const imageinlineeditor = new ImageInlineEditor(defaultProps);
    imageinlineeditor.props = {
      onSelect: () => undefined,
      value: {
        align: '',
        src: 'test',
      },
      editorView: view1,
    };

    expect(imageinlineeditor.render()).toBeDefined();
  });

  it('should handle parseLabel when input ""', () => {
    const imageinlineeditor = new ImageInlineEditor(defaultProps);
    expect(imageinlineeditor.parseLabel('')).toStrictEqual({
      icon: null,
      title: null,
    });
  });

  it('should handle empty input', () => {
    const imageinlineeditor = new ImageInlineEditor(defaultProps);
    const input = '';
    const result = imageinlineeditor.parseLabel(input);

    expect(result.title).toBeNull();
    expect(result.icon).toBeNull();
  });

  it('should handle _onClick ', () => {
    const imageinlineeditor = new ImageInlineEditor(defaultProps);
    imageinlineeditor.props = {
      onSelect: (val) => val.align,
      value: {
        align: '',
        src: 'test',
      },
      editorView: view1,
    };
    const spy = jest.spyOn(imageinlineeditor.props, 'onSelect');
    imageinlineeditor._onClick('align_test');
    imageinlineeditor._onRemove(view1);
    imageinlineeditor._onCrop(view1);
    expect(spy).lastReturnedWith('align_test');
  });
  it('should handle prepMenuItems ', () => {
    const imageinlineeditor = new ImageInlineEditor(defaultProps);
    imageinlineeditor.props = {
      onSelect: (val) => val.align,
      value: null as unknown as ImageInlineEditorValue,
      editorView: view1,
    };

    expect(imageinlineeditor.prepMenuItems('align_test', '')).toBeDefined();
  });

  it('should include Reset Crop disabled when no cropData exists', () => {
    const imageinlineeditor = new ImageInlineEditor(defaultProps);
    imageinlineeditor.props = {
      onSelect: (val) => val.align,
      value: {
        align: '',
        src: 'test',
      },
      editorView: view1,
    };

    const items = imageinlineeditor.prepMenuItems(ImageAlterValues, '');
    const resetItem = items.find((item) => item.id === 'reset-crop');
    expect(resetItem).toBeDefined();
    expect(resetItem?.disabled).toBe(true);
  });

  it('should include Reset Crop enabled when cropData exists', () => {
    const imageinlineeditor = new ImageInlineEditor(defaultProps);
    imageinlineeditor.props = {
      onSelect: (val) => val.align,
      value: {
        align: '',
        src: 'test',
        cropData: { left: 0, top: 0, width: 10, height: 10, croppedBase64: 'data:image/png;base64,' },
      },
      editorView: view1,
    };

    const items = imageinlineeditor.prepMenuItems(ImageAlterValues, '');
    const resetItem = items.find((item) => item.id === 'reset-crop');
    expect(resetItem).toBeDefined();
    expect(resetItem?.disabled).toBe(false);
  });

  it('should parse icon labels with regular and custom alignment icons', () => {
    const imageinlineeditor = new ImageInlineEditor(defaultProps);

    expect(imageinlineeditor.parseLabel('[crop] Crop').title).toBe(' Crop');

    const custom = imageinlineeditor.parseLabel('[format_align_left] Left', 'left');
    expect(custom.title).toBe(' Left');
    expect(custom.icon).toBeDefined();
  });

  it('should stop mouse events', () => {
    const imageinlineeditor = new ImageInlineEditor(defaultProps);
    const event = {
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
    } as unknown as React.MouseEvent;

    imageinlineeditor._stopEvent(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(event.stopPropagation).toHaveBeenCalled();
  });

  it('should toggle menu open and closed', () => {
    const imageinlineeditor = new ImageInlineEditor(defaultProps);
    const close = jest.fn();
    (createPopUp as jest.Mock).mockReturnValueOnce({ close });
    imageinlineeditor._onButtonRef(document.createElement('button'));
    const event = {
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
    } as unknown as React.MouseEvent;

    imageinlineeditor._toggleMenu(event);
    expect(createPopUp).toHaveBeenCalled();

    imageinlineeditor._toggleMenu(event);
    expect(close).toHaveBeenCalled();
  });

  it('should create menu actions for crop and disabled editor view state', () => {
    jest.useFakeTimers();
    const imageinlineeditor = new ImageInlineEditor(defaultProps);
    imageinlineeditor.props = {
      onSelect: jest.fn(),
      value: {
        align: 'left',
        src: 'test',
        cropData: { left: 0, top: 0, width: 1, height: 1, croppedBase64: 'crop' },
      },
      editorView: view1,
    };
    const cropSpy = jest.spyOn(imageinlineeditor, '_onCrop');

    const cropItem = imageinlineeditor
      .prepMenuItems(ImageAlterValues, 'left')
      .find((item) => item.id === 'crop');
    cropItem?.action();
    jest.runOnlyPendingTimers();

    expect(cropSpy).toHaveBeenCalledWith(view1);

    imageinlineeditor.props = {
      onSelect: jest.fn(),
      value: { align: 'left', src: 'test' },
    } as unknown as ImageInlineEditor['props'];
    expect(imageinlineeditor.prepMenuItems(ImageAlterValues, 'left')[0].disabled).toBe(true);

    jest.useRealTimers();
  });

  it('should update attrs, remove, reset and crop an image node', () => {
    const view = createImageEditorView();
    const imageinlineeditor = new ImageInlineEditor({
      editorView: view,
      getPos: () => 1,
      onSelect: jest.fn(),
      value: { align: '', src: 'old-src' },
    });
    const cropPopupClose = jest.fn();
    (createPopUp as jest.Mock).mockReturnValueOnce({ close: cropPopupClose });

    expect(imageinlineeditor._setImageAttrs({ align: 'right' })).toBe(true);
    expect(view.dispatch).toHaveBeenCalled();

    imageinlineeditor._onResetCrop(view);
    imageinlineeditor._onCrop(view);

    const popupProps = (createPopUp as jest.Mock).mock.calls.at(-1)[1];
    const cropData = {
      croppedBase64: 'data:image/png;base64,cropped',
      height: 20,
      left: 1,
      top: 2,
      width: 30,
    };
    popupProps.onConfirm(cropData);
    popupProps.onCancel();

    expect(cropPopupClose).toHaveBeenCalledWith(cropData);
    expect(cropPopupClose).toHaveBeenCalledWith(null);

    const removeView = createImageEditorView();
    const removeEditor = new ImageInlineEditor({
      editorView: removeView,
      getPos: () => 1,
      onSelect: jest.fn(),
      value: { src: 'old-src' },
    });
    removeEditor._onRemove(removeView);

    expect(removeView.dispatch).toHaveBeenCalled();
  });

  it('should resolve image node context from selection and handle missing contexts', () => {
    const view = createImageEditorView();
    view.dispatch(view.state.tr.setSelection(NodeSelection.create(view.state.doc, 1)));
    const imageinlineeditor = new ImageInlineEditor({
      editorView: view,
      getPos: () => {
        throw new Error('position unavailable');
      },
      onSelect: jest.fn(),
      value: { src: 'old-src' },
    });

    expect(imageinlineeditor._getImageNodeContext(view)?.pos).toBe(1);

    const textView = createParagraphEditorView();
    const textEditor = new ImageInlineEditor({
      editorView: textView,
      onSelect: jest.fn(),
      value: { src: 'old-src' },
    });
    expect(textEditor._getImageNodeContext(textView)).toBeNull();
    expect(textEditor._setImageAttrs({ align: 'center' })).toBe(false);

    imageinlineeditor._onRemove(undefined);
    imageinlineeditor._onResetCrop(undefined);
    imageinlineeditor._onCrop(undefined);
    imageinlineeditor.insertParagraphAbove(undefined);
    imageinlineeditor.insertParagraphBelow(undefined);

    expect(textView.dispatch).not.toHaveBeenCalled();
  });

  it('should insert paragraphs above and below an image', () => {
    const aboveView = createImageEditorView();
    const aboveEditor = new ImageInlineEditor({
      editorView: aboveView,
      getPos: () => 1,
      onSelect: jest.fn(),
      value: { src: 'old-src' },
    });
    const belowView = createImageEditorView();
    const belowEditor = new ImageInlineEditor({
      editorView: belowView,
      getPos: () => 1,
      onSelect: jest.fn(),
      value: { src: 'old-src' },
    });

    aboveEditor.insertParagraphAbove(aboveView);
    belowEditor.insertParagraphBelow(belowView);

    expect(aboveView.dispatch).toHaveBeenCalledTimes(1);
    expect(belowView.dispatch).toHaveBeenCalledTimes(1);
  });

  it('should update image source and fall back to onSelect when no image node exists', () => {
    const view = createImageEditorView();
    const imageinlineeditor = new ImageInlineEditor({
      editorView: view,
      getPos: () => 1,
      onSelect: jest.fn(),
      value: { src: 'old-src' },
    });

    imageinlineeditor.updateImageSource('new-src', view);
    imageinlineeditor.updateImageSource('new-src');

    expect(view.dispatch).toHaveBeenCalledTimes(1);

    const onSelect = jest.fn();
    const textEditor = new ImageInlineEditor({
      editorView: createParagraphEditorView(),
      onSelect,
      value: { src: 'old-src' },
    });
    textEditor._onClick('center');

    expect(onSelect).toHaveBeenCalledWith({ align: 'center' });
  });

  it('should handle file selection and clipboard paste branches', async () => {
    const view = createImageEditorView();
    const imageinlineeditor = new ImageInlineEditor({
      editorView: view,
      getPos: () => 1,
      onSelect: jest.fn(),
      value: { src: 'old-src' },
    });
    const updateSpy = jest
      .spyOn(imageinlineeditor, 'updateImageSource')
      .mockImplementation(() => undefined);
    const originalFileReader = global.FileReader;
    class MockFileReader {
      onload: ((event: ProgressEvent<FileReader>) => void) | null = null;

      readAsDataURL(): void {
        this.onload?.({ target: { result: 'data:image/png;base64,next' } } as ProgressEvent<FileReader>);
      }
    }
    global.FileReader = MockFileReader as unknown as typeof FileReader;
    const fileInput = document.createElement('input');
    const createElementSpy = jest
      .spyOn(document, 'createElement')
      .mockReturnValue(fileInput);
    const clickSpy = jest.spyOn(fileInput, 'click').mockImplementation(() => undefined);

    imageinlineeditor.handleChooseFile(view);
    Object.defineProperty(fileInput, 'files', {
      configurable: true,
      value: [new File(['image'], 'image.png', { type: 'image/png' })],
    });
    fileInput.onchange?.({ target: fileInput } as unknown as Event);

    expect(clickSpy).toHaveBeenCalled();
    expect(updateSpy).toHaveBeenCalledWith('data:image/png;base64,next', view);

    createElementSpy.mockRestore();

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    const originalClipboard = navigator.clipboard;
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: undefined,
    });

    imageinlineeditor.handlePasteFromClipboard(view);

    expect(consoleErrorSpy).toHaveBeenCalledWith('Clipboard API not available');
    consoleErrorSpy.mockClear();

    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        read: jest.fn().mockResolvedValue([
          {
            getType: jest.fn().mockResolvedValue(new Blob(['image'], { type: 'image/png' })),
            types: ['text/plain', 'image/png'],
          },
        ]),
      },
    });

    imageinlineeditor.handlePasteFromClipboard(view);
    await flushPromises();

    expect(updateSpy).toHaveBeenCalledWith('data:image/png;base64,next', view);
    consoleErrorSpy.mockClear();

    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        read: jest.fn().mockRejectedValue(new Error('no permission')),
      },
    });

    imageinlineeditor.handlePasteFromClipboard(view);
    await flushPromises();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to read from clipboard:',
      expect.any(Error)
    );

    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: originalClipboard,
    });
    global.FileReader = originalFileReader;
    consoleErrorSpy.mockRestore();
  });
});

const imageSchema = new Schema({
  nodes: {
    doc: { content: 'block+' },
    image: {
      attrs: {
        align: { default: null },
        cropData: { default: null },
        src: { default: null },
      },
      group: 'inline',
      inline: true,
      toDOM: (node) => ['img', node.attrs],
    },
    paragraph: { content: 'inline*', group: 'block', toDOM: () => ['p', 0] },
    text: { group: 'inline' },
  },
});

function createImageEditorView(): EditorView {
  const dom = document.createElement('div');
  const view = new EditorView(dom, {
    state: EditorState.create({
      doc: imageSchema.nodeFromJSON({
        content: [
          {
            content: [
              {
                attrs: { align: null, cropData: { width: 10 }, src: 'old-src' },
                type: 'image',
              },
            ],
            type: 'paragraph',
          },
        ],
        type: 'doc',
      }),
      schema: imageSchema,
    }),
  });
  jest.spyOn(view, 'dispatch');

  return view;
}

function createParagraphEditorView(): EditorView {
  const dom = document.createElement('div');
  const view = new EditorView(dom, {
    state: EditorState.create({
      doc: imageSchema.nodeFromJSON({
        content: [{ content: [{ text: 'plain text', type: 'text' }], type: 'paragraph' }],
        type: 'doc',
      }),
      schema: imageSchema,
    }),
  });
  jest.spyOn(view, 'dispatch');

  return view;
}

function flushPromises(): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, 0);
  });
}
