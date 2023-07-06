import { createEditor, doc, p, tr } from 'jest-prosemirror';
import {
  EditorState,
  Transaction,
} from 'prosemirror-state';
import { Transform } from 'prosemirror-transform';
import { MultimediaPlugin } from './index';
import { VideoEditorState } from './ui/VideoEditor';
import { VideoEditorProps } from './ui/VideoEditor';
import VideoSourceCommand, { insertIFrame } from './VideoSourceCommand';
import {
  showCursorPlaceholder,
  hideCursorPlaceholder,
  specFinder,
  isPlugin,
  resetInstance
} from './CursorPlaceholderPlugin';
import VideoEditor from './ui/VideoEditor';
import resolveVideo from './ui/resolveVideo';
import axios from 'axios';
import { throwError } from 'rxjs';
import VideoResizeBox from './ui/VideoResizeBox';
import { VideoViewBody } from './ui/VideoNodeView';
import VideoNodeView from './ui/VideoNodeView';
import CursorPlaceholderPlugin from './CursorPlaceholderPlugin';
import { TextSelection } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
const srcevent = {
  target: { value: 'https://www.youtube.com/embed/ru60J99ojJw' },
} as React.ChangeEvent<HTMLInputElement>;
const resp = {
  data: {
    title: 'US Three Lethal A-10 Warthog Arrive in Ukraine',
    author_name: 'American Fighter',
    author_url: 'https://www.youtube.com/@americanfighter1990',
    type: 'video',
    height: 113,
    width: 200,
    version: '1.0',
    provider_name: 'YouTube',
    provider_url: 'https://www.youtube.com/',
    thumbnail_height: 360,
    thumbnail_width: 480,
    thumbnail_url: 'https://i.ytimg.com/vi/ru60J99ojJw/hqdefault.jpg',
    html: '<iframe width="200" height="113" src="https://www.youtube.com/embed/ru60J99ojJw?feature=oembed" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen title="US Three Lethal A-10 Warthog Arrive in Ukraine"></iframe>',
  },
  status: 200,
  statusText: '',
  headers: {
    'cache-control': 'private',
    'content-encoding': 'gzip',
    'content-length': '410',
    'content-type': 'application/json',
    date: 'Tue, 13 Dec 2022 08:24:08 GMT',
    server: 'scaffolding on HTTPServer2',
    vary: 'Origin, X-Origin, Referer',
  },
  config: {
    transitional: {
      silentJSONParsing: true,
      forcedJSONParsing: true,
      clarifyTimeoutError: false,
    },
    adapter: ['xhr', 'http'],
    transformRequest: [null],
    transformResponse: [null],
    timeout: 0,
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',
    maxContentLength: -1,
    maxBodyLength: -1,
    env: {},
    headers: { Accept: 'application/json, text/plain, */*' },
    method: 'get',
    url: 'https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=ru60J99ojJw&format=json',
  },
  request: {},
};

