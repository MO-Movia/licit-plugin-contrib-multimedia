import * as React from 'react';
import {EditorAudioRuntime} from '../Types';
// re-use this command for audio too
import VideoSourceCommand from '../VideoSourceCommand';
import {EditorState} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import VideoUploadEditor from './VideoUploadEditor';

class AudioUploadCommand extends VideoSourceCommand {
  runtime: EditorAudioRuntime;
  isEnabled = (state: EditorState, view?: EditorView): boolean => {
    if (!view) {
      return false;
    }

    this.runtime = view['runtime'];
    if (!this.runtime) {
      return false;
    }

    const {canUploadAudio, uploadAudio} = this.runtime;
    if (!canUploadAudio || !uploadAudio) {
      return false;
    }
    if (!canUploadAudio()) {
      return false;
    }

    return this.__isEnabled(state, view);
  };

  getEditor(): typeof React.Component {
    return VideoUploadEditor;
  }

  isAudio(): boolean {
    return true;
  }
}

export default AudioUploadCommand;
