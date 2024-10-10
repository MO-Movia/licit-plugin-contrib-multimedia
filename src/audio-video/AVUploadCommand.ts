import {EditorState} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import * as React from 'react';

import AVSourceCommand from './AVSourceCommand';
import AVUploadEditor from '../ui/audio-video/AVUploadEditor';
import type {EditorAudioRuntime, EditorVideoRuntime} from '../Types';

class AVUploadCommand extends AVSourceCommand {
  runtime: EditorVideoRuntime | EditorAudioRuntime;
  isForAudio: boolean;

  constructor(isForAudio: boolean) {
    super();
    this.isForAudio = isForAudio;
  }

  isEnabled = (state: EditorState, view?: EditorView): boolean => {
    // if (!view) {
    //   return false;
    // }

    // this.runtime = view['runtime'];
    // if (!this.runtime) {
    //   return false;
    // }
return true;
    // if (this.isForAudio) {
    //   const {canUploadAudio, uploadAudio} = this.runtime as EditorAudioRuntime;
    //   if (!canUploadAudio || !uploadAudio) {
    //     return false;
    //   }
    //   if (!canUploadAudio()) {
    //     return false;
    //   }
    // } else {
    //   const {canUploadVideo, uploadVideo} = this.runtime as EditorVideoRuntime;
    //   if (!canUploadVideo || !uploadVideo) {
    //     return false;
    //   }
    //   if (!canUploadVideo()) {
    //     return false;
    //   }
    // }

    return this.__isEnabled(state, view);
  };

  getEditor(): typeof React.Component {
    return AVUploadEditor;
  }

  isAudio(): boolean {
    return this.isForAudio;
  }
}
export default AVUploadCommand;
