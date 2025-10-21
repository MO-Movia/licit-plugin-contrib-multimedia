import AVEditor from './AVEditor';
import axios from 'axios';

jest.mock('axios');
jest.mock('@modusoperandi/licit-ui-commands', () => ({
  CustomButton: jest.fn(),
  preventEventDefault: jest.fn(),
}));

describe('AVEditor', () => {
  let closeMock: jest.Mock;

  beforeEach(() => {
    closeMock = jest.fn();
    jest.clearAllMocks();
  });

  it('should create instance with video', () => {
    const editor = new AVEditor({initialValue: {width: 123, height: 456}, close: closeMock, isAudio: false});
    expect(editor).toBeDefined();
    expect(editor.state.src).toContain('youtube.com/embed');
  });

  it('should create instance with audio', () => {
    const editor = new AVEditor({initialValue: {}, close: closeMock, isAudio: true});
    expect(editor).toBeDefined();
    expect(editor.state.src).toBe('');
  });

  it('should handle null initialValue', () => {
    const editor = new AVEditor({initialValue: null, close: closeMock, isAudio: false});
    expect(editor).toBeDefined();
  });

  it('should render video editor', () => {
    const editor = new AVEditor({initialValue: {}, close: closeMock, isAudio: false});
    editor.state = {id: 'id', src: '', width: 10, height: 10, validValue: true, isAudio: false};
    expect(editor.render()).toBeDefined();
  });

  it('should render audio editor', () => {
    const editor = new AVEditor({initialValue: {}, close: closeMock, isAudio: true});
    editor.state = {id: 'id', src: '', width: 0, height: 0, validValue: false, isAudio: true};
    expect(editor.render()).toBeDefined();
  });

  it('should handle _cancel', () => {
    const editor = new AVEditor({initialValue: {}, close: closeMock, isAudio: false});
    editor._cancel();
    expect(closeMock).toHaveBeenCalled();
  });

  it('should handle _insert', () => {
    const editor = new AVEditor({initialValue: {}, close: closeMock, isAudio: false});
    editor.state = {id: 'id', src: 'url', width: 10, height: 10, validValue: true, isAudio: false};
    editor._insert();
    expect(closeMock).toHaveBeenCalledWith(editor.state);
  });

  it('should handle _getYouTubeId normal URL', () => {
    const editor = new AVEditor({initialValue: {}, close: closeMock, isAudio: false});
    expect(editor._getYouTubeId('https://www.youtube.com/watch?v=abc123')).toBe('abc123');
  });

  it('should handle _getYouTubeId edge case', () => {
    const editor = new AVEditor({initialValue: {}, close: closeMock, isAudio: false});
    expect(editor._getYouTubeId('https://example.com')).toBe('https://example.com');
  });

  it('should handle _onWidthChange', () => {
    const editor = new AVEditor({initialValue: {}, close: closeMock, isAudio: false});
    editor._onWidthChange({target: {value: '500'}} as any);
    expect(editor.state.width).toBe(undefined);
    expect(editor.state.validValue).toBe(null);
  });

  it('should handle _onHeightChange', () => {
    const editor = new AVEditor({initialValue: {}, close: closeMock, isAudio: false});
    editor._onHeightChange({target: {value: '400'}} as any);
    expect(editor.state.height).toBe(undefined);
    expect(editor.state.validValue).toBe(null);
  });

  it('should handle _onSrcChange success for video', async () => {
    (axios.get as jest.Mock).mockResolvedValue({data: {width: 100, height: 200}});
    const editor = new AVEditor({initialValue: {}, close: closeMock, isAudio: false});
    await editor._onSrcChange({target: {value: 'https://www.youtube.com/watch?v=abc123'}} as any);
    expect(editor.state.src).toBe('https://www.youtube.com/embed/');
    expect(editor.state.width).toBe(undefined);
    expect(editor.state.height).toBe(undefined);
    expect(editor.state.validValue).toBe(null);
  });

  it('should handle _onSrcChange failure for video', async () => {
    (axios.get as jest.Mock).mockRejectedValue(new Error('fail'));
    const editor = new AVEditor({initialValue: {}, close: closeMock, isAudio: false});
    await editor._onSrcChange({target: {value: 'https://www.youtube.com/watch?v=abc123'}} as any);
    expect(editor.state.src).toBe('https://www.youtube.com/embed/');
    expect(editor.state.validValue).toBe(null);
  });

  it('should handle _onSrcChange for audio', async () => {
    (axios.get as jest.Mock).mockResolvedValue({data: {width: 50, height: 50}});
    const editor = new AVEditor({initialValue: {}, close: closeMock, isAudio: true});
    await editor._onSrcChange({target: {value: 'audio.mp3'}} as any);
    expect(editor.state.src).toBe('');
    expect(editor.state.width).toBe(undefined);
    expect(editor.state.height).toBe(undefined);
    expect(editor.state.validValue).toBe(null);
  });

  it('should handle getsrc', () => {
    const editor = new AVEditor({initialValue: {}, close: closeMock, isAudio: false});
    expect(editor.getsrc({target: {value: 'test'}} as any)).toBe('test');
  });
});
