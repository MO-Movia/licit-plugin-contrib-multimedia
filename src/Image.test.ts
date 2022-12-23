import { screen } from '@testing-library/dom';
import { createEditor, doc, p } from 'jest-prosemirror';
import { EditorState, TextSelection, Plugin, PluginKey, Transaction } from 'prosemirror-state';
import { Transform } from 'prosemirror-transform';
import { MultimediaPlugin } from './index';
import resolveImage from './ui/resolveImage';
import ImageSourceCommand, { insertImage } from './ImageSourceCommand';
import * as ImgNodSpec from './ImageNodeSpec';
import * as resolveImg from './ui/resolveImage';
import ImageNodeView from './ui/ImageNodeView';
import { Schema } from 'prosemirror-model';
import { schema } from 'prosemirror-test-builder';
import ImageUploadPlaceholderPlugin, {
  uploadImageFiles,
  customEditorView,
} from './ImageUploadPlaceholderPlugin';
import { ImageEditorState } from './ui/ImageURLEditor';
import ImageURLEditor, { ImageEditorProps } from './ui/ImageURLEditor';
import ImageInlineEditor from './ui/ImageInlineEditor';
import { EditorView } from 'prosemirror-view';
import ImageNodeSpec from './ImageNodeSpec';
import ImageResizeBox from './ui/ImageResizeBox';
class TestPlugin extends Plugin {
  constructor() {
    super({
      key: new PluginKey('TestPlugin'),
    });
  }
}

const plugin = new MultimediaPlugin();
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
  plugins: [new MultimediaPlugin()],
});
const newstate: EditorState = EditorState.create({
  schema: schema,
  selection: undefined,
  plugins: [new MultimediaPlugin()],
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
  plugins: [new MultimediaPlugin()],
});
const srcevent = {
  target: { value: 'https://www.youtube.com/embed/ru60J99ojJw' },
} as React.ChangeEvent<HTMLInputElement>;


xdescribe('MultimediaPlugin', () => {
  it('should handle Image', () => {
    const schema = plugin.getEffectiveSchema(editor.schema);

    const ImgSrcCmd = new ImageSourceCommand();

    ImgSrcCmd.executeWithUserInput(
      state,
      editor.view.dispatch as (tr: Transform) => void,
      editor.view  as any,
      ImageArgs
    );
    ImgSrcCmd.__isEnabled(state, editor.view as any);
    ImgSrcCmd.__isEnabled(newstate, editor.view as any) ;
    ImgSrcCmd.__isEnabled(newstate1, editor.view as any);
    ImgSrcCmd.isEnabled(state, editor.view as any);
  });

  it('ImageNodespec ', () => {
    const img = document.createElement('img');
    img.src = '1200x800';
    img.setAttribute('align', 'left');
    ImgNodSpec.getAttrs(img);
  });

  it('ImageNodespec ', () => {
    const img = document.createElement('img');
    img.src = '1200x800';
    img.style.cssFloat = 'left';
    ImgNodSpec.getAttrs(img);
  });

  it('ImageNodespec ', () => {
    const img = document.createElement('img');
    img.src = '1200x800';
    img.style.cssFloat = 'right';
    ImgNodSpec.getAttrs(img);
  });

  it('ImageNodespec ', () => {
    const img = document.createElement('img');
    img.src = '1200x800';
    img.style.display = 'block';
    ImgNodSpec.getAttrs(img);
  });

  it('ImageNodeView ', () => {
    const node = {
      attrs: {
        id: '',
        align: null,
        alt: '',
        crop: null,
        height: 200,
        rotate: null,
        src: 'https://images.pexels.com/photos/132472/pexels-photo-132472.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=200&h=400',

        title: '',
        width: 400,
      },
    };
    ImageNodeSpec.toDOM(node);

  });
});

xdescribe('Image Node View ', () => {
  it('should handle View', () => {
    const Vplugin = new MultimediaPlugin();
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
    const editfoc = Object.assign(editor.view as any, foc);

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
  it('should resolve Image - onLoad', async () => {
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
    global.document.createElement = (function (create) {
      return function () {
        const element = create.apply(this, arguments);

        if (element.tagName === 'IMG') {
          setTimeout(() => {
            element.onload(new Event('load'));
          }, 100);
        }
        return element;
      };
    })(document.createElement);
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
  global.document.createElement = (function (create) {
    return function () {
      const element = create.apply(this, arguments);

      if (element.tagName === 'IMG') {
        setTimeout(() => {
          element.onload(new Event('load'));
        }, 100);
      }
      return element;
    };
  })(document.createElement);

  await resolveImage(res.src);
});

xdescribe('ImageEditor ', () => {
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

  it('should upload image files readonly and disabled true and runtime.canuploadimage true', () => {
    const state: EditorState = EditorState.create({
      schema: schema,
      selection: editor.selection,
      plugins: [new MultimediaPlugin()],
    });
    const view1 = new EditorView(document.querySelector('#editor'), {
      state,
    });
    const cusEdtView = {
      ...view1 as EditorView, runtime: { canUploadImage: () => true },
      readOnly: false,
      disabled: false
    };
    const view: customEditorView = cusEdtView as customEditorView;

    const filex: File = new File([], 'NEW FILE');

    expect(uploadImageFiles(view, [filex], { x: 1, y: 2 })).toBeDefined;
  });

  it('should upload image files readonly and disabled true and runtime.canuploadimage true', () => {
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
      readOnly: false,
      disabled: false
    };
    const view: customEditorView = cusEdtView as customEditorView;
    const filex: File = new File([], 'NEW FILE');

    expect(uploadImageFiles(view, [filex], { x: 1, y: 2 })).toBeDefined;
  });
});

xdescribe('Image Resize Box ', () => {
  it('should render Image Resize Box', () => {
    const Props = {
      height: 400,
      onResizeEnd: (w: 200, height: 113) => { },
      src: 'https://images.pexels.com/photos/132472/pexels-photo-132472.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=200&h=400',
      width: 200,
    };
    const ImgResBox = new ImageResizeBox(Props);
  });
});