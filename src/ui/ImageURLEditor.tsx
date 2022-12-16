

import * as React from 'react';
import PropTypes from 'prop-types';

import { CustomButton } from '@modusoperandi/licit-ui-commands';
import { preventEventDefault } from '@modusoperandi/licit-ui-commands';
import resolveImage from './resolveImage';

import './czi-form.css';
import './czi-video-url-editor.css';

export type ImageEditorProps = {
  initialValue;
  close: (val?) => void;
};
export type ImageEditorState = {
  id: string;
  src: string;
  width: number;
  height: number;
  validValue: Record<string, unknown>;
};

class ImageURLEditor extends React.PureComponent<ImageEditorProps, ImageEditorState> {
  _img = null;
  _unmounted = false;

  // [FS] IRAD-1005 2020-07-07
  // Upgrade outdated packages.
  // To take care of the property type declaration.
  static propsTypes = {
    initialValue: PropTypes.object,
    close: function (props, propName: string) {
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
  };

  componentWillUnmount(): void {
    this._unmounted = true;
  }

  render(): React.ReactElement {
    const { src, validValue } = this.state;
    const preview = validValue ? (
      <div
        className="molm-czi-image-url-editor-input-preview"
        style={{ backgroundImage: `url(${String(validValue.src)}` }}
      />
    ) : null;

    return (
      <div className="molm-czi-image-url-editor">
        <form className="molm-czi-form" onSubmit={preventEventDefault}>
          <fieldset>
            <legend>Insert Image</legend>
            <div className="molm-czi-image-url-editor-src-input-row">
              <input
                autoFocus={true}
                className="molm-czi-image-url-editor-src-input"
                onChange={this._onSrcChange}
                placeholder="Paste URL of Image..."
                type="text"
                value={src || ''}
              />
              {preview}
            </div>
            <em>
              Only select image that you have confirmed the license to use
            </em>
          </fieldset>
          <div className="molm-czi-form-buttons">
            <CustomButton label="Cancel" onClick={this._cancel} />
            <CustomButton
              active={!!validValue}
              disabled={!validValue}
              label="Insert"
              onClick={this._insert}
            />
          </div>
        </form>
      </div>
    );
  }


  _onSrcChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const src = (e.target as HTMLInputElement).value;
    this.setState(
      {
        src,
        validValue: null,
      },
      this._didSrcChange
    );
  };


  _didSrcChange = (): void => {
    resolveImage(this.state.src).then((result) => {
      if (this.state.src === result.src && !this._unmounted) {
        const validValue = result.complete ? result : null;
        this.setState({ validValue });
      }
    });
  };

  _cancel = (): void => {
    this.props.close();
  };

  _insert = (): void => {
    const { validValue } = this.state;
    this.props.close(validValue);
  };
}

export default ImageURLEditor;
