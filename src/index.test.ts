import { createEditor, doc, p } from 'jest-prosemirror';
import { EditorState, TextSelection, Transaction, Plugin, PluginKey } from 'prosemirror-state';
import { Transform } from 'prosemirror-transform';
import { VideoPlugin, bindImageView, bindVideoView } from './index';
import { VideoEditorState } from './ui/VideoEditor';
import VideoSourceCommand, { insertIFrame } from './VideoSourceCommand';
import ImageUploadCommand from './ImageUploadCommand';
import VideoUploadCommand from './VideoUploadCommand';
import { VideoEditorProps } from './ui/VideoEditor';
import ImageUploadPlaceholderPlugin from './ImageUploadPlaceholderPlugin';
import canUseCSSFont from './ui/canUseCSSFont';
import isOffline from './ui/isOffline';
import { EditorFocused } from './ui/CustomNodeView';
import renderer from 'react-test-renderer';
import TestRenderer from 'react-test-renderer';
import { configure, shallow } from 'enzyme';
import Icon from './ui/Icon';
import { render, fireEvent, screen } from '@testing-library/react';
import ImageNodeView from './ui/ImageNodeView';
import ImageInlineEditor from './ui/ImageInlineEditor';
import { EditorView } from 'prosemirror-view';
import VideoFromURLCommand from './VideoFromURLCommand';
import SelectionObserver from './ui/SelectionObserver';
import uuid from './ui/uuid';
import {
  DOMOutputSpec,
  Mark,
  MarkSpec,
  Schema,
  ResolvedPos,
} from 'prosemirror-model';
import ImageURLEditor from './ui/ImageURLEditor';
import CustomNodeView from './ui/CustomNodeView';
import { node } from 'prop-types';
import ImageFromURLCommand from './ImageFromURLCommand';
import { EditorRuntime } from './Types';


class TestPlugin extends Plugin {
  constructor() {
    super({
      key: new PluginKey('TestPlugin'),
    });
  }
}


