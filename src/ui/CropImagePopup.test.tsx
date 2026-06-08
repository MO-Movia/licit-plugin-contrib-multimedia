import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CropImagePopup } from './CropImagePopup';

describe('CropImagePopup', () => {
  const testSrc = 'https://example.com/test.jpg';

  it('renders correctly', () => {
    render(<CropImagePopup onCancel={jest.fn()} onConfirm={jest.fn()} src={testSrc} />);
    expect(screen.getByAltText('Crop')).toBeInTheDocument();
    expect(screen.getByText('Crop')).toBeInTheDocument();
  });

  it('does not call onConfirm if crop is invalid', () => {
    const onConfirmMock = jest.fn();

    render(<CropImagePopup onCancel={jest.fn()} onConfirm={onConfirmMock} src={testSrc} />);

    // Click without loading image or setting crop
    fireEvent.click(screen.getByText('Crop'));

    expect(onConfirmMock).not.toHaveBeenCalled();
  });

  it('calls onCancel when cancel button is clicked', () => {
    const onCancelMock = jest.fn();

    render(<CropImagePopup onCancel={onCancelMock} onConfirm={jest.fn()} src={testSrc} />);

    fireEvent.click(screen.getByText('Cancel'));

    expect(onCancelMock).toHaveBeenCalled();
  });

  it('confirms crop data after image load', () => {
    const onConfirmMock = jest.fn();
    const drawImage = jest.fn();
    const getContextSpy = jest
      .spyOn(HTMLCanvasElement.prototype, 'getContext')
      .mockReturnValue({ drawImage } as unknown as CanvasRenderingContext2D);
    const toDataURLSpy = jest
      .spyOn(HTMLCanvasElement.prototype, 'toDataURL')
      .mockReturnValue('data:image/png;base64,cropped');

    render(<CropImagePopup onCancel={jest.fn()} onConfirm={onConfirmMock} src={testSrc} />);

    const image = screen.getByAltText('Crop') as HTMLImageElement;
    Object.defineProperties(image, {
      height: { configurable: true, value: 300 },
      naturalHeight: { configurable: true, value: 600 },
      naturalWidth: { configurable: true, value: 800 },
      width: { configurable: true, value: 400 },
    });

    fireEvent.load(image);
    fireEvent.click(screen.getByText('Crop'));

    expect(drawImage).toHaveBeenCalled();
    expect(onConfirmMock).toHaveBeenCalledWith({
      croppedBase64: 'data:image/png;base64,cropped',
      height: expect.any(Number),
      left: expect.any(Number),
      top: expect.any(Number),
      width: expect.any(Number),
    });

    getContextSpy.mockRestore();
    toDataURLSpy.mockRestore();
  });

  it('does not confirm when canvas context is unavailable', () => {
    const onConfirmMock = jest.fn();
    const getContextSpy = jest
      .spyOn(HTMLCanvasElement.prototype, 'getContext')
      .mockReturnValue(null);

    render(
      <CropImagePopup
        defaultUnit="%"
        onCancel={jest.fn()}
        onConfirm={onConfirmMock}
        src={testSrc}
      />
    );

    const image = screen.getByAltText('Crop') as HTMLImageElement;
    Object.defineProperties(image, {
      height: { configurable: true, value: 300 },
      naturalHeight: { configurable: true, value: 600 },
      naturalWidth: { configurable: true, value: 800 },
      width: { configurable: true, value: 400 },
    });

    fireEvent.load(image);
    fireEvent.click(screen.getByText('Crop'));

    expect(onConfirmMock).not.toHaveBeenCalled();

    getContextSpy.mockRestore();
  });
});
