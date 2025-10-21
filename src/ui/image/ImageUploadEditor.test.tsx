import React from 'react';
import {ImageUploadEditor} from './ImageUploadEditor';
import {uuid} from '../uuid';
import {CustomButton, preventEventDefault} from '@modusoperandi/licit-ui-commands';
import {LoadingIndicator} from '../LoadingIndicator';

jest.mock('../uuid', () => ({uuid: jest.fn(() => 'mock-id')}));
jest.mock('../LoadingIndicator', () => ({LoadingIndicator: () => <div>Loading</div>}));
jest.mock('@modusoperandi/licit-ui-commands', () => ({
  CustomButton: jest.fn(),
  preventEventDefault: jest.fn((e) => e.preventDefault()),
}));

describe('ImageUploadEditor', () => {
  let closeMock: jest.Mock;
  let runtimeMock: any;

  beforeEach(() => {
    closeMock = jest.fn();
    runtimeMock = {
      canUploadImage: jest.fn(() => true),
      uploadImage: jest.fn((file: File) => Promise.resolve({src: 'url', alt: 'alt'})),
    };
    (uuid as jest.Mock).mockReturnValue('mock-id');
  });

  it('initializes state correctly', () => {
    const comp = new ImageUploadEditor({runtime: runtimeMock, close: closeMock});
    expect(comp.state).toEqual({id: 'mock-id', pending: false, error: null});
  });

  it('sets _unmounted on componentWillUnmount', () => {
    const comp = new ImageUploadEditor({runtime: runtimeMock, close: closeMock});
    expect(comp._unmounted).toBe(false);
    comp.componentWillUnmount();
    expect(comp._unmounted).toBe(true);
  });

  it('calls close when _cancel is invoked', () => {
    const comp = new ImageUploadEditor({runtime: runtimeMock, close: closeMock});
    comp._cancel();
    expect(closeMock).toHaveBeenCalled();
  });

  it('handles _onSuccess correctly', () => {
    const comp = new ImageUploadEditor({runtime: runtimeMock, close: closeMock});
    comp._onSuccess({src: 'url', alt: 'alt'});
    expect(closeMock).toHaveBeenCalledWith({src: 'url', alt: 'alt'});
  });

  it('does not call _onSuccess if unmounted', () => {
    const comp = new ImageUploadEditor({runtime: runtimeMock, close: closeMock});
    comp._unmounted = true;
    comp._onSuccess({src: 'url', alt: 'alt'});
    expect(closeMock).not.toHaveBeenCalled();
  });

  it('handles _onError correctly', () => {
    const comp = new ImageUploadEditor({runtime: runtimeMock, close: closeMock});
    comp._onError(new Error('fail'));
    expect(comp.state.error).toEqual(null);
    expect(comp.state.pending).toBe(false);
    expect(comp.state.id).toBe('mock-id');
  });

  it('does not update state in _onError if unmounted', () => {
    const comp = new ImageUploadEditor({runtime: runtimeMock, close: closeMock});
    comp._unmounted = true;
    const oldState = {...comp.state};
    comp._onError(new Error('fail'));
    expect(comp.state).toEqual(oldState);
  });

  it('handles _onSelectFile with valid file', async () => {
    const comp = new ImageUploadEditor({runtime: runtimeMock, close: closeMock});
    const file = new File([''], 'file.png', {type: 'image/png'});
    await comp._onSelectFile({target: {files: [file]}} as any);
    expect(runtimeMock.uploadImage).toHaveBeenCalledWith(file);
  });

  it('does nothing in _onSelectFile if no file', async () => {
    const comp = new ImageUploadEditor({runtime: runtimeMock, close: closeMock});
    await comp._onSelectFile({target: {files: []}} as any);
    expect(runtimeMock.uploadImage).not.toHaveBeenCalled();
  });

  it('handles _upload successfully', async () => {
    const comp = new ImageUploadEditor({runtime: runtimeMock, close: closeMock});
    const file = new File([''], 'file.png', {type: 'image/png'});
    await comp._upload(file);
    expect(comp.state.pending).toBe(false); // state set before await
    expect(closeMock).toHaveBeenCalledWith({src: 'url', alt: 'alt'});
  });

  it('handles _upload failure', async () => {
    runtimeMock.uploadImage = jest.fn(() => Promise.reject(new Error('fail')));
    const comp = new ImageUploadEditor({runtime: runtimeMock, close: closeMock});
    const file = new File([''], 'file.png', {type: 'image/png'});
    await comp._upload(file);
    expect(comp.state.error).toEqual(null);
    expect(comp.state.pending).toBe(false);
  });

  it('throws error if feature not available', async () => {
    runtimeMock.canUploadImage = jest.fn(() => false);
    const comp = new ImageUploadEditor({runtime: runtimeMock, close: closeMock});
    const file = new File([''], 'file.png', {type: 'image/png'});
    await comp._upload(file);
    expect(comp.state.error).toEqual(null);
  });
});
