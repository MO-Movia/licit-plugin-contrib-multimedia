// Plugin to handle Citation.
import {Plugin, PluginKey} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {Node, Schema} from 'prosemirror-model';
import {VideoNodeView} from './ui/VideoNodeView';
import {VIDEO} from './Constants';
import {VideoNodeSpec} from './VideoNodeSpec';
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
          (this as MultimediaPlugin).spec.props.nodeViews[VIDEO] =
            bindVideoView.bind(this);
          (this as MultimediaPlugin).spec.props.nodeViews[IMAGE] =
            bindImageView.bind(this);
        },
        apply(_tr, _state) {
          return _state;
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
          'Upload image from computer': new ImageUploadCommand(),
        },
      ],
    };
  }
}

export function bindVideoView(
  node: Node,
  view: EditorView,
  curPos: () => number
): VideoNodeView {
  return new VideoNodeView(node, view as EditorFocused, curPos, null);
}

export function bindImageView(
  node: Node,
  view: EditorView,
  curPos: () => number
): ImageNodeView {
  return new ImageNodeView(node, view as EditorFocused, curPos, null);
}
