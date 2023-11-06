import * as React from 'react';

import VideoSourceCommand from './VideoSourceCommand';
import VideoEditor from './ui/VideoEditor';

class VideoFromURLCommand extends VideoSourceCommand {
  getEditor(): typeof React.Component {
    return VideoEditor;
  }

  isAudio(): boolean {
    return false;
  }
}

export default VideoFromURLCommand;
