import * as React from 'react';

import VideoSourceCommand from '../VideoSourceCommand';
import VideoEditor from './VideoEditor';

class AudioFromURLCommand extends VideoSourceCommand {
  getEditor(): typeof React.Component {
    return VideoEditor;
  }
  isAudio(): boolean {
    return true;
  }
}

export default AudioFromURLCommand;
