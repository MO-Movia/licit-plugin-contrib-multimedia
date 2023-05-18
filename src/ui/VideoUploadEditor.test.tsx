

import Enzyme, { shallow } from 'enzyme';
import Adapter from '@cfaester/enzyme-adapter-react-18';
import React from 'react';
import VideoUploadEditor from './VideoUploadEditor';

Enzyme.configure({ adapter: new Adapter() });

const VideoUploadEditorProps = {
  runtime: { // Video Proxy
    canProxyVideoSrc: (src: string) => true,
    getProxyVideoSrc: (src: string) => "http://video.mp4",
    getVideoSrc: jest.fn().mockReturnValue(Promise.resolve("http://video.mp4")),

    // Video Upload
    canUploadVideo: () => true,
    uploadVideo: jest.fn().mockResolvedValue({
      height: 200,
      id: "Test-1",
      src: "",
      width: 150,
    }),
  },
  close: () => { }
};
const VideoUploadEdrProps = {
  runtime: { // Video Proxy
    canProxyVideoSrc: (src: string) => false,
    getProxyVideoSrc: (src: string) => "http://video.mp4",
    getVideoSrc: jest.fn().mockReturnValue(Promise.resolve("http://video.mp4")),

    // Video Upload
    canUploadVideo: () => false,
    uploadVideo: jest.fn().mockResolvedValue({
      
    }),
  },
  close: () => { }
};
const testCases=[VideoUploadEditorProps,VideoUploadEdrProps]
describe('Video Upload Editor', () => {



  testCases.forEach(testProps => {
    it('should render Video Upload Editor', () => {

      const wrapper = Enzyme.shallow(<VideoUploadEditor {...testProps} />);
      const file = new File([''], 'test.mp4', { type: 'video/mp4' });
      // // create a mock FormData object and append the video file
      // const formData = new FormData();
      // formData.append('video', file);
  
      // // mock the XHR API
      // const xhrMock = {
      //   open: jest.fn(),
      //   send: jest.fn(),
      //   setRequestHeader: jest.fn(),
      //   readyState: 4,
      //   status: 200,
      //   response: JSON.stringify({ success: true })
      // };
      // window.XMLHttpRequest = jest.fn(() => xhrMock);
    
    
      wrapper.find('input').simulate('change', { target: { files: [file] } });
  
    });
});
 
});
describe('Video Upload Editor', () => {
  const VideoUploadEditorProps = {
    runtime: { // Video Proxy
      canProxyVideoSrc: (src: string) => true,
      getProxyVideoSrc: (src: string) => "http://video.mp4",
      getVideoSrc: jest.fn().mockReturnValue(Promise.resolve("http://video.mp4")),
  
      // Video Upload
      canUploadVideo: () => true,
      uploadVideo: jest.fn().mockResolvedValue({
        height: 200,
        id: "Test-1",
        src: "",
        width: 150,
      }),
    },
    close: () => { }
  };

 const videouploadeditor = new VideoUploadEditor(VideoUploadEditorProps)

    it('should render Video Upload Editor', () => {

     expect(videouploadeditor).toBeDefined();
  
    });
    it('should handle componentWillUnmount', () => {
      videouploadeditor.componentWillUnmount();
      expect(videouploadeditor._unmounted).toBeTruthy();
   
     });
     it('should handle _onSuccess ', () => {
      videouploadeditor._unmounted = true;
      expect(videouploadeditor._onSuccess( {
        height: 10,
        id: '',
        src: '',
        width: 10
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

     it('should handle _upload ', async() => {
      videouploadeditor.props = {  
      close: () => { }};

      const file = new File([], 'test.mp4');
      const instance = await videouploadeditor._upload(file)
        
      
      expect(instance).toBeUndefined();
   
     });
     it('should handle _upload ', async() => {
      videouploadeditor.props = {  runtime: { // Video Proxy
        canProxyVideoSrc: (src: string) => true,
        getProxyVideoSrc: (src: string) => "http://video.mp4",
        getVideoSrc: jest.fn().mockReturnValue(Promise.resolve("http://video.mp4")),
    
        // Video Upload
        canUploadVideo: () => true,
        uploadVideo: jest.fn().mockResolvedValue({
          height: 0,
          id: "Test-1",
          src: "",
          width: 0,
        }),
      },
      close: () => { }};
      
      const file = new File([], 'test.mp4');
      const instance = await videouploadeditor._upload(file)
        
      
      expect(instance).toBeUndefined();
   
     });

});

