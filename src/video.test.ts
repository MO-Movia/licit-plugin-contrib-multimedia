import {createEditor, doc, p, tr} from 'jest-prosemirror';
import {
  EditorState,
  PluginKey,
  TextSelection,
  Transaction,
} from 'prosemirror-state';
import {Transform} from 'prosemirror-transform';
import {VideoPlugin} from './index';
import {VideoEditorState} from './ui/VideoEditor';
import {VideoEditorProps} from './ui/VideoEditor';
import VideoSourceCommand, {insertIFrame} from './VideoSourceCommand';
import * as VdoResizBox from './ui/VideoResizeBox';
import {render, screen, fireEvent, createEvent} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {shallow} from 'enzyme';
import {ChangeEvent} from 'react';
import {
  showCursorPlaceholder,
  hideCursorPlaceholder,
} from './CursorPlaceholderPlugin';
import * as CrsrPlcHldrPlugin from './CursorPlaceholderPlugin';
import renderer from 'react-test-renderer';
import VideoEditor from './ui/VideoEditor';
import resolveVideo from './ui/resolveVideo';
import axios from 'axios';
import {of, throwError} from 'rxjs';
import VideoResizeBox from './ui/VideoResizeBox';
import {VideoViewBody} from './ui/VideoNodeView';
import CursorPlaceholderPlugin from './CursorPlaceholderPlugin';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
const srcevent = {
  target: {value: 'https://www.youtube.com/embed/ru60J99ojJw'},
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
    headers: {Accept: 'application/json, text/plain, */*'},
    method: 'get',
    url: 'https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=ru60J99ojJw&format=json',
  },
  request: {},
};

describe('Video Plugin - Test', () => {
  const plugin = new VideoPlugin();
  const editor = createEditor(doc(p('<cursor>')), {
    plugins: [plugin],
  });

  const schema = plugin.getEffectiveSchema(editor.schema);
  const state: EditorState = EditorState.create({
    schema: schema,
    selection: editor.selection,
    plugins: [new VideoPlugin()],
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
    close: (val?) => {},
  };

  const newState = state.apply(
    insertIFrame(state.tr, schema, veState) as Transaction
  );

  const VideoeditorIns = new VideoEditor(properties, newState);

  new VideoSourceCommand().executeWithUserInput(
    state,
    editor.view.dispatch as (tr: Transform) => void,
    editor.view,
    veState
  );

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
      target: {width: 113},
    } as React.ChangeEvent<HTMLInputElement>;
    const res =await VideoeditorIns._onWidthChange(event);
    expect(res).toBeCalled;
  });

  it('should change on Height Change Event ', async () => {
    const event = {
      target: {height: 200},
    } as React.ChangeEvent<HTMLInputElement>;

    const res =await VideoeditorIns._onHeightChange(event);
    expect(res).toBeCalled;
  });

  xit('should showCursorPlaceholder', () => {
     const crsrPlg=new CursorPlaceholderPlugin();
    const trans = showCursorPlaceholder(state);
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

  it('should change on Resize', async () => {
    const ResizeProp = {
      height: 200,
      onResizeEnd: (w: 200, height: 425) => {},
      src: '',
      width: 113,
    };

    const VdoViewBody = new VideoViewBody(ResizeProp);

  });
  //   it('should wait For User Input - Video', () => {
  //     const tr = editor.view.state.tr as Transform;
  //     const mock = jest.spyOn(CrsrPlugin, 'showCursorPlaceholder');
  //     mock.mockReturnValue(tr);
  //      const VideoSrcCmd = new VideoSourceCommand();
  //      VideoSrcCmd.waitForUserInput(state,
  //       editor.view.dispatch as (tr: Transform) => void,
  //       editor.view);

  // });
  //   it('should get Attrs VideoNodeSpec ', () => {
  //     const VdoNodeSpec = require("./VideoNodeSpec");
  //     const vdo = document.createElement('video');
  //     VdoNodeSpec.getAttrs(vdo);

  // });

  it('Video Resize Box ', () => {
   const Resprops = {
      height: 200,
      onResizeEnd: (w: 200, height: 100) => {},
      src: 'https://www.youtube.com/embed/ru60J99ojJw',
      width: 400
  };
  const VdoResizeBox = new VideoResizeBox(Resprops);
});
});

