import * as React from 'react';
import PropTypes from 'prop-types';
import {
  preventEventDefault,
  CustomButton,
} from '@modusoperandi/licit-ui-commands';

import './czi-form.css';
import './czi-video-url-editor.css';
import axios from 'axios';

export type VideoEditorProps = {
  initialValue;
  close: (val?) => void;
};
export type VideoEditorState = {
  id: string;
  src: string;
  width: number;
  height: number;
  validValue: boolean;
};

class VideoEditor extends React.PureComponent<
  VideoEditorProps,
  VideoEditorState
> {
  _img = null;
  _unmounted = false;

  // [FS] IRAD-1005 2020-07-07
  // Upgrade outdated packages.
  // To take care of the property type declaration.
  static propsTypes = {
    initialValue: PropTypes.object,
    close: function (props: VideoEditorProps, propName: string): Error {
      const fn = props[propName];
      if (
        !fn.prototype ||
        (typeof fn.prototype.constructor !== 'function' &&
          fn.prototype.constructor.length !== 1)
      ) {
        return new Error(
          propName + 'must be a function with 1 arg of type ImageLike'
        );
      }
      return null;
    },
  };

  state = {
    ...(this.props.initialValue || {}),
    validValue: null,
    src: 'https://www.youtube.com/embed/',
  };

  componentWillUnmount(): void {
    this._unmounted = true;
  }

  render(): React.ReactNode {
    const {src, width, height} = this.state;

    return (
      <div className="molm-czi-image-url-editor">
        <form className="molm-czi-form" onSubmit={preventEventDefault}>
          <fieldset>
            <legend>
              <b>Insert Video</b>
            </legend>
            <div className="molm-czi-image-url-editor-src-input-row"></div>
          </fieldset>
          <fieldset>
            <legend>Source</legend>
            <div className="molm-czi-image-url-editor-src-input-row">
              <input
                autoFocus={true}
                className="molm-czi-image-url-editor-src-input"
                onChange={this._onSrcChange}
                placeholder="Paste URL of Video..."
                type="text"
                value={src || ''}
              />
            </div>
          </fieldset>
          <fieldset>
            <legend>Width</legend>
            <div className="molm-czi-image-url-editor-src-input-row">
              <input
                className="molm-czi-image-url-editor-src-input"
                onChange={this._onWidthChange}
                placeholder="Width"
                type="text"
                value={width || ''}
              />
            </div>
          </fieldset>
          <fieldset>
            <legend>Height</legend>
            <div className="molm-czi-image-url-editor-src-input-row">
              <input
                className="molm-czi-image-url-editor-src-input"
                onChange={this._onHeightChange}
                placeholder="Height"
                type="text"
                value={height || ''}
              />
            </div>
          </fieldset>
          <div className="molm-czi-form-buttons">
            <CustomButton label="Cancel" onClick={this._cancel} />
            <CustomButton
              active={true}
              disabled={false}
              label="Insert"
              onClick={this._insert}
            />
          </div>
        </form>
      </div>
    );
  }
  getsrc(e:React.ChangeEvent<HTMLInputElement>){
   return  e.target.value;
  }

 _onSrcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const src = this.getsrc(e);
    const yId = this._getYouTubeId(src);
    const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${yId}&format=json`;
    let width = 300;
    let height = 200;
    const self: VideoEditor = this as VideoEditor;

    axios
      .get(url)
      .then(
        (response) => {
          height = response.data.height;
          width = response.data.width;
          self._setStateValues(src, width, height, true);
        },
        (_error) => {
          self._setStateValues(src, width, height, true);
        }
      )
      .catch((_rejected) => {
        self._setStateValues(src, width, height, true);
      });
  };

  _setStateValues = (
    src: string,
    width: number,
    height: number,
    validValue: boolean
  ) => {
    (this as VideoEditor).setState({src, width, height, validValue});
  };

  _getYouTubeId = (url: string) => {
    const arr = url.split(/(vi\/|v%3D|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    return undefined !== arr[2] ? arr[2].split(/[^\w-]/i)[0] : arr[0];
  };

  _onWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const width = parseInt(e.target.value);
    this.setState({
      width,
      validValue: true,
    });
  };

  _onHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const height = parseInt(e.target.value);
    this.setState({
      height,
      validValue: true,
    });
  };

  _cancel = (): void => {
    this.props.close();
  };

  _insert = (): void => {
    this.props.close(this.state);
  };
}

export default VideoEditor;
