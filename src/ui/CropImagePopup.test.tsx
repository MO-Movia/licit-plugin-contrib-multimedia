import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CropImagePopup } from './CropImagePopup';

describe('CropImagePopup', () => {
  const testSrc = 'https://example.com/test.jpg';

  it('renders correctly', () => {
    render(<CropImagePopup onConfirm={jest.fn()} onCancel={jest.fn()} src={testSrc} />);
    expect(screen.getByAltText('Crop')).toBeInTheDocument();
    expect(screen.getByText('Crop')).toBeInTheDocument();
  });

  it('does not call onConfirm if crop is invalid', () => {
    const onConfirmMock = jest.fn();

    render(<CropImagePopup onConfirm={onConfirmMock} onCancel={jest.fn()} src={testSrc} />);

    // Click without loading image or setting crop
    fireEvent.click(screen.getByText('Crop'));

    expect(onConfirmMock).not.toHaveBeenCalled();
  });
});