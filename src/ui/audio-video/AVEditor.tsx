import * as React from 'react';
import {
  preventEventDefault,
  CustomButton,
} from '@modusoperandi/licit-ui-commands';

import '../czi-form.css';
import '../czi-video-url-editor.css';
import axios from 'axios';

export type AVEditorProps = {
  initialValue;
  close: (val?) => void;
  isAudio: boolean;
};
export type AVEditorState = {
  id: string;
  src: string;
  width: number;
  height: number;
  validValue: boolean;
  isAudio: boolean;
};

class AVEditor extends React.PureComponent<
  AVEditorProps,
  AVEditorState
> {
  state: AVEditorState = {
    ...(this.props.initialValue || {}),
    validValue: null,
    src: (this.props.isAudio ? '' : 'https://www.youtube.com/embed/'),
  };

  render(): React.ReactNode {
    const { src, width, height } = this.state;
    const placeholdertext =
      'Paste URL of ' + (this.props.isAudio ? 'Audio' : 'Video') + '...';
    const headertext =
      'Insert ' + (this.props.isAudio ? 'Audio' : 'Video') + '...';
    return (
      <div className="molm-czi-image-url-editor">
        <form className="molm-czi-form" onSubmit={preventEventDefault}>
          <fieldset>
            <legend>
              <b>{headertext}</b>
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
                placeholder={placeholdertext}
                type="text"
                value={src || ''}
              />
            </div>
          </fieldset>
          {!this.props.isAudio ? (<fieldset>
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
          </fieldset>) : null}
          {!this.props.isAudio ? (<fieldset>
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
          </fieldset>) : null}
          <div className="molm-czi-form-buttons">
            <CustomButton className="cancelbtn" label="Cancel" onClick={this._cancel} />
            <CustomButton
              active={true}
              className="insertbtn"
              disabled={false}
              label="Insert"
              onClick={this._insert}
            />
          </div>
        </form>
      </div>
    );
  }
  getsrc(e: React.ChangeEvent<HTMLInputElement>) {
    return e.target.value;
  }

  _onSrcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const src = this.getsrc(e);
    const yId = this.props.isAudio ? '' : this._getYouTubeId(src);
    const url = this.props.isAudio ? src : `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${yId}&format=json`;
    let width = this.props.isAudio ? 275: 300;
    let height = this.props.isAudio ? 50: 200;
    const setValues = this._setStateValues;

    axios
      .get(url)
      .then((response) => {
        height = response.data.height;
        width = response.data.width;
        setValues(src, width, height, true, this.props.isAudio);
      })
      .catch((_rejected) => {
        setValues(src, width, height, true, this.props.isAudio);
      });
  };

  _setStateValues = (
    src: string,
    width: number,
    height: number,
    validValue: boolean,
    isAudio: boolean
  ) => {
    (this as AVEditor).setState({ src, width, height, validValue, isAudio });
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

export default AVEditor;
