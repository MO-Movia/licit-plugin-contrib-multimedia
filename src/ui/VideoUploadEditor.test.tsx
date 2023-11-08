

import Enzyme from 'enzyme';
import Adapter from '@cfaester/enzyme-adapter-react-18';
import React from 'react';
import VideoUploadEditor from './VideoUploadEditor';

Enzyme.configure({ adapter: new Adapter() });

const VideoUploadEditorProps = {
  runtime: { // Video Proxy
    canProxyVideoSrc: (_src: string) => true,
    getProxyVideoSrc: (_src: string) => 'http://video.mp4',
    getVideoSrc: jest.fn().mockReturnValue(Promise.resolve('http://video.mp4')),

    // Video Upload
    canUploadVideo: () => true,
    uploadVideo: jest.fn().mockResolvedValue({
      height: 200,
      id: 'Test-1',
      src: '',
      width: 150,
      isAudio: false
    }),
  },
  close: () => undefined,
  isAudio: false
};
const VideoUploadEdrProps = {
  runtime: { // Video Proxy
    canProxyVideoSrc: (_src: string) => false,
    getProxyVideoSrc: (_src: string) => 'http://video.mp4',
    getVideoSrc: jest.fn().mockReturnValue(Promise.resolve('http://video.mp4')),

    // Video Upload
    canUploadVideo: () => false,
    uploadVideo: jest.fn().mockResolvedValue({

    }),
  },
  close: () => undefined,
  isAudio: false
};
const testCases = [VideoUploadEditorProps, VideoUploadEdrProps];
describe('Video Upload Editor', () => {



  testCases.forEach(testProps => {
    it('should render Video Upload Editor', () => {

      const wrapper = Enzyme.shallow(<VideoUploadEditor {...testProps} />);
      const file = new File([''], 'test.mp4', { type: 'video/mp4' });

      wrapper.find('input').simulate('change', { target: { files: [file] } });
    });
  });

});
describe('Video Upload Editor', () => {
  const VideoUploadEditorProps = {
    runtime: { // Video Proxy
      canProxyVideoSrc: (_src: string) => true,
      getProxyVideoSrc: (_src: string) => 'http://video.mp4',
      getVideoSrc: jest.fn().mockReturnValue(Promise.resolve('http://video.mp4')),

      // Video Upload
      canUploadVideo: () => true,
      uploadVideo: jest.fn().mockResolvedValue({
        height: 200,
        id: 'Test-1',
        src: '',
        width: 150,
      }),
    },
    close: () => undefined
  };

  const videouploadeditor = new VideoUploadEditor(VideoUploadEditorProps);

  it('should render Video Upload Editor', () => {

    expect(videouploadeditor).toBeDefined();
    expect(() => videouploadeditor._cancel()).not.toThrow();

  });
  it('should handle componentWillUnmount', () => {
    videouploadeditor.componentWillUnmount();
    expect(videouploadeditor._unmounted).toBeTruthy();

  });
  it('should handle _onSuccess ', () => {
    videouploadeditor._unmounted = true;
    expect(videouploadeditor._onSuccess({
      height: 10,
      id: '',
      src: '',
      width: 10,
      isAudio: false
    })).toBeUndefined();

  });
  it('should handle _onError  ', () => {
    videouploadeditor._unmounted = true;
    expect(videouploadeditor._onError({
      name: '',
      message: '',
      stack: ''
    }
    )).toBeUndefined();

  });

  it('should handle _upload ', async () => {
    videouploadeditor.props = {
      close: () => undefined,
      isAudio: false
    };

    const file = new File([], 'test.mp4');
    const instance = await videouploadeditor._upload(file);


    expect(instance).toBeUndefined();

  });
  it('should handle _upload ', async () => {
    videouploadeditor.props = {
      runtime: { // Video Proxy
        canProxyVideoSrc: (_src: string) => true,
        getProxyVideoSrc: (_src: string) => 'http://video.mp4',
        getVideoSrc: jest.fn().mockReturnValue(Promise.resolve('http://video.mp4')),

        // Video Upload
        canUploadVideo: () => true,
        uploadVideo: jest.fn().mockResolvedValue({
          height: 0,
          id: 'Test-1',
          src: '',
          width: 0,
        }),
      },
      close: () => undefined,
      isAudio: false
    };

    const file = new File([], 'test.mp4');
    const instance = await videouploadeditor._upload(file);


    expect(instance).toBeUndefined();

  });
});