describe('Video Plugin - Test', () => {

  const plugin = new MultimediaPlugin();
  const editor = createEditor(doc(p('<cursor>')), {
    plugins: [plugin],
  });

  const schema = plugin.getEffectiveSchema(editor.schema);
  const state: EditorState = EditorState.create({
    schema: schema,
    selection: editor.selection,
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

  const newState = state.apply(
    insertIFrame(state.tr, schema, veState) as Transaction
  );

  const VideoeditorIns = new VideoEditor(properties, newState);





  it('should Init VideoSourceCommand', async () => {
    const cmd = new VideoSourceCommand().executeWithUserInput(
      state,
      (editor.view as any).dispatch as (tr: Transform) => void,
      editor.view as any,
      veState
    );
    const state1 = EditorState.create({
      doc: doc(p('Hello World!!')),
      schema: schema,
    });
    const dom = document.createElement('div');

    const editorView = new EditorView(
      { mount: dom },
      {
        state: state1,
      }
    );
    new VideoSourceCommand().__isEnabled(state1, editorView);

  });

  it('should call getEditor', async () => {
    try {
      const comp = new VideoSourceCommand().getEditor();
    } catch (e) {
      expect(e).toBeDefined();
    }
  });

  xit('should call waitforuserInput', async () => {
    const state2 = EditorState.create({
      doc: doc(p('Hello World!!')),
      schema: schema,
    });
    const dom = document.createElement('div');

    const editorView = new EditorView(
      { mount: dom },
      {
        state: state2,
      }
    );
    const comp = new VideoSourceCommand().waitForUserInput(state, undefined, editorView, undefined);


  });

  it('should change on src Change Event - resolved', async () => {
    mockedAxios.get.mockResolvedValue(resp);
    const res = await VideoeditorIns._onSrcChange(srcevent);
    expect(res).toBeCalled;
  });

  it('should change on src Change Event - rejected', async () => {
    mockedAxios.get.mockRejectedValue(throwError('server error'));
    const res = await VideoeditorIns._onSrcChange(srcevent);
    expect(res).toBeCalled;
  });

  it('should change on Width Change Event ', async () => {
    const event = {
      target: { width: 113 },
    } as React.ChangeEvent<HTMLInputElement>;
    const res = await VideoeditorIns._onWidthChange(event);
    expect(res).toBeCalled;
  });

  it('should change on Height Change Event ', async () => {
    const event = {
      target: { height: 200 },
    } as React.ChangeEvent<HTMLInputElement>;

    const res = await VideoeditorIns._onHeightChange(event);
    expect(res).toBeCalled;
  });

  it('should showCursorPlaceholder', () => {
    const state: EditorState = EditorState.create({
      schema: schema,
      selection: editor.selection,
      plugins: [new CursorPlaceholderPlugin()],
    });
    const trans = showCursorPlaceholder(state);
  });

  it('should call isPlugin', () => {
    const stateWithoutPlugin: EditorState = EditorState.create({
      schema: schema,
      selection: editor.selection,
      plugins: [],
    });
    isPlugin(null, stateWithoutPlugin.tr);
  });

  it('should resolve video', async () => {
    const res = {
      complete: true,
      height: 113,
      id: '',
      src: 'https://www.youtube.com/embed/ru60J99ojJw',
      width: 200,
    };

    const exp = await resolveVideo(veState);
    expect(exp).toStrictEqual(res);
  });

  it('should resolve video', async () => {
    const nullsrcState: VideoEditorState = {
      id: attrs.id,
      src: '',
      width: attrs.width,
      height: attrs.height,
      validValue: true,
    };
    const newState = state.apply(
      insertIFrame(state.tr, schema, nullsrcState) as Transaction
    );
    const VideoeditorIns = new VideoEditor(properties, newState);
    const res = {
      complete: true,
      height: 113,
      id: '',
      src: '',
      width: 200,
    };

    const exp = await resolveVideo(nullsrcState);
    expect(exp).toEqual(res);
  });

  xit('should change on Resize', async () => {
    const ResizeProp = {
      height: 200,
      onResizeEnd: (w: 200, height: 425) => { },
      src: '',
      width: 113,
    };

    const VdoViewBody = new VideoViewBody(ResizeProp);
    VdoViewBody.getScaleSize();
    VdoViewBody._renderInlineEditor();
    VdoViewBody._resolveOriginalSize();
    VdoViewBody._onResizeEnd(250, 500);
    VdoViewBody._onChange({ align: 'right' });
    VdoViewBody.getClipStyle(200, 500, 150, {
      width: 100,
      height: 200,
      left: 5,
      top: 1,
    }, 2, {
      width: 100,
      height: 200, complete: true
    });
  });

  it('should wait For User Input - Video', () => {
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
    const videoNodeView = new VideoNodeView(node as any, editor.view as any, () => 0 as any, null as any);
    videoNodeView.createDOMElement();
    videoNodeView.renderReactComponent();
    const img = document.createElement('img');
    videoNodeView._updateDOM(img);
  });


  it('Video Resize Box ', () => {
    const Resprops = {
      height: 200,
      onResizeEnd: (w: 200, height: 100) => { },
      src: 'https://www.youtube.com/embed/ru60J99ojJw',
      width: 400
    };
    const VdoResizeBox = new VideoResizeBox(Resprops);
  });

  it('should hideCursorPlaceholder', () => {

    const state: EditorState = EditorState.create({
      schema: schema,
      selection: editor.selection,
      plugins: [new CursorPlaceholderPlugin()],
    });
    const trans = hideCursorPlaceholder(state);
    resetInstance()
    const tr2 = hideCursorPlaceholder(state);
  });

  it('should plugin apply', () => {

    const state: EditorState = EditorState.create({
      schema: schema,
      selection: editor.selection,
      plugins: [new CursorPlaceholderPlugin()],
    });
    const tr = state.tr.setMeta(state.plugins[0], {
      add: {
        pos: 0,
      },
    });
    const s = state.apply(tr);
    s.applyTransaction(s.tr);

    const tr1 = state.tr.setMeta(state.plugins[0], {
      remove: {
        pos: 0,
      },
    });
    const s1 = state.apply(tr1);
    s1.applyTransaction(s1.tr);

  });

  it('should call  specFinder', () => {

    const state: EditorState = EditorState.create({
      schema: schema,
      selection: editor.selection,
      plugins: [new CursorPlaceholderPlugin()],
    });
    const tr = specFinder(state.schema)


  });
});

describe('Video Plugin - non-satisfying condition', () => {

  const plugin = new MultimediaPlugin();
  const editor = createEditor(doc(p('<cursor>')), {
    plugins: [plugin],
  });


  const schema = plugin.getEffectiveSchema(editor.schema);
  const state: EditorState = EditorState.create({
    schema: schema,
    selection: undefined,
    plugins: [],
  });

  it('should showCursorPlaceholder-else', () => {
    resetInstance()
    const trans = showCursorPlaceholder(state);
  });
})
