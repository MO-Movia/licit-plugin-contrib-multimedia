// Plugin to handle Citation.
import {Plugin, PluginKey} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {Node, Schema} from 'prosemirror-model';
import { VideoNodeView } from './ui/VideoNodeView';
import {VIDEO} from './Constants';
import { VideoNodeSpec } from './VideoNodeSpec';
import {EditorFocused} from './ui/CustomNodeView';
import {ImageUploadCommand} from './ImageUploadCommand';
import {ImageNodeView} from './ui/ImageNodeView';
import {ImageNodeSpec} from './ImageNodeSpec';
const IMAGE = 'image';

export class MultimediaPlugin extends Plugin {
  _view: EditorView = null;
  constructor() {
    super({
      key: new PluginKey('MultimediaPlugin'),
      state: {
        init(_config, _state) {
          (this as MultimediaPlugin).spec.props.nodeViews[VIDEO] = bindVideoView.bind(this);
          (this as MultimediaPlugin).spec.props.nodeViews[IMAGE] = bindImageView.bind(this);
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
      video: VideoNodeSpec,
      image: ImageNodeSpec
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
          'Upload image from computer': new ImageUploadCommand()
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

export class VideoViewExt extends VideoNodeView {
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
