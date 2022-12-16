// Plugin to handle Citation.
import {Plugin, PluginKey} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {Node, Schema} from 'prosemirror-model';
import VideoNodeView from './ui/VideoNodeView';
import {VIDEO} from './Constants';
import VideoNodeSpec from './VideoNodeSpec';
import OrderedMap from 'orderedmap';
import VideoFromURLCommand from './VideoFromURLCommand';
import {EditorFocused} from './ui/CustomNodeView';
import VideoUploadCommand from './VideoUploadCommand';
import ImageFromURLCommand from './ImageFromURLCommand';

import ImageUploadCommand from './ImageUploadCommand';
import ImageNodeView from './ui/ImageNodeView';
import ImageNodeSpec from './ImageNodeSpec';
const IMAGE = 'image';
// singleton instance of CitationPlugin
let siVideoPlugin: MultimediaPlugin;

// [FS] IRAD-1503 2021-07-02
// Fix: Update the private plugin classes as a named export rather than the default
export class MultimediaPlugin extends Plugin {
  _view: EditorView = null;
  constructor() {
    super({
      key: new PluginKey('MultimediaPlugin'),
      state: {
        init(_config, _state) {
          siVideoPlugin.spec.props.nodeViews[VIDEO] = bindVideoView.bind(this);
          siVideoPlugin.spec.props.nodeViews[IMAGE] = bindImageView.bind(this);
        },
        apply(_tr, _set) {
          //do nothing
        },
      },
      props: {
        nodeViews: {},
      },
    });
    if (siVideoPlugin) {
      return siVideoPlugin;
    }
    siVideoPlugin = this as MultimediaPlugin;
  }

  getEffectiveSchema(schema: Schema): Schema {
    const nodes = (schema.spec.nodes as OrderedMap).append({
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
      '[video_label] Insert Video': [
        {
          'Insert Video by URL': new VideoFromURLCommand(),
          'Upload video from computer': new VideoUploadCommand(),
        },
      ],
      '[image] Insert image': [
        {
          'Insert image by URL': new ImageFromURLCommand(),
          'Upload image from computer': new ImageUploadCommand(),
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

class VideoViewExt extends VideoNodeView {
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
