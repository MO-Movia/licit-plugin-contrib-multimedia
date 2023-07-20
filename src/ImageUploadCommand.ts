

import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import * as React from 'react';

import ImageSourceCommand from './ImageSourceCommand';
import { EditorRuntime } from './Types';
import ImageUploadEditor from './ui/ImageUploadEditor';

class ImageUploadCommand extends ImageSourceCommand {
  isEnabled = (state: EditorState, view: EditorView | null): boolean => {
    if (!view) {
      return false;
    }

    const runtime: EditorRuntime = view['runtime'];
    if (!runtime) {
      return false;
    }

    const { canUploadImage, uploadImage } = runtime;
    if (!uploadImage || !canUploadImage?.()) {
      return false;
    }

    return this.__isEnabled(state, view);
  };

  getEditor(): typeof React.Component {
    return ImageUploadEditor;
  }
}
export default ImageUploadCommand;
