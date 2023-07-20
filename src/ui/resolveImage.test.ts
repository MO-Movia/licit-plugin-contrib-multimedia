const isOffline = jest.fn().mockReturnValue(false);
jest.mock('./isOffline', () => isOffline);
// mock imports must be declared before importing
import resolveImage from './resolveImage';

const mockSrc = 'mock.png';
describe('resolveImage', () => {
    it('should not touch special protocals', async () => {
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
        mockImg.onerror('bad stuff');
        const final = await res;
        expect(final.src).toBe(mockSrc);
    });
    it('should fail offline gracefully', async () => {
        isOffline.mockReturnValue(true);
        expect((await resolveImage(mockSrc)).src).toBe(mockSrc);
    });
});