describe('VideoPlugin', () => {
  const plugin = new VideoPlugin();
  const editor = createEditor(doc(p('<cursor>')), {
    plugins: [plugin],
  });

  const schema = plugin.getEffectiveSchema(editor.schema);
  const state: EditorState = EditorState.create({
    doc: doc(p('Hello World!!!')),
    schema: schema,
    selection: editor.selection,
    plugins: [new VideoPlugin()],
  });

  const selection = TextSelection.create(editor.view.state.doc, 0, 0);
  const tr = editor.view.state.tr.setSelection(selection);
  editor.view.updateState(
    editor.view.state.reconfigure({ plugins: [plugin, new TestPlugin()] })
  );

  editor.view.dispatch(tr);

  const newstate1: EditorState = EditorState.create({
    schema: schema,
    selection: selection,
    plugins: [new VideoPlugin()],
  });

  // const state1: EditorState = EditorState.create({
  //   doc: doc(p('Hello World!!!')),
  //   schema: schema,
  //   selection: undefined,
  //   plugins: [new VideoPlugin()],
  // });


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
  // imageUploadPlaceholderPlugin.spec.props?.decorations(state);
  const fontSupported = canUseCSSFont('Material Icons');
  isOffline();
  // new ImageUploadPlaceholderPlugin().props.decorations(state);
  new VideoSourceCommand().executeWithUserInput(
    state,
    editor.view.dispatch as (tr: Transform) => void,
    editor.view,
    veState
  );

  new VideoSourceCommand().__isEnabled(
    state,
    editor.view,
  );


  it('should handle Video', () => {
    const plugin = new VideoPlugin();
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
      plugins: [new VideoPlugin()],
    });

    const newState = state.apply(
      insertIFrame(state.tr, schema, veState) as Transaction
    );

    new VideoSourceCommand().executeWithUserInput(
      state,
      editor.view.dispatch as (tr: Transform) => void,
      editor.view,
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
      plugins: [new VideoPlugin()],
    });
    new VideoSourceCommand().__isEnabled(
      statetest,
      editor.view,
    );
  });

  it('isEnabled in VideoSourceCommand ', () => {
    const statetest: EditorState = EditorState.create({
      doc: doc(p('Hello World!!!')),
      schema: schema,
      selection: undefined,
      plugins: [new VideoPlugin()],
    });
    new VideoSourceCommand().isEnabled(
      statetest,
      editor.view,
    );
  });
  it('isEnabled in image', () => {
    const view = new EditorView(document.querySelector('#editor'), {
      state,
      handleKeyPress() {
        console.log('key');
      }
    });
    const trans = new ImageUploadCommand();
    const editorruntime: EditorRuntime = {
      // Image Proxy
      canProxyImageSrc: () => {
        return true;
      },
      getProxyImageSrc: () => 'string',
      // Image Upload
      canUploadImage: () => false,
      uploadImage: (obj: Blob) => Promise.reject(),
      // Comments
      canComment: () => true,
      createCommentThreadID: () => 'string',
      //renderComment: (props: RenderCommentProps) => React.ReactElement,
      // External HTML
      canLoadHTML: () => true,
      //loadHTML: () => Promise<string>,
    };
    trans.runtime = editorruntime;
    expect(trans.isEnabled(state, view)).toBeFalsy();
  });
  it('getEditor', () => {
    const trans = new ImageUploadCommand();
    trans.getEditor();
  });

  it('isEnabled', () => {
    const trans = new ImageUploadCommand();
    trans.isEnabled(state, editor.view);
  });

  it('getEditor', () => {
    const trans = new VideoUploadCommand();
    trans.getEditor();
  });

  it('isEnabled', () => {
    const trans = new VideoUploadCommand();
    trans.isEnabled(state, editor.view);
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
    // const { doc, p } = builders(effSchema, { p: { nodeType: 'paragraph' } });
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
    // TestRenderer.create(<LoadingIndicator/>);
    // render(<LoadingIndicator/>) ;
    // renderer.create(<LoadingIndicator /> as any);
    // render(<ImageInlineEditor >);
    //  const wrapper = shallow(<ImageInlineEditor >);
  });

  it('uuid', () => {
    const id = uuid();
    // TestRenderer.create(<LoadingIndicator/>);
    // render(<LoadingIndicator/>) ;
    // renderer.create(<LoadingIndicator /> as any);
    // render(<ImageInlineEditor >);
    //  const wrapper = shallow(<ImageInlineEditor >);
  });
  xit('icon', () => {
    const modSchema = new Schema({
      nodes: schema.spec.nodes,
    });


    const dom = document.createElement('div');
    document.body.appendChild(dom);
    // const { doc, p } = builders(effSchema, { p: { nodeType: 'paragraph' } });
    const view = new EditorView(
      { mount: dom },
      {
        state: state,
      }
    );

    const imagenodeview = new ImageNodeView(editor.view.state.doc.nodeAt(0), view as any, () => 0, null as any);
    imagenodeview.update(editor.view.state.doc.nodeAt(0), null as any);
    imagenodeview.renderReactComponent();
    const demodom = document.createElement('div');
    // const spyiSNVMock = jest.spyOn(imagenodeview, 'getPos');
    // spyiSNVMock.mockReturnValue(0);

    imagenodeview._updateDOM(demodom);

    const objCustomNodeView = new CustomNodeView(editor.view.state.doc.nodeAt(0), view as any, () => 0 as any, null as any);
    const el = document.createElement('span');
    el.className = 'molm-czi-image-view';

    const spyhsMock = jest.spyOn(objCustomNodeView, 'createDOMElement');
    spyhsMock.mockReturnValue(el);

    const spyhsMock1 = jest.spyOn(objCustomNodeView, 'renderReactComponent');
    spyhsMock1.mockReturnValue(el as any);


    objCustomNodeView.update(editor.view.state.doc.nodeAt(0), null);
    objCustomNodeView.stopEvent();
    objCustomNodeView.selectNode();
    objCustomNodeView.deselectNode();
    objCustomNodeView.destroy();
    // render(<Icon />),
    //   const component = renderer.create(
    //     // <Link page="http://www.facebook.com">Facebook</Link>,
    //     <Icon title='abcd' type = 'icon'/> ,
    // );
  });
});

