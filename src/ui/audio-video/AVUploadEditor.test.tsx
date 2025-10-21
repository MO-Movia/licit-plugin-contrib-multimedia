import React from 'react';
import ReactDOM from 'react-dom';
import AVUploadEditor from './AVUploadEditor';

jest.mock('uuid', () => ({
  v1: jest.fn(() => 'mock-id'),
}));

jest.mock('@modusoperandi/licit-ui-commands', () => ({
  CustomButton: (props: any) => <button onClick={props.onClick}>{props.label}</button>,
  preventEventDefault: jest.fn((e: any) => e.preventDefault()),
}));

jest.mock('../LoadingIndicator', () => ({
  LoadingIndicator: () => <div data-testid="loading">Loading...</div>,
}));

describe('AVUploadEditor (no RTL)', () => {
  let container: HTMLElement;
  let closeMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    container = document.createElement('div');
    document.body.appendChild(container);
    closeMock = jest.fn();
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(container);
    container.remove();
  });

  const flushPromises = () => new Promise(setImmediate);

  function renderComponent(props: any = {}) {
    ReactDOM.render(
      <AVUploadEditor isAudio={false} close={closeMock} {...props} />,
      container
    );
    return container.querySelector('.molm-czi-image-upload-editor') as HTMLElement;
  }

  it('renders with video mode', () => {
    const div = renderComponent();
    expect(div.classList.contains('molm-czi-image-upload-editor')).toBe(true);
    expect(div.textContent).toContain('Choose an video file');
  });

  it('renders with audio mode', () => {
    const div = renderComponent({ isAudio: true });
    expect(div.textContent).toContain('Choose an audio file');
    const input = container.querySelector('input')!;
    expect(input.accept).toContain('audio/');
  });

  it('renders pending state with LoadingIndicator', () => {
    const comp = new (AVUploadEditor as any)({ isAudio: true, close: jest.fn() });
    comp.state = { id: '1', error: null, pending: true };
    const el = comp.render();
    expect(el.props.className).toContain('pending');
  });

  it('renders error state', () => {
    const comp = new (AVUploadEditor as any)({ isAudio: false, close: jest.fn() });
    comp.state = { id: '1', error: new Error('Oops'), pending: false };
    const el = comp.render();
    expect(el.props.className).toContain('error');
  });

  it('handles cancel button click', () => {
    renderComponent();
    const button = container.querySelector('button')!;
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(closeMock).toHaveBeenCalled();
  });

  it('componentWillUnmount sets _unmounted', () => {
    const comp = new (AVUploadEditor as any)({ close: closeMock, isAudio: false });
    comp.componentWillUnmount();
    expect(comp._unmounted).toBe(true);
  });

  xit('calls _onSuccess and closes', () => {
    const comp = new (AVUploadEditor as any)({ close: closeMock, isAudio: true });
    const video = { width: 100, height: 100 };
    comp._onSuccess(video);
    expect(video.isAudio).toBe(true);
    expect(closeMock).toHaveBeenCalledWith(video);
  });

  it('does nothing on _onSuccess when unmounted', () => {
    const comp = new (AVUploadEditor as any)({ close: closeMock, isAudio: false });
    comp._unmounted = true;
    comp._onSuccess({});
    expect(closeMock).not.toHaveBeenCalled();
  });

  it('sets error in _onError', () => {
    const comp = new (AVUploadEditor as any)({ close: closeMock, isAudio: false });
    comp.setState = jest.fn();
    comp._onError(new Error('bad'));
    expect(comp.setState).toHaveBeenCalledWith({
      error: expect.any(Error),
      id: 'mock-id',
      pending: false,
    });
  });

  it('does nothing on _onError if unmounted', () => {
    const comp = new (AVUploadEditor as any)({ close: closeMock, isAudio: false });
    comp._unmounted = true;
    comp.setState = jest.fn();
    comp._onError(new Error('fail'));
    expect(comp.setState).not.toHaveBeenCalled();
  });

  it('handles _onSelectFile with valid file', async () => {
    const comp = new (AVUploadEditor as any)({ close: closeMock, isAudio: false });
    const file = new File(['dummy'], 'video.mp4', { type: 'video/mp4' });
    const mockUpload = jest.fn().mockResolvedValue({ width: 0, height: 0 });
    comp.props.runtime = {
      canUploadVideo: () => true,
      uploadVideo: mockUpload,
    };
    const event = {
      target: { files: [file] },
    };
    await comp._onSelectFile(event as any);
    expect(mockUpload).toHaveBeenCalledWith(file);
  });

  it('handles _upload success for video and normalizes 0 sizes', async () => {
    const comp = new (AVUploadEditor as any)({ close: closeMock, isAudio: false });
    const mockUpload = jest.fn().mockResolvedValue({ width: 0, height: 0 });
    comp.props.runtime = {
      canUploadVideo: () => true,
      uploadVideo: mockUpload,
    };
    comp._onSuccess = jest.fn();
    await comp._upload(new File(['x'], 'v.mp4'));
    expect(comp._onSuccess).toHaveBeenCalledWith({ width: 100, height: 100 });
  });

  it('handles _upload success for audio', async () => {
    const comp = new (AVUploadEditor as any)({ close: closeMock, isAudio: true });
    const mockUpload = jest.fn().mockResolvedValue({ width: 10, height: 10 });
    comp.props.runtime = {
      canUploadAudio: () => true,
      uploadAudio: mockUpload,
    };
    comp._onSuccess = jest.fn();
    await comp._upload(new File(['x'], 'a.mp3'));
    expect(comp._onSuccess).toHaveBeenCalled();
  });

  it('throws feature unavailable error (video)', async () => {
    const comp = new (AVUploadEditor as any)({ close: closeMock, isAudio: false });
    comp.props.runtime = { canUploadVideo: () => false };
    comp._onError = jest.fn();
    await comp._upload(new File(['x'], 'v.mp4'));
    expect(comp._onError).toHaveBeenCalled();
  });

  it('throws feature unavailable error (audio)', async () => {
    const comp = new (AVUploadEditor as any)({ close: closeMock, isAudio: true });
    comp.props.runtime = { canUploadAudio: () => false };
    comp._onError = jest.fn();
    await comp._upload(new File(['x'], 'a.mp3'));
    expect(comp._onError).toHaveBeenCalled();
  });

  it('handles _upload throwing runtime error', async () => {
    const comp = new (AVUploadEditor as any)({ close: closeMock, isAudio: false });
    const mockUpload = jest.fn().mockRejectedValue(new Error('upload fail'));
    comp.props.runtime = {
      canUploadVideo: () => true,
      uploadVideo: mockUpload,
    };
    comp._onError = jest.fn();
    await comp._upload(new File(['x'], 'v.mp4'));
    expect(comp._onError).toHaveBeenCalled();
  });
});
