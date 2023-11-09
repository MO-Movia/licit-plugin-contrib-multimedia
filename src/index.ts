// Plugin to handle Citation.
import {Plugin, PluginKey} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {Node, Schema} from 'prosemirror-model';
import AVNodeView from './ui/audio-video/AVNodeView';
import {VIDEO} from './Constants';
import AVNodeSpec from './audio-video/AVNodeSpec';
import AVFromURLCommand from './audio-video/AVFromURLCommand';
import {EditorFocused} from './ui/CustomNodeView';
import AVUploadCommand from './audio-video/AVUploadCommand';
import ImageFromURLCommand from './image/ImageFromURLCommand';

import ImageUploadCommand from './image/ImageUploadCommand';
import ImageNodeView from './ui/image/ImageNodeView';
import ImageNodeSpec from './image/ImageNodeSpec';
const IMAGE = 'image';

// [FS] IRAD-1503 2021-07-02
// Fix: Update the private plugin classes as a named export rather than the default
export class MultimediaPlugin extends Plugin {
  _view: EditorView = null;
  constructor() {
    super({
      key: new PluginKey('MultimediaPlugin'),
      state: {
        init(_config, _state) {
          (this as MultimediaPlugin).spec.props.nodeViews[VIDEO] =
            bindVideoView.bind(this);
          (this as MultimediaPlugin).spec.props.nodeViews[IMAGE] =
            bindImageView.bind(this);
        },
        apply(_tr, _set) {
          //do nothing
        },
      },
      props: {
        nodeViews: {},
      },
    });
  }

  getEffectiveSchema(schema: Schema): Schema {
    const nodes = schema.spec.nodes.append({
      video: AVNodeSpec,
      image: ImageNodeSpec,
    });
    const marks = schema.spec.marks;

    return new Schema({
      nodes: nodes,
      marks: marks,
    });
  }

  initButtonCommands() {
    return {
      '[mms] Insert MultiMedia': [
        {
          'Insert image by URL': new ImageFromURLCommand(),
          'Upload image from computer': new ImageUploadCommand(),
          'Insert video by URL': new AVFromURLCommand(false),
          'Upload video from computer': new AVUploadCommand(false),
          'Insert audio by URL': new AVFromURLCommand(true),
          'Upload audio from computer': new AVUploadCommand(true),
        },
      ],
    };
  }
}

export function bindVideoView(
  node: Node,
  view: EditorView,
  curPos: boolean | (() => number)
): VideoViewExt {
  return new VideoViewExt(node, view, curPos);
}

class VideoViewExt extends AVNodeView {
  constructor(node: Node, view: EditorView, getCurPos) {
    super(node, view as EditorFocused, getCurPos, null);
  }
}

export function bindImageView(
  node: Node,
  view: EditorView,
  curPos: boolean | (() => number)
): ImageViewExt {
  return new ImageViewExt(node, view, curPos);
}

class ImageViewExt extends ImageNodeView {
  constructor(node: Node, view: EditorView, getCurPos) {
    super(node, view as EditorFocused, getCurPos, null);
  }
}
