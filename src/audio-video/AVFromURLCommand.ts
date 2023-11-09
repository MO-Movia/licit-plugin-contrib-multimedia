import * as React from 'react';

import AVSourceCommand from './AVSourceCommand';
import AVEditor from '../ui/audio-video/AVEditor';

class AVFromURLCommand extends AVSourceCommand {
  isForAudio: boolean;
  constructor(isForAudio: boolean ) {
    super();
    this.isForAudio = isForAudio;
  }

  getEditor(): typeof React.Component {
    return AVEditor;
  }

  isAudio(): boolean {
    return this.isForAudio;
  }
}

export default AVFromURLCommand;
