import { createEditor, doc, p } from 'jest-prosemirror';
import { EditorState, TextSelection, Transaction, Plugin, PluginKey } from 'prosemirror-state';
import { Transform } from 'prosemirror-transform';
import { MultimediaPlugin, bindImageView, bindVideoView } from './index';
import { VideoEditorState } from './ui/VideoEditor';
import VideoSourceCommand, { insertIFrame } from './VideoSourceCommand';
import ImageUploadCommand from './ImageUploadCommand';
import VideoUploadCommand from './VideoUploadCommand';
import { VideoEditorProps } from './ui/VideoEditor';
import ImageUploadPlaceholderPlugin from './ImageUploadPlaceholderPlugin';
import canUseCSSFont from './ui/canUseCSSFont';
import isOffline from './ui/isOffline';
import ImageNodeView from './ui/ImageNodeView';
import { EditorView } from 'prosemirror-view';
import VideoFromURLCommand from './VideoFromURLCommand';
import SelectionObserver from './ui/SelectionObserver';
import uuid from './ui/uuid';
import {
  Schema,
} from 'prosemirror-model';
import CustomNodeView from './ui/CustomNodeView';
import ImageFromURLCommand from './ImageFromURLCommand';
import { EditorRuntime } from './Types';

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

  const schema = plugin.getEffectiveSchema(editor.schema);
  const state: EditorState = EditorState.create({
    doc: doc(p('Hello World!!!')),
    schema: schema,
    selection: editor.selection,
    plugins: [new MultimediaPlugin()],
  });

  const selection = TextSelection.create((editor.view as any).state.doc, 0, 0);
  const tr = (editor.view as any).state.tr.setSelection(selection);
  (editor.view as any).updateState(
    (editor.view as any).state.reconfigure({ plugins: [plugin, new TestPlugin()] })
  );

  (editor.view as any).dispatch(tr);

  const newstate1: EditorState = EditorState.create({
    schema: schema,
    selection: selection,
    plugins: [new MultimediaPlugin()],
  });
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
  const properties: VideoEditorProps = {
    initialValue: {},
    close: (val?) => { },
  };

  const newState = newstate1.apply(
    insertIFrame(newstate1.tr, schema, veState) as Transaction
  );

  const imageUploadPlaceholderPlugin = new ImageUploadPlaceholderPlugin();
  const fontSupported = canUseCSSFont('Material Icons');
  isOffline();
  new VideoSourceCommand().executeWithUserInput(
    state,
    (editor.view as any).dispatch as (tr: Transform) => void,
    editor.view as any,
    veState
  );

  new VideoSourceCommand().__isEnabled(
    state,
    editor.view as any,
  );


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

    new VideoSourceCommand().executeWithUserInput(
      state,
      (editor.view as any).dispatch as (tr: Transform) => void,
      editor.view  as any,
      veState
    );

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
    const statetest: EditorState = EditorState.create({
      doc: doc(p('Hello World!!!')),
      schema: schema,
      selection: undefined,
      plugins: [new MultimediaPlugin()],
    });
    new VideoSourceCommand().__isEnabled(
      statetest,
      editor.view as any,
    );
  });

  it('isEnabled in VideoSourceCommand ', () => {
    const statetest: EditorState = EditorState.create({
      doc: doc(p('Hello World!!!')),
      schema: schema,
      selection: undefined,
      plugins: [new MultimediaPlugin()],
    });
    new VideoSourceCommand().isEnabled(
      statetest,
      editor.view as any,
    );
  });

  it('isEnabled in image', () => {
    const view = new EditorView(document.querySelector('#editor'), {
      state,
      handleKeyPress() {
        console.log('key');
      }
    });
    const cusEdtView = {
      ...view as EditorView, runtime: { canUploadImage: () => true },
      readOnly: false,
      disabled: false
    };
   // const trans = new ImageUploadCommand();
    const editorruntime: EditorRuntime = {
      // Image Proxy
      canProxyImageSrc: () => {
        return true;
      },
      // getProxyImageSrc: () => Promise.reject(),
      // Image Upload
      canUploadImage: () => false,
      uploadImage: (obj: Blob) => Promise.reject(),
      // Comments
      canComment: () => true,
      createCommentThreadID: () => 'string',
      // External HTML
      canLoadHTML: () => true,
      //loadHTML: () => Promise<string>,
    };
   // trans.runtime = editorruntime;
  //  expect(trans.isEnabled(state, view)).toBeFalsy();
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
      uploadImage: (obj: Blob) => Promise.reject(),
      // Comments
      canComment: () => false,
      createCommentThreadID: () => 'string',
      // External HTML
      canLoadHTML: () => true,
      //loadHTML: () => Promise<string>,
    };
    const trans = new ImageUploadCommand();
    trans.runtime = editorruntime;

    const state = EditorState.create({
      doc: doc(p('Hello World!!')),
      schema: schema,
    });
    const dom = document.createElement('div');
  
    const editorView = new EditorView(
      {mount: dom},
      {
        state: state,
      }
    );
    editorView['runtime'] = editorruntime;
    trans.isEnabled(state, editorView)
    trans.getEditor();
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
      uploadImage: (obj: Blob) => Promise.reject(),
      // Comments
      canComment: () => false,
      createCommentThreadID: () => 'string',
      // External HTML
      canLoadHTML: () => true,
      //loadHTML: () => Promise<string>,
    };
    const trans = new ImageUploadCommand();
    trans.runtime = editorruntime;

    const state = EditorState.create({
      doc: doc(p('Hello World!!')),
      schema: schema,
    });
    const dom = document.createElement('div');
  
    const editorView = new EditorView(
      {mount: dom},
      {
        state: state,
      }
    );
    editorView['runtime'] = editorruntime;
    trans.isEnabled(state, editorView)
  });

  it('getEditor', () => {

    const trans = new VideoUploadCommand();
    trans.getEditor();
  });

  it('can Image Upload', () => {
    const editorruntime: EditorRuntime = {
      // Image Proxy
      canProxyImageSrc: () => {
        return true;
      },
      // getProxyImageSrc: () => Promise.reject(),
      // Image Upload
      canUploadImage: undefined,
      uploadImage: (obj: Blob) => Promise.reject(false),
      // Comments
      canComment: () => false,
      createCommentThreadID: () => 'string',
      // External HTML
      canLoadHTML: () => true,
      //loadHTML: () => Promise<string>,
    };
    const trans = new ImageUploadCommand();
    trans.runtime = editorruntime;
    trans.runtime.canUploadImage = undefined;
    const state = EditorState.create({
      doc: doc(p('Hello World!!')),
      schema: schema,
    });
    const dom = document.createElement('div');
  
    const editorView = new EditorView(
      {mount: dom},
      {
        state: state,
      }
    );
    editorView['runtime'] = null;
    trans.isEnabled(state, null)
    
  });


  it('can Image Upload', () => {
    const editorruntime: EditorRuntime = {
      // Image Proxy
      canProxyImageSrc: () => {
        return true;
      },
      // getProxyImageSrc: () => Promise.reject(),
      // Image Upload
      canUploadImage: undefined,
      uploadImage: (obj: Blob) => Promise.reject(false),
      // Comments
      canComment: () => false,
      createCommentThreadID: () => 'string',
      // External HTML
      canLoadHTML: () => true,
      //loadHTML: () => Promise<string>,
    };
    const trans = new ImageUploadCommand();
    trans.runtime = editorruntime;
    trans.runtime.canUploadImage = undefined;
    const state = EditorState.create({
      doc: doc(p('Hello World!!')),
      schema: schema,
    });
    const dom = document.createElement('div');
  
    const editorView = new EditorView(
      {mount: dom},
      {
        state: state,
      }
    );
    editorView['runtime'] = null;
    trans.isEnabled(state, editorView)
    
  });

  
  it('bindImageView', () => {
    const view = new EditorView(document.querySelector('#editor'), {
      state,
      handleKeyPress() {
        console.log('key');
      }
    });
    expect(bindImageView(doc(p('<cursor>')), view, true)).toBeDefined();
  });

  it('bindVideoView', () => {
    const view = new EditorView(document.querySelector('#editor'), {
      state,
      handleKeyPress() {
        console.log('key');
      }
    });
    expect(bindVideoView(doc(p('<cursor>')), view, true)).toBeDefined();
  });

  it('selectionObserver', () => {
    const selection = new SelectionObserver(undefined as any);
    selection.disconnect();
    selection.takeRecords();
    selection._check();
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
  });

  it('icon render', () => {
    const trans = new ImageFromURLCommand();
    trans.getEditor();
    const trans1 = new VideoFromURLCommand();
    trans1.getEditor();
  });

  it('uuid', () => {
    const id = uuid();
  });

  it('icon', () => {
    const modSchema = new Schema({
      nodes: schema.spec.nodes,
    });
    const dom = document.createElement('div');
    document.body.appendChild(dom);
    const view = new EditorView(
      { mount: dom },
      {
        state: state,
      }
    );

    const imagenodeview = new ImageNodeView((editor.view as any).state.doc.nodeAt(0)!, view as any, () => 0, null as any);
    imagenodeview.update((editor.view as any).state.doc.nodeAt(0)!, null as any);
    imagenodeview.renderReactComponent();
    const demodom = document.createElement('div');


    imagenodeview._updateDOM(demodom);
    expect(() => {
      new CustomNodeView((editor.view as any).state.doc.nodeAt(0)!, view as any, 1 as any, null as any);
    }).toThrow();
  });
 
});

