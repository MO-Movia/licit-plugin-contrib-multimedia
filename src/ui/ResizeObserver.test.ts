import ResizeObserver from 'resize-observer-polyfill';
import nullthrows from 'nullthrows';
import observer, {observe, unobserve} from './ResizeObserver'

describe('Resize observer',()=>{
    it('should handle observe',()=>{
        const element = document.createElement('div');
        expect(observe(element,(ResizeObserverEntry) => {})).toBeUndefined();
    })
    it('should handle observe when nodesObserving.has(el)',()=>{
        const element = document.createElement('span');
        observe(element,(ResizeObserverEntry) => {});
        const element1 = document.createElement('span');

        expect(observe(element1,(element1)=>{})).toBeUndefined();
    })
    it('should handle unobserve',()=>{
        const element = document.createElement('div');
        expect(unobserve(element,(ResizeObserverEntry) => {})).toBeUndefined();
    })
    it('should handle unobserve',()=>{
        const element = document.createElement('div');
        expect(unobserve(element)).toBeUndefined();
    })
    it('should handle unobserve when nodesObserving.has(el)',()=>{
        const resizeobserver = new ResizeObserver(()=>{})
        const element = document.createElement('span');
        observe(element,(ResizeObserverEntry) => {});
        expect(unobserve(element,(ResizeObserverEntry) => {})).toBeUndefined();
    })
})