import ImageSourceCommand,{insertImage} from './ImageSourceCommand';
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
describe('insert image',()=>{
    
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
        selection: {from:0,to:1},
        tr: {
          selection: {},
        },
        insert:(from,frag)=>{true}
      } as unknown as Transform;

      const src= 'new_src'
    it('should handle insertimage',()=>{
     expect(insertImage(mockTransaction,mockSchema,src)).toBeDefined();
    })

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
        expect(insertImage(mockTransaction,mockSchema,src)).toBeDefined();
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
        expect(insertImage(mockTransaction,mockSchema,src)).toBeDefined();
       })
    
})

describe('ImageSourceCommand ',()=>{
    const imagesourcecommand =  new ImageSourceCommand()
    it('should handle ImageSourceCommand',()=>{
        expect(imagesourcecommand).toBeDefined();
    })
    // it('should throw error',()=>{
    //     expect(imagesourcecommand.getEditor()).toThrowError('Not implemented');
    // })

    it('should handle isPopUp',()=>{
        expect(imagesourcecommand.isPopUp('popup')).toBeTruthy();
    })
    it('should handle isPopUp when popup is null',()=>{
        expect(imagesourcecommand.isPopUp(null)).toBeFalsy();
    })

    // it('should handle waitForUserInput ',()=>{
    //     const mockSchema = new Schema({
    //         nodes: {
    //           doc: { content: 'image' },
    //           text: {},
    //           image: {
    //             inline: true,
    //             attrs: {
    //               src: { default: '' },
    //               alt: { default: null }
    //             },
    //             group: 'inline',
    //             draggable: true,
    //             parseDOM: [{
    //               tag: 'img[src]',
    //               getAttrs(dom) {
    //                 return {
    //                   src: dom.getAttribute('src'),
    //                   alt: dom.getAttribute('alt')
    //                 };
    //               }
    //             }],
    //             toDOM(node) {
    //               return ['img', { src: node.attrs.src,alt: node.attrs.alt ||''}];
    //             }
    //           }
    //         }
    //       });
    //       //const content = DOMParser.fromSchema(schema).parse(document.createElement('div').appendChild(document.createElement('img')));
    //       const editorState = EditorState.create({
    //         schema:mockSchema,
    //         plugins: []
    //       });
    //       const mockEditorView = {
    //         state:editorState,
    //         dispatch: jest.fn(),
    //         posAtCoords: ({left,
    //           top})=>{return {
    //             pos: 1,
    //             inside: 1,
    //           }},
    //         destroy: jest.fn(),
    //       } as unknown as EditorView;
    //       return imagesourcecommand.waitForUserInput(editorState,()=>{},mockEditorView).then((result)=>{
    //         expect(result).toBeDefined();
    //       })
        
    // })
})
describe('inserimage',()=>{
  it('should handle inserimage when src null',()=>{
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
            selection: {},
            tr: {
              selection: {},
            },
            insert:(from,frag)=>{true}
          } as unknown as Transform;
    
          const src= ''
    expect(insertImage(mockTransaction,mockSchema,src)).toBeUndefined();
   })
})
