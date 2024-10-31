import { isOffline } from '../isOffline'; // Import needed to match the module structure

// Mock before imports
jest.mock('../isOffline', () => ({
  isOffline: jest.fn().mockReturnValue(false),
}));

import { resolveImage } from './resolveImage';

const mockSrc = 'mock.png';

describe('resolveImage', () => {
  it('should not touch special protocols', async () => {
    const specialSrc = 'foobar://' + mockSrc;
    const res = await resolveImage(specialSrc);
    expect(res.src).toBe(specialSrc);
  });

  it('should handle error', async () => {
    const mockImg = document.createElement('img');
    jest.spyOn(document, 'createElement').mockReturnValue(mockImg);
    jest.spyOn(document.body, 'appendChild').mockImplementation(node => node);
    const res = resolveImage(mockSrc);
    await new Promise(r => setTimeout(r, 1));
    mockImg?.onerror(new Error('bad stuff') as unknown as Event|string);
    const final = await res;
    expect(final.src).toBe(mockSrc);
  });

  it('should fail offline gracefully', async () => {
    (isOffline as jest.Mock).mockReturnValue(true);
    expect((await resolveImage(mockSrc)).src).toBe(mockSrc);
  });
});
