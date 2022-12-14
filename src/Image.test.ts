import { createEditor, doc, image, p } from 'jest-prosemirror';
import { EditorState, TextSelection, Plugin, PluginKey, Transaction } from 'prosemirror-state';
import { Transform } from 'prosemirror-transform';
import { VideoPlugin } from './index';
import resolveImage from './ui/resolveImage';
import ImageSourceCommand, { insertImage } from './ImageSourceCommand';
import * as ImgNodSpec from './ImageNodeSpec';
import * as VideoNSpec from './VideoNodeSpec';
import * as ImgURLEdtr from './ui/ImageURLEditor';
import * as resolveImg from './ui/resolveImage';
import ImageNodeView from './ui/ImageNodeView';
import { Schema } from 'prosemirror-model';
import { schema } from 'prosemirror-test-builder';
import ImageUploadPlaceholderPlugin, {
  uploadImageFiles,
  customEditorView,
} from './ImageUploadPlaceholderPlugin';
import * as offLinefunc from './ui/isOffline';
import { ImageEditorState } from './ui/ImageURLEditor';
import ImageURLEditor, { ImageEditorProps } from './ui/ImageURLEditor';
import ImageInlineEditor from './ui/ImageInlineEditor';
import { EditorView } from 'prosemirror-view';
class TestPlugin extends Plugin {
  constructor() {
    super({
      key: new PluginKey('TestPlugin'),
    });
  }
}

const plugin = new VideoPlugin();
const editor = createEditor(doc(p('<cursor>')), {
  plugins: [plugin],
});
const attrs = {
  alt: '',

  src: 'https://images.pexels.com/photos/132472/pexels-photo-132472.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=200&h=400',
  title: '',
};

const ImageArgs = {
  height: 400,
  id: '',
  src: 'https://images.pexels.com/photos/132472/pexels-photo-132472.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=200&h=400',
  width: 200,
};

