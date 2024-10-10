import Enzyme from 'enzyme';
import Adapter from '@cfaester/enzyme-adapter-react-18';
import React from 'react';
import {ImageUploadEditor} from './ImageUploadEditor';

Enzyme.configure({adapter: new Adapter()});

const ImageUploadEditorProps = {
  runtime: {
    // Image Proxy
    canProxyImageSrc: (_src: string) => true,
    getProxyImageSrc: jest
      .fn()
      .mockReturnValue(Promise.resolve('http:image.png')),

    // Image Upload
    canUploadImage: () => true,
    uploadImage: jest.fn().mockResolvedValue({
      height: 200,
      id: 'Test-1',
      src: '',
      width: 150,
    }),

    // Comments
    canComment: () => true,
    createCommentThreadID: () => 'Test-ID',

    // External HTML
    canLoadHTML: () => true,
    loadHTML: jest.fn().mockResolvedValue('baz'),
  },
  close: () => undefined,
};

describe('Image Upload Editor', () => {
  it('should render Image Upload Editor', () => {
    const wrapper = Enzyme.shallow(
      <ImageUploadEditor {...ImageUploadEditorProps} />
    );
    const ImageUploadEditorIns = wrapper.instance();
    ImageUploadEditorIns.componentWillUnmount();
    const file = new File(['hello world'], 'test.txt', {type: 'text/plain'});
    wrapper.find('input').simulate('change', {target: {files: [file]}});
  });
});
describe('Image Upload Editor', () => {
  it('should render Image Upload Editor', () => {
    const ImageUploadEditorProps = {
      runtime: {
        // Image Proxy
        canProxyImageSrc: (_src: string) => true,
        getProxyImageSrc: jest
          .fn()
          .mockReturnValue(Promise.resolve('http:image.png')),

        // Image Upload
        canUploadImage: () => true,
        uploadImage: jest.fn().mockResolvedValue({
          height: 200,
          id: 'Test-1',
          src: '',
          width: 150,
        }),

        // Comments
        canComment: () => true,
        createCommentThreadID: () => 'Test-ID',

        // External HTML
        canLoadHTML: () => true,
        loadHTML: jest.fn().mockResolvedValue('baz'),
      },
      close: () => undefined,
    };
    const imageuploadeditor = new ImageUploadEditor(ImageUploadEditorProps);
    expect(imageuploadeditor).toBeDefined();
  });
  it('should handle render', () => {
    const ImageUploadEditorProps = {
      runtime: {
        // Image Proxy
        canProxyImageSrc: (_src: string) => true,
        getProxyImageSrc: jest
          .fn()
          .mockReturnValue(Promise.resolve('http:image.png')),

        // Image Upload
        canUploadImage: () => true,
        uploadImage: jest.fn().mockResolvedValue({
          height: 200,
          id: 'Test-1',
          src: '',
          width: 150,
        }),

        // Comments
        canComment: () => true,
        createCommentThreadID: () => 'Test-ID',

        // External HTML
        canLoadHTML: () => true,
        loadHTML: jest.fn().mockResolvedValue('baz'),
      },
      close: () => undefined,
    };
    const imageuploadeditor = new ImageUploadEditor(ImageUploadEditorProps);
    imageuploadeditor.state = {
      error: 'error',
      id: '',
      pending: false,
    };
    expect(imageuploadeditor.render()).toBeDefined();
  });
  it('should handle _onSuccess ', () => {
    const ImageUploadEditorProps = {
      runtime: {
        // Image Proxy
        canProxyImageSrc: (_src: string) => true,
        getProxyImageSrc: jest
          .fn()
          .mockReturnValue(Promise.resolve('http:image.png')),

        // Image Upload
        canUploadImage: () => true,
        uploadImage: jest.fn().mockResolvedValue({
          height: 200,
          id: 'Test-1',
          src: '',
          width: 150,
        }),

        // Comments
        canComment: () => true,
        createCommentThreadID: () => 'Test-ID',

        // External HTML
        canLoadHTML: () => true,
        loadHTML: jest.fn().mockResolvedValue('baz'),
      },
      close: () => undefined,
    };
    const imageuploadeditor = new ImageUploadEditor(ImageUploadEditorProps);
    imageuploadeditor._unmounted = false;
    expect(
      imageuploadeditor._onSuccess({
        height: 10,
        id: '',
        src: '',
        width: 10,
      })
    ).toBeUndefined();
  });

  it('should handle _onError  ', () => {
    const ImageUploadEditorProps = {
      runtime: {
        // Image Proxy
        canProxyImageSrc: (_src: string) => true,
        getProxyImageSrc: jest
          .fn()
          .mockReturnValue(Promise.resolve('http:image.png')),

        // Image Upload
        canUploadImage: () => true,
        uploadImage: jest.fn().mockResolvedValue({
          height: 200,
          id: 'Test-1',
          src: '',
          width: 150,
        }),

        // Comments
        canComment: () => true,
        createCommentThreadID: () => 'Test-ID',

        // External HTML
        canLoadHTML: () => true,
        loadHTML: jest.fn().mockResolvedValue('baz'),
      },
      close: () => undefined,
    };
    const imageuploadeditor = new ImageUploadEditor(ImageUploadEditorProps);
    imageuploadeditor._unmounted = true;
    expect(
      imageuploadeditor._onError({
        name: '',
        message: '',
        stack: '',
      })
    ).toBeUndefined();
  });
  it('should handle _upload ', async () => {
    const ImageUploadEditorProps = {
      runtime: {
        // Image Proxy
        canProxyImageSrc: (_src: string) => true,
        getProxyImageSrc: jest
          .fn()
          .mockReturnValue(Promise.resolve('http:image.png')),

        // Image Upload

        // Comments
        canComment: () => true,
        createCommentThreadID: () => 'Test-ID',

        // External HTML
        canLoadHTML: () => true,
        loadHTML: jest.fn().mockResolvedValue('baz'),
      },
      close: () => undefined,
    };
    const imageuploadeditor = new ImageUploadEditor(ImageUploadEditorProps);
    const file = new File([], 'test.jpg');
    const instance = await imageuploadeditor._upload(file);
    expect(instance).toBeUndefined();
  });

  it('should handle _upload ', () => {
    const ImageUploadEditorProps = {
      runtime: {
        // Image Proxy
        canProxyImageSrc: (_src: string) => true,
        getProxyImageSrc: jest
          .fn()
          .mockReturnValue(Promise.resolve('http:image.png')),

        // Image Upload

        // Comments
        canComment: () => true,
        createCommentThreadID: () => 'Test-ID',

        // External HTML
        canLoadHTML: () => true,
        loadHTML: jest.fn().mockResolvedValue('baz'),
      },
      close: () => undefined,
    };
    const imageuploadeditor = new ImageUploadEditor(ImageUploadEditorProps);

    expect(imageuploadeditor._cancel()).toBeUndefined();
  });
});
describe('image upload editor', () => {
  it('should handle _upload branch coverage when runtime is not present', async () => {
    const ImageUploadEditorProps = {
      close: () => undefined,
    };
    const imageuploadeditor = new ImageUploadEditor(ImageUploadEditorProps);
    const file = new File([], 'test.jpg');
    const instance = await imageuploadeditor._upload(file);
    expect(instance).toBeUndefined();
  });
});
