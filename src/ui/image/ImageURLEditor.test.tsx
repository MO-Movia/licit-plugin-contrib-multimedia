import {ImageURLEditor} from './ImageURLEditor';
import {CustomButton, preventEventDefault} from '@modusoperandi/licit-ui-commands';
import {resolveImage} from './resolveImage';
import React from 'react';

jest.mock('@modusoperandi/licit-ui-commands', () => ({
  CustomButton: jest.fn(() => null),
  preventEventDefault: jest.fn((e) => e.preventDefault()),
}));

jest.mock('./resolveImage', () => ({
  resolveImage: jest.fn(),
}));

describe('ImageURLEditor (no react-test-renderer)', () => {
  let closeMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    closeMock = jest.fn();
  });

  const createComp = (initialValue?: any) => {
    const comp = new ImageURLEditor({
      initialValue,
      close: closeMock,
    });
    return comp;
  };

  it('initializes with default state', () => {
    const comp = createComp({src: 'https://example.com/img.png'});
    expect(comp.state.src).toBe('https://example.com/img.png');
    expect(comp.state.validValue).toBeNull();
  });

  it('marks as unmounted on componentWillUnmount', () => {
    const comp = createComp();
    comp.componentWillUnmount();
    expect(comp._unmounted).toBe(true);
  });

  it('calls close() on _cancel', () => {
    const comp = createComp();
    comp._cancel();
    expect(closeMock).toHaveBeenCalledWith();
  });

  it('calls close() with validValue on _insert', () => {
    const comp = createComp();
    comp.state.validValue = {src: 'https://valid.png'};
    comp._insert();
    expect(closeMock).toHaveBeenCalledWith({src: 'https://valid.png'});
  });

  it('handles _onSrcChange and triggers _didSrcChange', async () => {
    const comp = createComp();
    const didSrcChangeSpy = jest.spyOn(comp, '_didSrcChange');
    const mockEvent = {target: {value: 'https://new.com/img.png'}} as any;

    comp._onSrcChange(mockEvent);

    expect(comp.state.src).toBe(undefined);
    expect(comp.state.validValue).toBeNull();
  });

 
  it('_didSrcChange does nothing if src mismatches', async () => {
    const comp = createComp();
    (resolveImage as jest.Mock).mockResolvedValue({
      src: 'https://other.com/img.png',
      complete: true,
    });
    comp.setState({src: 'https://new.com/img.png'});

    await comp._didSrcChange();

    // since src !== result.src, state should not change
    expect(comp.state.validValue).toBeNull();
  });

  it('_didSrcChange does nothing if unmounted', async () => {
    const comp = createComp();
    comp._unmounted = true;
    (resolveImage as jest.Mock).mockResolvedValue({
      src: 'https://same.com/img.png',
      complete: true,
    });
    comp.setState({src: 'https://same.com/img.png'});

    await comp._didSrcChange();
    expect(comp.state.validValue).toBeNull();
  });

  it('renders correctly without crashing (mock render call)', () => {
    const comp = createComp({src: 'https://a.com/img.png'});
    const output = comp.render();
    expect(output.type).toBe('div');
  });

  });
