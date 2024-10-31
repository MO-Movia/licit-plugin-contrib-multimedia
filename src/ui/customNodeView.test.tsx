import { JSXElementConstructor, ReactElement } from 'react';
import {onSelection,onMutation,CustomNodeView, EditorFocused } from  './CustomNodeView';
import {SelectionObserver} from './SelectionObserver';
import {Node} from 'prosemirror-model';
describe('onSelection',()=>{
    it('should handle onselection',()=>{
        const selectonobserver = {
            disconnect:()=>undefined
        } as unknown as SelectionObserver;
        jest.spyOn(window,'getSelection').mockReturnValue({} as unknown as Selection);
        const onselection = onSelection([],selectonobserver);
        expect(onselection).toBeUndefined();
    });
    it('should handle onselection branch coverage',()=>{
        const selectonobserver = {
            disconnect:()=>undefined
        } as unknown as SelectionObserver;
        jest.spyOn(window,'getSelection').mockReturnValue({containsNode:(_node)=>true} as unknown as Selection);
        const onselection = onSelection([],selectonobserver);
        expect(onselection).toBeUndefined();
    });
    it('should handle onselection branch coverage',()=>{
        const selectonobserver = {
            disconnect:()=>undefined
        } as unknown as SelectionObserver;
        jest.spyOn(window,'getSelection').mockReturnValue(null);
        const onselection = onSelection([],selectonobserver);
        expect(onselection).toBeUndefined();
    });

});
describe('onMutation',()=>{
    const onmutation = onMutation('',{disconnect:()=>undefined} as unknown as MutationObserver);
    it('should handle onMutation',()=>{
        expect(onmutation).toBeUndefined();
    });
});