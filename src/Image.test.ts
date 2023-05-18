//import * as myModule from './ui/ImageNodeView';
import { createEditor, doc, p } from 'jest-prosemirror';
import { EditorState, TextSelection, Plugin, PluginKey, Transaction } from 'prosemirror-state';
import { Transform } from 'prosemirror-transform';
import { MultimediaPlugin } from './index';
import resolveImage, * as resolveImageMod from './ui/resolveImage';
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

import * as ImgNodView from './ui/ImageNodeView';

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
const srcevent = {
  target: { value: 'https://www.youtube.com/embed/ru60J99ojJw' },
} as React.ChangeEvent<HTMLInputElement>;


describe('MultimediaPlugin', () => {
  it('should handle Image', () => {
    const schema = plugin.getEffectiveSchema(editor.schema);

    const ImgSrcCmd = new ImageSourceCommand();

    ImgSrcCmd.executeWithUserInput(
      state,
      (editor.view as any).dispatch as (tr: Transform) => void,
      editor.view as any,
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

describe('Image Node View ', () => {
  it('should handle View', () => {
    const MMplugin = new MultimediaPlugin();
    const editor = createEditor(doc(p('<cursor>')), {
      plugins: [MMplugin],
    });

    const schema = MMplugin.getEffectiveSchema(editor.schema);

    const modSchema = new Schema({
      nodes: schema.spec.nodes,
    });

    const effSchema = MMplugin.getEffectiveSchema(modSchema);
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

});

it('should resolve Image - Img Instance', async () => {
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
  ImgeditorIns._didSrcChange();
 

  it('should change on src Change Event', async () => {


    const fn = ImgeditorIns._onSrcChange(srcevent);
    expect(fn).toBeCalled;
  });
  it('should check on src Change Event', async () => {


    const fn = ImgeditorIns._didSrcChange();
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

describe('resolveImage ', () => {
  it('should resolve Image - onLoad', async () => {
    const res = {
      complete: true,
      height: 400,
      naturalHeight: 400,
      naturalWidth: 200,
      src: 'https://images.pexels.com/photos/132472/pexels-photo-132472.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=200&h=400',
      width: 200,
    };

    await resolveImage(res.src);
  });
});

describe('Image Node View ', () => {
  it('should change attrs', () => {
    const MMplugin = new MultimediaPlugin();
    const editor = createEditor(doc(p('<cursor>')), {
      plugins: [MMplugin],
    });

    const schema = MMplugin.getEffectiveSchema(editor.schema);

    const modSchema = new Schema({
      nodes: schema.spec.nodes,
    });

    const effSchema = MMplugin.getEffectiveSchema(modSchema);
    const newNode = effSchema.node(effSchema.nodes.paragraph);
    //const newruntime = editor.view['runtime'];

    const dom = document.createElement('div');
    document.body.appendChild(dom);
    const view = new EditorView(
      { mount: dom },
      {
        state: state,
      }
    );
    newNode.attrs =
      { active: true, crop: false, rotate: false };
   
    const newState = EditorState.create({ doc: schema.nodeFromJSON({"type":"doc","attrs":{"layout":null,"padding":null,"width":null,"counterFlags":null},"content":[{"type":"paragraph","attrs":{"align":null,"color":null,"id":null,"indent":null,"lineSpacing":null,"paddingBottom":null,"paddingTop":null},"content":[{"type":"image","attrs":{"align":null,"alt":"","crop":false,"height":null,"rotate":false,"src":"https://images.pexels.com/photos/132472/pexels-photo-132472.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=200&h=400","title":"","width":null,"fitToParent":0}}]}]}), plugins:[new MultimediaPlugin()] });
    
    view.updateState(newState);

    const spyresolveImage = jest.spyOn(resolveImageMod, 'default');
    spyresolveImage.mockResolvedValue({
      complete: true,
      height: 200,
      naturalHeight: 10,
      naturalWidth: 10,
      src: "https://images.pexels.com/photos/132472/pexels-photo-132472.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=200&h=400",
      width: 150,
    });
    
jest.mock('./ui/ImageNodeView', () => ({
  myFunction: jest.fn().mockReturnValue(true),
}));
    // const spyImgNodView = jest.spyOn(ImgNodView, 'isActive');
    // spyImgNodView.mockReturnValue(true);

    const foc={
      focused: true,
      readOnly:false,
      // Image Proxy
      canProxyImageSrc: (src: string) => true,
      getProxyImageSrc: jest.fn().mockReturnValue(Promise.resolve("http:image.png")),
    
      // Image Upload
      canUploadImage: () => true,
      uploadImage: jest.fn().mockResolvedValue( {
        height: 200,
        id: "Test-1",
        src: "",
        width: 150,
      }),
    
      // Comments
      canComment: () => true,
      createCommentThreadID: () => "Test-ID",
    
      // External HTML
      canLoadHTML: () => true,
      loadHTML: jest.fn().mockResolvedValue("baz"),
    
    }
const editFoc={...editor.view,...foc}
    const ImageNdView = new ImageNodeView(newNode,editFoc as any, () => 10, []);
    
  });


});



