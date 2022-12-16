import * as React from 'react';

import VideoSourceCommand from './VideoSourceCommand';
import VideoEditor from './ui/VideoEditor';

class VideoFromURLCommand extends VideoSourceCommand {
  getEditor(): typeof React.Component {
    return VideoEditor;
  }
}

export default VideoFromURLCommand;