const state: EditorState = EditorState.create({
  schema: schema,
  selection: editor.selection,
  plugins: [new VideoPlugin()],
});
const newstate: EditorState = EditorState.create({
  schema: schema,
  selection: undefined,
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
const srcevent = {
  target: { value: 'https://www.youtube.com/embed/ru60J99ojJw' },
} as React.ChangeEvent<HTMLInputElement>;


describe('MultimediaPlugin', () => {
  it('should handle Image', () => {
    const schema = plugin.getEffectiveSchema(editor.schema);

    const ImgSrcCmd = new ImageSourceCommand();

    ImgSrcCmd.executeWithUserInput(
      state,
      editor.view.dispatch as (tr: Transform) => void,
      editor.view,
      ImageArgs
    );
    // ImgSrcCmd.getEditor();
    ImgSrcCmd.__isEnabled(state, editor.view);
    ImgSrcCmd.__isEnabled(newstate, editor.view);
    ImgSrcCmd.__isEnabled(newstate1, editor.view);

    // ImgSrcCmd.waitForUserInput(
    //   state,
    //   editor.view.dispatch as (tr: Transform) => void,
    //   editor.view
    // );
  });
  it('ImageNodespec ', () => {
    const img = document.createElement('img');
    img.src = '1200x800';
    // img.style.align='left';
    img.setAttribute('align', 'left');
    // img.style.cssFloat='left';
    ImgNodSpec.getAttrs(img);
  });

  it('ImageNodespec ', () => {
    const img = document.createElement('img');
    img.src = '1200x800';
    // img.style.align='left';
    // img.setAttribute('align', 'left');
    img.style.cssFloat = 'left';
    ImgNodSpec.getAttrs(img);
  });

  it('ImageNodespec ', () => {
    const img = document.createElement('img');
    img.src = '1200x800';
    // img.style.align='left';
    // img.setAttribute('align', 'left');
    img.style.cssFloat = 'right';
    ImgNodSpec.getAttrs(img);
  });

  it('ImageNodespec ', () => {
    const img = document.createElement('img');
    img.src = '1200x800';
    // img.style.align='left';
    // img.setAttribute('align', 'left');
    img.style.display = 'block';
    ImgNodSpec.getAttrs(img);
  });

  // it('ImageNodeView ', () => {
  //   const imgNod =require('./ui/ImageNodeView')
  //   const img = document.createElement('img');
  //   img.src = '1200x800';
  //   imgNod.getMaxResizeWidth(img);
  // });
});

describe('Image Node View ', () => {
  it('should handle View', () => {
    const Vplugin = new VideoPlugin();
    const editor = createEditor(doc(p('<cursor>')), {
      plugins: [Vplugin],
    });

    const schema = Vplugin.getEffectiveSchema(editor.schema);

    const modSchema = new Schema({
      nodes: schema.spec.nodes,
    });

    const effSchema = Vplugin.getEffectiveSchema(modSchema);
    const newNode = effSchema.node(effSchema.nodes.paragraph);
    const newruntime = editor.view['runtime'];
    const foc = {
      focused: true,
      runtime: newruntime,
    };
    const editfoc = Object.assign(editor.view, foc);

    const ImageNdView = new ImageNodeView(newNode, editfoc, () => 10, []);
    ImageNdView.__renderReactComponent();
  });
  it('should handle image placeholder plugin', () => {
    const plugin = new ImageUploadPlaceholderPlugin();
    const editor = createEditor(doc(p('<cursor>')), {
      plugins: [plugin],
    });
    const state: EditorState = EditorState.create({
      schema: schema,
      selection: editor.selection,
      plugins: [plugin],
    });
    expect(ImageUploadPlaceholderPlugin).toBeDefined();
  });
  xit('should resolve Image - onLoad', async () => {
    const res = {
      complete: true,
      height: 400,
      naturalHeight: 400,
      naturalWidth: 200,
      src: 'https://images.pexels.com/photos/132472/pexels-photo-132472.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=200&h=400',
      width: 200,
    };

    const isBodyMock = jest.spyOn(resolveImg, 'isBody');
    isBodyMock.mockImplementation((body) => {
      return false;
    });
    //window.dispatchEvent(new Event('load'));
    await resolveImage(res.src);
  });
});

xit('should resolve Image - Img Instance', async () => {
  const res = {
    complete: true,
    height: 400,
    naturalHeight: 400,
    naturalWidth: 200,
    src: 'https://images.pexels.com/photos/132472/pexels-photo-132472.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=200&h=400',
    width: 200,
  };

  const isImgInsMock = jest.spyOn(resolveImg, 'isImgInstance');
  isImgInsMock.mockImplementation(() => {
    return true;
  });
  await resolveImage(res.src);
});

// describe('ImageNodeView', () => {
//   it('should load   ImageNodeView', () => {
//     const newNode = { "type": "image", "attrs": { "align": null, "alt": "", "crop": null, "height": null, "rotate": null, "src": "https://images.pexels.com/photos/132472/pexels-photo-132472.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=200&h=400", "title": "", "width": null } }

//     const ImgView = new ImageNodeView();

//   })
// });


describe('ImageEditor ', () => {
  const attrs = {
    id: '',
    align: null,
    alt: '',
    crop: null,
    height: 200,
    rotate: null,
    src: 'https://images.pexels.com/photos/132472/pexels-photo-132472.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=200&h=400',

    title: '',
    width: 400,
  };
  const ImgState: ImageEditorState = {
    id: attrs.id,
    src: attrs.src,
    width: attrs.width,
    height: attrs.height,
    validValue: {},
  };
  const properties: ImageEditorProps = {
    initialValue: {},
    close: (val?) => { },
  };
  const newState = state.apply(
    insertImage(state.tr, schema, ImgState.src) as Transaction);
  const ImgeditorIns = new ImageURLEditor(properties, newState);

  it('should change on src Change Event', async () => {


    const fn = ImgeditorIns._onSrcChange(srcevent);
    expect(fn).toBeCalled;
  });

  it('should handle image placeholder plugin', () => {
    const plugin = new ImageUploadPlaceholderPlugin();
    const editor = createEditor(doc(p('<cursor>')), {
      plugins: [plugin],
    });
    const state: EditorState = EditorState.create({
      schema: schema,
      selection: editor.selection,
      plugins: [plugin],
    });
    expect(ImageUploadPlaceholderPlugin).toBeDefined();
  });

  it('Image Inline Editor', async () => {
    const props = {
      onSelect: (val: 'RIGHT') => { },
      value: { align: 'RIGHT' }
    };
    const ImgInlinEdtr = new ImageInlineEditor(props);
    const x = ImgInlinEdtr.render();
  });

  it('should upload image files', () => {
    const view1 = new EditorView(document.querySelector('#editor'), {
      state,
      handleKeyPress() {
        console.log('key');
      },

    });
    const cusEdtView = {
      ...view1 as EditorView, runtime: '1',
      readOnly: '2',
      disabled: true
    };
    const view: customEditorView = cusEdtView as customEditorView;

    expect(uploadImageFiles(view, [], { x: 1, y: 2 })).toBeDefined;


  });
});