import cx from 'classnames';
import * as React from 'react';

import {
  CustomButton,
  preventEventDefault,
} from '@modusoperandi/licit-ui-commands';
import {LoadingIndicator} from '../LoadingIndicator';
import {v1 as uuid} from 'uuid';

import '../czi-form.css';
import '../czi-video-upload-editor.css';

import type {EditorVideoRuntime, EditorAudioRuntime, AVProps} from '../../Types';

class AVUploadEditor extends React.PureComponent {
  _unmounted = false;

  declare props: {
    runtime?: EditorVideoRuntime | EditorAudioRuntime;
    close: (val?: AVProps) => void;
    isAudio: boolean;
  };

  state = {
    error: null,
    id: uuid(),
    pending: false,
  };

  componentWillUnmount(): void {
    this._unmounted = true;
  }

  render(): React.ReactElement {
    const {id, error, pending} = this.state;
    const className = cx('molm-czi-image-upload-editor', {pending, error});
    let label: string | React.ReactElement =
      'Choose an ' + (this.props.isAudio ? 'audio' : 'video') + ' file...';
    const fileFormat = this.props.isAudio
      ? 'audio/mp3, audio/wav, audio/ogg, audio/aac'
      : 'video/mp4, video/webm, video/ogg';
    if (pending) {
      label = <LoadingIndicator />;
    } else if (error) {
      label = 'Something went wrong, please try again';
    }

    return (
      <div className={className}>
        <form className="molm-czi-form" onSubmit={preventEventDefault}>
          <fieldset>
            <legend>Upload Video</legend>
            <div className="molm-czi-image-upload-editor-body">
              <div className="molm-czi-image-upload-editor-label">{label}</div>
              <input
                accept={fileFormat}
                className="molm-czi-image-upload-editor-input"
                disabled={pending}
                id={id}
                key={id}
                onChange={this._onSelectFile}
                type="file"
              />
            </div>
          </fieldset>
          <div className="molm-czi-form-buttons">
            <CustomButton label="Cancel" onClick={this._cancel} />
          </div>
        </form>
      </div>
    );
  }

  _onSelectFile = (event: React.SyntheticEvent<HTMLInputElement>): void => {
    const file =
      (event.target as HTMLInputElement).files &&
      0 < (event.target as HTMLInputElement).files.length &&
      (event.target as HTMLInputElement).files[0];
    if (file) {
      this._upload(file);
    }
  };

  _onSuccess = (video: AVProps): void => {
    if (this._unmounted) {
      return;
    }
    video.isAudio = this.props.isAudio;
    this.props.close(video);
  };

  _onError = (error: Error): void => {
    if (this._unmounted) {
      return;
    }
    this.setState({
      error,
      id: uuid(),
      pending: false,
    });
  };

  _upload = async (file: File): Promise<void> => {
    try {
      const runtime = this.props.runtime || {};

      this.setState({pending: true, error: null});
      let image: AVProps;
      if (this.props.isAudio) {
        const {canUploadAudio, uploadAudio} = runtime as EditorAudioRuntime;
        if (!canUploadAudio || !uploadAudio || !canUploadAudio()) {
          throw new Error('feature is not available');
        }
        image = await uploadAudio(file);
      } else {
        const {canUploadVideo, uploadVideo} = runtime as EditorVideoRuntime;
        if (!canUploadVideo || !uploadVideo || !canUploadVideo()) {
          throw new Error('feature is not available');
        }
        image = await uploadVideo(file);
      }

      if (image) {
        if (0 == image.height) {
          image.height = 100;
        }
        if (0 == image.width) {
          image.width = 100;
        }
      }
      this._onSuccess(image);
    } catch (ex) {
      this._onError(ex);
    }
  };

  _cancel = (): void => {
    this.props.close();
  };
}

export default AVUploadEditor;
