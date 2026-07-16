import { createEditor, doc, p } from 'jest-prosemirror';
import {
  EditorState,
  TextSelection,
  Transaction,
  Plugin,
  PluginKey,
} from 'prosemirror-state';
import { Transform } from 'prosemirror-transform';
import { MultimediaPlugin, bindImageView, bindVideoView } from './index';
import { VideoEditorState } from './ui/VideoEditor';
import { VideoSourceCommand, insertIFrame } from './VideoSourceCommand';
import { ImageUploadCommand } from './ImageUploadCommand';
import { VideoUploadCommand } from './VideoUploadCommand';
import { isOffline } from './ui/isOffline';
import { ImageNodeView } from './ui/ImageNodeView';
import { EditorView } from 'prosemirror-view';
import { VideoFromURLCommand } from './VideoFromURLCommand';
import { SelectionObserver } from './ui/SelectionObserver';
import { uuid } from './ui/uuid';
import { CustomNodeView, EditorFocused } from './ui/CustomNodeView';
import ImageFromURLCommand from './ImageFromURLCommand';
import { EditorRuntime, ImageLike } from './Types';
import { ImageUploadEditor } from './ui/ImageUploadEditor';

class TestPlugin extends Plugin {
  constructor() {
    super({
      key: new PluginKey('TestPlugin'),
    });
  }
}

