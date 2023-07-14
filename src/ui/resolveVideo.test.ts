const isOffline = jest.fn().mockReturnValue(false);
jest.mock('./isOffline', () => isOffline);
// mock imports must be declared before importing
import resolveVideo from './resolveVideo';

const mockSrc = 'mock.png';
describe('resolveImage', () => {
    it('should not touch special protocals', async () => {
        const src = 'foobar://' + mockSrc;
        const res = await resolveVideo({
            src,
            id: '',
            width: 0,
            height: 0,
            validValue: false
        });
        expect(res.src).toBe(src);
    });
    it('should handle missing src', async () => {
        const res = await resolveVideo();
        expect(res.src).toBe('');
    });
    it('should handle error', async () => {
        const res = await resolveVideo({
            src: mockSrc,
            id: '',
            width: 0,
            height: 0,
            validValue: false
        });
        expect(res.src).toBe(mockSrc);
    });
    it('should fail offline gracefully', async () => {
        isOffline.mockReturnValue(true);
        expect((await resolveVideo({
            src: mockSrc,
            id: '',
            width: 0,
            height: 0,
            validValue: false
        })).src).toBe(mockSrc);
    });
});