

import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import * as React from 'react';

import ImageSourceCommand from './ImageSourceCommand';
import { EditorRuntime } from './Types';
import ImageUploadEditor from './ui/ImageUploadEditor';

class ImageUploadCommand extends ImageSourceCommand {
  runtime: EditorRuntime;
  isEnabled = (state: EditorState, view: EditorView): boolean => {
    if (!view) {
      return false;
    }

    this.runtime = view['runtime'];
    if (!this.runtime) {
      return false;
    }

    const { canUploadImage, uploadImage } = this.runtime;
    if (!canUploadImage || !uploadImage) {
      return false;
    }
    if (!canUploadImage()) {
      return false;
    }

    return this.__isEnabled(state, view);
  };

  getEditor(): typeof React.Component {
    return ImageUploadEditor;
  }
}
export default ImageUploadCommand;
