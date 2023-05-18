import {onSelection,onMutation} from  './CustomNodeView';
import SelectionObserver from './SelectionObserver';

describe('onSelection',()=>{
    it('should handle onselection',()=>{
        const selectonobserver = {
            disconnect:()=>{}
        } as unknown as SelectionObserver;
        jest.spyOn(window,'getSelection').mockReturnValue({} as unknown as Selection)
        const onselection = onSelection([],selectonobserver);
        expect(onselection).toBeUndefined();
    })
    it('should handle onselection branch coverage',()=>{
        const selectonobserver = {
            disconnect:()=>{}
        } as unknown as SelectionObserver;
        jest.spyOn(window,'getSelection').mockReturnValue({containsNode:(node)=>true} as unknown as Selection)
        const onselection = onSelection([],selectonobserver);
        expect(onselection).toBeUndefined();
    })

})
describe('onMutation',()=>{
    const onmutation = onMutation('',{disconnect:()=>{}} as unknown as MutationObserver)
    it('should handle onMutation',()=>{
        expect(onmutation).toBeUndefined()
    })
})