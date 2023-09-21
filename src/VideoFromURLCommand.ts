import * as React from 'react';

import { VideoSourceCommand } from './VideoSourceCommand';
import {VideoEditor} from './ui/VideoEditor';

export class VideoFromURLCommand extends VideoSourceCommand {
  getEditor(): typeof React.Component {
    return VideoEditor;
  }
}

