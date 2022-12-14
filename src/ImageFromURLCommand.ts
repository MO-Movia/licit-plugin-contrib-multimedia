

import * as React from 'react';

import ImageSourceCommand from './ImageSourceCommand';
import ImageURLEditor from './ui/ImageURLEditor';

class ImageFromURLCommand extends ImageSourceCommand {
  getEditor(): typeof React.Component {
    return ImageURLEditor;
  }
}

export default ImageFromURLCommand;
