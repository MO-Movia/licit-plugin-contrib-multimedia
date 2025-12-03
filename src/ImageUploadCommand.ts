import {EditorState} from 'prosemirror-state';
import React from 'react';

import {ImageSourceCommand} from './ImageSourceCommand';
import {ImageUploadEditor} from './ui/ImageUploadEditor';
import {Transform} from 'prosemirror-transform';

export class ImageUploadCommand extends ImageSourceCommand {
  isEnabled = (state: EditorState): boolean => {
       return this.__isEnabled(state);
  };

  getEditor(): typeof React.Component {
    return ImageUploadEditor;
  }

  executeCustomStyleForTable(
    _state: EditorState,
    tr: Transform,
  ): Transform {
    return tr;
  }
}