describe('MultimediaPlugin', () => {
  const plugin = new MultimediaPlugin();
  const editor = createEditor(doc(p('<cursor>')), {
    plugins: [plugin],
  });
  const view = editor.view as unknown as EditorView;

  const schema = plugin.getEffectiveSchema(editor.schema);
  const state: EditorState = EditorState.create({
    doc: doc(p('Hello World!!!')),
    schema: schema,
    selection: editor.selection,
    plugins: [new MultimediaPlugin()],
  });

  const selection = TextSelection.create(view.state.doc, 0, 0);
  const tr = view.state.tr.setSelection(selection);
  view.updateState(
    view.state.reconfigure({ plugins: [plugin, new TestPlugin()] })
  );

  view.dispatch(tr);

  const attrs = {
    id: '',
    align: null,
    alt: '',
    crop: null,
    height: 113,
    rotate: null,
    src: 'https://www.youtube.com/embed/ru60J99ojJw',
    title: '',
    width: 200,
  };

  const veState: VideoEditorState = {
    id: attrs.id,
    src: attrs.src,
    width: attrs.width,
    height: attrs.height,
    validValue: true,
  };

  isOffline();
  new VideoSourceCommand().executeWithUserInput(
    state,
    view.dispatch as (tr: Transform) => void,
    view,
    veState
  );

  new VideoSourceCommand().__isEnabled(state, view);

  it('should handle Video', () => {
    const plugin = new MultimediaPlugin();
    const editor = createEditor(doc(p('<cursor>')), {
      plugins: [plugin],
    });

    const schema = plugin.getEffectiveSchema(editor.schema);

    const attrs = {
      id: '',
      align: null,
      alt: '',
      crop: null,
      height: 113,
      rotate: null,
      src: 'https://www.youtube.com/embed/ru60J99ojJw',
      title: '',
      width: 200,
    };

    const veState: VideoEditorState = {
      id: attrs.id,
      src: attrs.src,
      width: attrs.width,
      height: attrs.height,
      validValue: true,
    };

    const state: EditorState = EditorState.create({
      schema: schema,
      selection: editor.selection,
      plugins: [new MultimediaPlugin()],
    });

    const newState = state.apply(
      insertIFrame(state.tr, schema, veState) as Transaction
    );

    expect(() =>
      new VideoSourceCommand().executeWithUserInput(
        state,
        view.dispatch,
        view,
        veState
      )
    ).toThrow();

    const json = state.doc.toJSON();
    const videoJSON = newState.doc.toJSON();

    expect(json).not.toEqual(videoJSON);

    expect(JSON.stringify(videoJSON)).toContain(
      JSON.stringify({
        type: 'video',
        attrs: attrs,
      })
    );
  });

  it('__isEnabled in VideoSourceCommand ', () => {
    const testDoc = schema.node('doc', null, [
      schema.node('paragraph', null, [schema.text('Hello World!!!')]),
    ]);
    const statetest: EditorState = EditorState.create({
      doc: testDoc,
      schema: schema,
      selection: TextSelection.create(testDoc, 1, 3),
      plugins: [new MultimediaPlugin()],
    });
    expect(new VideoSourceCommand().__isEnabled(statetest, view)).toBe(false);
  });

  it('isEnabled in VideoSourceCommand ', () => {
    const testDoc = schema.node('doc', null, [
      schema.node('paragraph', null, [schema.text('Hello World!!!')]),
    ]);
    const statetest: EditorState = EditorState.create({
      doc: testDoc,
      schema: schema,
      selection: TextSelection.create(testDoc, 1, 3),
      plugins: [new MultimediaPlugin()],
    });
    expect(new VideoSourceCommand().isEnabled(statetest, view)).toBe(false);
  });

  it('isEnabled in image', () => {
    const view = new EditorView(document.querySelector('#editor'), {
      state,
      handleKeyPress() {
        console.log('key');
      },
    });
    const trans = new ImageUploadCommand();
    const editorruntime: EditorRuntime = {
      // Image Proxy
      canProxyImageSrc: () => {
        return true;
      },
      // getProxyImageSrc: () => Promise.reject(),
      // Image Upload
      canUploadImage: undefined,
      uploadImage: undefined,
      // Comments
      canComment: () => true,
      createCommentThreadID: () => 'string',
      // External HTML
      canLoadHTML: () => true,
      //loadHTML: () => Promise<string>,
    };
    view['runtime'] = editorruntime;
    expect(trans.isEnabled(state, view)).toBeFalsy();
    editorruntime.uploadImage = () => Promise.resolve({} as ImageLike);
    expect(trans.isEnabled(state, view)).toBeFalsy();
    editorruntime.canUploadImage = () => false;
    expect(trans.isEnabled(state, view)).toBeFalsy();
  });

  it('Image Upload Command', () => {
    const editorruntime: EditorRuntime = {
      // Image Proxy
      canProxyImageSrc: () => {
        return true;
      },
      // getProxyImageSrc: () => Promise.reject(),
      // Image Upload
      canUploadImage: () => false,
      uploadImage: () => Promise.reject(),
      // Comments
      canComment: () => false,
      createCommentThreadID: () => 'string',
      // External HTML
      canLoadHTML: () => true,
      //loadHTML: () => Promise<string>,
    };
    const trans = new ImageUploadCommand();

    const state = EditorState.create({
      doc: doc(p('Hello World!!')),
      schema: schema,
    });
    const dom = document.createElement('div');

    const editorView = new EditorView(
      { mount: dom },
      {
        state: state,
      }
    );
    editorView['runtime'] = editorruntime;
    trans.isEnabled(state, editorView);
    expect(trans.getEditor()).toBe(ImageUploadEditor);
  });

  it('isEnabled', () => {
    const editorruntime: EditorRuntime = {
      // Image Proxy
      canProxyImageSrc: () => {
        return true;
      },
      // getProxyImageSrc: () => Promise.reject(),
      // Image Upload
      canUploadImage: () => true,
      uploadImage: () => Promise.reject(),
      // Comments
      canComment: () => false,
      createCommentThreadID: () => 'string',
      // External HTML
      canLoadHTML: () => true,
      //loadHTML: () => Promise<string>,
    };
    const trans = new ImageUploadCommand();

    const state = EditorState.create({
      doc: doc(p('Hello World!!')),
      schema: schema,
    });
    const dom = document.createElement('div');

    const editorView = new EditorView(
      { mount: dom },
      {
        state: state,
      }
    );
    editorView['runtime'] = editorruntime;
    expect(trans.isEnabled(state, editorView)).toBe(true);
  });

  it('getEditor', () => {
    const trans = new VideoUploadCommand();
    expect(trans.getEditor()).toBeDefined();
  });

  it('can Image Upload', () => {
    const trans = new ImageUploadCommand();
    const state = EditorState.create({
      doc: doc(p('Hello World!!')),
      schema: schema,
    });
    const dom = document.createElement('div');

    const editorView = new EditorView(
      { mount: dom },
      {
        state: state,
      }
    );
    editorView['runtime'] = null;
    expect(trans.isEnabled(state, null)).toBe(false);
  });

  it('can Image Upload-runtime', () => {
    const trans = new ImageUploadCommand();
    const state = EditorState.create({
      doc: doc(p('Hello World!!')),
      schema: schema,
    });
    const dom = document.createElement('div');

    const editorView = new EditorView(
      { mount: dom },
      {
        state: state,
      }
    );
    editorView['runtime'] = null;
    expect(trans.isEnabled(state, editorView)).toBe(false);
  });

  it('bindImageView', () => {
    const view = new EditorView(document.querySelector('#editor'), {
      state,
      handleKeyPress() {
        console.log('key');
      },
    });
    expect(bindImageView(doc(p('<cursor>')), view, () => 1)).toBeDefined();
  });

  it('bindVideoView', () => {
    const view = new EditorView(document.querySelector('#editor'), {
      state,
      handleKeyPress() {
        console.log('key');
      },
    });
    expect(bindVideoView(doc(p('<cursor>')), view, () => 1)).toBeDefined();
  });

  it('selectionObserver', () => {
    const selection = new SelectionObserver(() => undefined);
    selection.disconnect();
    selection.takeRecords();
    expect(selection._check()).toBeUndefined();
  });

  it('EditorFocused', () => {
    const dom = document.createElement('div');
    document.body.appendChild(dom);
    const view = new EditorView(
      { mount: dom },
      {
        state: state,
      }
    );
    expect(view.state).toEqual(state);
  });

  it('icon render', () => {
    const trans = new ImageFromURLCommand();
    trans.getEditor();
    const trans1 = new VideoFromURLCommand();
    expect(trans1.getEditor()).toBeDefined();
  });

  it('uuid', () => {
    const id = uuid();
    expect(id).toBeTruthy();
  });

  it('icon', () => {
    const dom = document.createElement('div');
    document.body.appendChild(dom);
    const view = new EditorView(
      { mount: dom },
      {
        state: state,
      }
    );
    const node = view.state.doc.nodeAt(0);
    expect(node).toBeDefined();

    const imagenodeview = new ImageNodeView(
      node,
      view as unknown as EditorFocused,
      () => 0,
      []
    );
    imagenodeview.update(node, []);
    imagenodeview.renderReactComponent();
    const demodom = document.createElement('div');

    imagenodeview._updateDOM(demodom);
    expect(
      () =>
        new CustomNodeView(node, view as unknown as EditorFocused, () => 1, [])
    ).toThrow();
  });

  it('should init buttons', () => {
    expect(() => plugin.initButtonCommands()).not.toThrow();
  });
});
