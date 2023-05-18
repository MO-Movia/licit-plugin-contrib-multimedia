import VideoSourceCommand,{insertIFrame} from './VideoSourceCommand';
import { TextSelection } from 'prosemirror-state';
import { createEditor, doc, p } from 'jest-prosemirror';
import { Transform } from 'prosemirror-transform';
import {
    Schema,
    Slice,
    ResolvedPos,
    Node,
    
    Node as PMNode,
  } from 'prosemirror-model';
  import { EditorState } from 'prosemirror-state';
  import { EditorView,DirectEditorProps } from 'prosemirror-view';
describe('insertIFrame',()=>{
    
    it('should handle !selection',()=>{
        const mockSchema = new Schema({
            nodes: {
              doc: { content: 'image' },
              text: {},
              image: {
                inline: true,
                attrs: {
                  src: { default: '' },
                  alt: { default: null }
                },
                group: 'inline',
                draggable: true,
                parseDOM: [{
                  tag: 'img[src]',
                  getAttrs(dom) {
                    return {
                      src: dom.getAttribute('src'),
                      alt: dom.getAttribute('alt')
                    };
                  }
                }],
                toDOM(node) {
                  return ['img', { src: node.attrs.src,alt: node.attrs.alt ||''}];
                }
              }
            }
          });
            const mockTransaction = {
                // Define any properties or methods that your function requires.
                
                tr: {
                  selection: {},
                },
                insert:(from,frag)=>{true}
              } as unknown as Transform;
        
              const src= 'new_src'
        expect(insertIFrame(mockTransaction,mockSchema)).toBeDefined();
       })
       
       it('should handle !image',()=>{
        const mockSchema = new Schema({
            nodes: {
              doc: { content: 'paragraph+' },
              text:{},
              paragraph: {
                content: 'text*'
              }
            },
            marks: {
              bold: {},
              italic: {}
            }
          });
            const mockTransaction = {
                // Define any properties or methods that your function requires.
                selection: {},
                tr: {
                  selection: {},
                },
                insert:(from,frag)=>{true}
              } as unknown as Transform;
        
              const src= 'new_src'
        expect(insertIFrame(mockTransaction,mockSchema)).toBeDefined();
       })
       it('should handle insertIFrame when from!=to',()=>{
        const mockSchema = new Schema({
            nodes: {
              doc: { content: 'paragraph+' },
              text:{},
              paragraph: {
                content: 'text*'
              }
            },
            marks: {
              bold: {},
              italic: {}
            }
          });
            const mockTransaction = {
                // Define any properties or methods that your function requires.
                selection: {from:1,to:2},
                tr: {
                  selection: {},
                },
                insert:(from,frag)=>{true}
              } as unknown as Transform;
        
              const src= 'new_src'
        expect(insertIFrame(mockTransaction,mockSchema)).toBeDefined();
       })
    
})
