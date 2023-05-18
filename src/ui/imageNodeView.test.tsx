import {ImageViewBody} from './ImageNodeView';
import {
    Schema,
    Slice,
    ResolvedPos,
    Node,
    
    Node as PMNode,
  } from 'prosemirror-model';
  import { EditorState } from 'prosemirror-state';
  import { createEditor, doc, p } from 'jest-prosemirror';
import {EditorFocused} from './CustomNodeView';
import ImageNodeView from './ImageNodeView';
import schema from "prosemirror-schema-basic";
import ResizeObserver from './ResizeObserver';

describe('ImageNodeView',()=>{
    const mockSchema = new Schema({
        nodes: {
          doc: { content: 'image' },
          text: {},
          image: {
            inline: true,
            attrs: {
              align: { default: 'left' },
              fitToParent: { default: true }
            },
            group: 'inline',
            draggable: true,
            parseDOM: [{
              tag: 'img[src]',
              getAttrs(dom:any) {
                return {
                    align: dom.getAttribute('align'),
                    fitToParent: dom.getAttribute('fitToParent')
                };
              }
            }],
            toDOM(node) {
              return ['img', { src: node.attrs.src,align: node.attrs.align ||''}];
            }
          }
        }
      });
      //const content = DOMParser.fromSchema(schema).parse(document.createElement('div').appendChild(document.createElement('img')));
      const editorState = EditorState.create({
        schema:mockSchema,
        plugins: []
      });
      const el = document.createElement('div')
      const mockEditorView = {
        state:editorState,
        dispatch: jest.fn(),
        posAtCoords: ({left,
          top})=>{return {
            pos: 1,
            inside: 1,
          }},
        destroy: jest.fn(),
        dom:el
      };
      const editorfocused = {
        focused: true,
        runtime: {},
        readOnly: true,
        ...mockEditorView
      } as unknown as EditorFocused;

      const mockImageNode = Node.fromJSON(mockSchema,{
        type: 'image',
        attrs: {
          align:'left',
          fitToParent:'fit'
        }
      }) as unknown as Node
    const imagenodeview = new ImageNodeView( mockImageNode,editorfocused,()=>1,[]);
    imagenodeview.props = {
        decorations: [],
        editorView: editorfocused,
        getPos: () => 1,
        node: {attrs:{ align:'left',fitToParent:'fit'}} as unknown as Node,
        selected: true,
        focused: true
      }
    it('should be defined',()=>{
        expect(imagenodeview).toBeDefined();
    })

})
describe('Image view body',()=>{
    const mockSchema = new Schema({
        nodes: {
          doc: { content: 'image' },
          text: {},
          image: {
            inline: true,
            attrs: {
              align: { default: 'left' },
              fitToParent: { default: true }
            },
            group: 'inline',
            draggable: true,
            parseDOM: [{
              tag: 'img[src]',
              getAttrs(dom:any) {
                return {
                    align: dom.getAttribute('align'),
                    fitToParent: dom.getAttribute('fitToParent')
                };
              }
            }],
            toDOM(node) {
              return ['img', { src: node.attrs.src,align: node.attrs.align ||''}];
            }
          }
        }
      });
      //const content = DOMParser.fromSchema(schema).parse(document.createElement('div').appendChild(document.createElement('img')));
      const editorState = EditorState.create({
        schema:mockSchema,
        plugins: []
      });
      const el = document.createElement('div')
      const mockEditorView = {
        state:editorState,
        dispatch: jest.fn(),
        posAtCoords: ({left,
          top})=>{return {
            pos: 1,
            inside: 1,
          }},
        destroy: jest.fn(),
        dom:el
      };
      const editorfocused = {
        focused: true,
        runtime: {},
        readOnly: true,
        ...mockEditorView
      } as unknown as EditorFocused;

      const mockImageNode = Node.fromJSON(mockSchema,{
        type: 'image',
        attrs: {
          align:'left',
          fitToParent:'fit'
        }
      }) as unknown as Node
    const imageviewbody = new ImageViewBody( mockImageNode,editorfocused);
    imageviewbody.props = {
        decorations: [],
        editorView: editorfocused,
        getPos: () => 1,
        node: {attrs:{ align:'left',fitToParent:'fit'}} as unknown as Node,
        selected: true,
        focused: true
      }
      imageviewbody._inlineEditor = {close:()=>{}}
    it('should be defined',()=>{
        expect(imageviewbody).toBeDefined();
    })

    it('should handle componentWillUnmount',()=>{
        const spy = jest.spyOn(imageviewbody._inlineEditor,'close');
        imageviewbody.componentWillUnmount()
        expect(spy).toHaveBeenCalled();
    })
    it('should handle componentDidUpdate',()=>{

        const spy = jest.spyOn(imageviewbody,'_resolveOriginalSize');
        imageviewbody.componentDidUpdate( {
            decorations: [],
            editorView: editorfocused,
            getPos: () => 1,
            node: {attrs:{ src:'test'}} as unknown as Node,
            selected: true,
            focused: true
          })
        expect(spy).toHaveBeenCalled();
    })
    it('should handle render',()=>{

        const spy = jest.spyOn(imageviewbody,'_resolveOriginalSize');
        imageviewbody.state = {
            maxSize: {
              width: 10000,
              height: 10000,
              complete: false,
            },
            originalSize: {
                src: '',
                complete: true,
                height: 10000,
                width: 10000
            }
          };
        imageviewbody.props =  {
            decorations: [],
            editorView: editorfocused,
            getPos: () => 1,
            node: {attrs:{ src:'test',align:"left", crop:{width:100001}, rotate:'left',width:100001, height:10,fitToParent:true}} as unknown as Node,
            selected: true,
            focused: true
          }
        expect(imageviewbody.render()).toBeDefined();
    })
    it('should handle render',()=>{

        const spy = jest.spyOn(imageviewbody,'_resolveOriginalSize');
        imageviewbody.state = {
            maxSize: {
              width: 10000,
              height: 10000,
              complete: false,
            },
            originalSize: {
                src: '',
                complete: true,
                height: 10000,
                width: 10000
            }
          };
        imageviewbody.props =  {
            decorations: [],
            editorView: editorfocused,
            getPos: () => 1,
            node: {attrs:{ src:'test',align:"left", crop:{width:100001,heigt:10,left:10,top:10}, rotate:'left',width:100001, height:10,fitToParent:true}} as unknown as Node,
            selected: true,
            focused: true
          }
        expect(imageviewbody.render()).toBeDefined();
    })

    it('should handle isUnaltered when !crop and !rotate',()=>{
        expect(imageviewbody.isUnaltered(true,null,null)).toBeTruthy();
    })

    it('should handle calcWidthAndHeight when !height',()=>{
        expect(imageviewbody.calcWidthAndHeight(10,null,5,2)).toStrictEqual({width:10,height:2});
    })
    it('should handle calcWidthAndHeight when !height',()=>{
        expect(imageviewbody.calcWidthAndHeight(null,10,5,2)).toStrictEqual({width:50,height:10});
    })

    it('should handle _renderInlineEditor',()=>{
       //const spy2 = jest.spyOn(imageviewbody._inlineEditor,'close');
        const elem = document.createElement('div')
        elem.innerHTML = ``
        const spy = jest.spyOn(document,'getElementById').mockReturnValue(elem);

        
        expect(imageviewbody._renderInlineEditor()).toBeUndefined();
        spy.mockRestore();
    })
    it('should handle _renderInlineEditor',()=>{
        //const spy2 = jest.spyOn(imageviewbody._inlineEditor,'close');
         const elem = document.createElement('div')
         elem.setAttribute('data-active','true')
         const spy = jest.spyOn(document,'getElementById').mockReturnValue(elem);
         
         expect(imageviewbody._renderInlineEditor()).toBeUndefined();
     })
     it('should handle _renderInlineEditor else statement',()=>{
        imageviewbody._inlineEditor = {update:()=>{}};
         const elem = document.createElement('div')
         elem.setAttribute('data-active','true')
         const spy = jest.spyOn(document,'getElementById').mockReturnValue(elem);
         
         expect(imageviewbody._renderInlineEditor()).toBeUndefined();
     })
     it('should handle _onResizeEnd ',()=>{
        
        const mockSchema = new Schema({
            nodes: {
              doc: { content: "block+" },
              paragraph: { content: "inline*", group: "block" },
              text: { group: "inline" },
              image: { inline: true, attrs: { align:{default:null},
              fitToParent:{default:null}}, group: "inline" }, // Define your custom node type
            },
            marks: {},
          });;
          //const content = DOMParser.fromSchema(schema).parse(document.createElement('div').appendChild(document.createElement('img')));
          const editorState = EditorState.create({
            doc: mockSchema.nodeFromJSON({
                type: "doc",
                content: [
                  {
                    type: "paragraph",
                    content: [
                        {
                            type: "image",
                            attrs: {
                              src: "/path/to/image.jpg",
                            },
                          },
                
                    ],
                  },
                ],
              }),
              schema: mockSchema,
          });
          //const mockTr = editorState.tr.insertText("Hello world", 0, 5);
          
          const el = document.createElement('div')
          const mockEditorView = {
            state:editorState,
            dispatch: jest.fn(),
            posAtCoords: ({left,
              top})=>{return {
                pos: 1,
                inside: 1,
              }},
            destroy: jest.fn(),
            dom:el
          };
          const editorfocused = {
            focused: true,
            runtime: {},
            readOnly: true,
            ...mockEditorView
          } as unknown as EditorFocused;
    
          const mockImageNode = Node.fromJSON(mockSchema,{
            type: 'image',
            attrs: {
              align:'left',
              fitToParent:'fit'
            }
          }) as unknown as Node
        const imageviewbody = new ImageViewBody( mockImageNode,editorfocused);
        imageviewbody.props = {
            decorations: [],
            editorView: editorfocused,
            getPos: () => 1,
            node: {attrs:{ align:'left',fitToParent:'fit'}} as unknown as Node,
            selected: true,
            focused: true
          }
          imageviewbody._inlineEditor = {close:()=>{}}
         expect(imageviewbody._onResizeEnd(10,20)).toBeUndefined();
     })

     it('should handle _onChange  ',()=>{
        
        const mockSchema = new Schema({
            nodes: {
              doc: { content: "block+" },
              paragraph: { content: "inline*", group: "block" },
              text: { group: "inline" },
              image: { inline: true, attrs: { align:{default:null},
              fitToParent:{default:null}}, group: "inline" }, // Define your custom node type
            },
            marks: {},
          });;
          //const content = DOMParser.fromSchema(schema).parse(document.createElement('div').appendChild(document.createElement('img')));
          const editorState = EditorState.create({
            doc: mockSchema.nodeFromJSON({
                type: "doc",
                content: [
                  {
                    type: "paragraph",
                    content: [
                        {
                            type: "image",
                            attrs: {
                              src: "/path/to/image.jpg",
                            },
                          },
                
                    ],
                  },
                ],
              }),
              schema: mockSchema,
          });
          //const mockTr = editorState.tr.insertText("Hello world", 0, 5);
          
          const el = document.createElement('div')
          const mockEditorView = {
            state:editorState,
            dispatch: jest.fn(),
            posAtCoords: ({left,
              top})=>{return {
                pos: 1,
                inside: 1,
              }},
            destroy: jest.fn(),
            dom:el
          };
          const editorfocused = {
            focused: true,
            runtime: {},
            readOnly: true,
            ...mockEditorView
          } as unknown as EditorFocused;
    
          const mockImageNode = Node.fromJSON(mockSchema,{
            type: 'image',
            attrs: {
              align:'left',
              fitToParent:'fit'
            }
          }) as unknown as Node
        const imageviewbody = new ImageViewBody( mockImageNode,editorfocused);
        imageviewbody.props = {
            decorations: [],
            editorView: editorfocused,
            getPos: () => 1,
            node: {attrs:{ align:'left',fitToParent:'fit'}} as unknown as Node,
            selected: true,
            focused: true
          }
          imageviewbody._inlineEditor = {close:()=>{}}
         expect(imageviewbody._onChange({align:'left'})).toBeUndefined();
         imageviewbody._mounted = true;
         expect(imageviewbody._onChange({align:'left'})).toBeUndefined();
         expect(imageviewbody._onChange(null)).toBeUndefined();
     })

     it('should handle _onBodyRef ',()=>{
        imageviewbody._body =document.createElement('div');
        const spy = jest.spyOn(ResizeObserver,'unobserve');
        imageviewbody._onBodyRef(null);
        expect(spy).toHaveBeenCalled();
     })

     it('should handle _onBodyResize  ',()=>{
        imageviewbody._body =document.createElement('div');
        
        const ivb = imageviewbody._onBodyResize({
            target: document.createElement('div'),
            contentRect:{
                x: 1,
                y: 2,
                width: 3,
                height: 4,
                top: 5,
                right: 6,
                bottom: 7,
                left: 8
              }
          });
        expect(ivb).toBeUndefined();
     })
     it('should handle _onBodyResize  ',()=>{
        imageviewbody._body =document.createElement('div');
        
        const ivb = imageviewbody._onBodyResize({
            target: document.createElement('div'),
            contentRect:{
                x: 1,
                y: 2,
                width: 3,
                height: 4,
                top: 5,
                right: 6,
                bottom: 7,
                left: 8
              }
          });
        expect(ivb).toBeUndefined();
     })
     it('should handle _onBodyResize branch coverage',()=>{
        imageviewbody._body = null
        
        const ivb = imageviewbody._onBodyResize({
            target: document.createElement('div'),
            contentRect:{
                x: 1,
                y: 2,
                width: 3,
                height: 4,
                top: 5,
                right: 6,
                bottom: 7,
                left: 8
              }
          });
        expect(ivb).toBeUndefined();
     })





})
// describe('isActive',()=>{
//     it('should handle isActive',()=>{
//         expect(isActive(null,{},null,{complete:'test'})).toBeTruthy();
//     })
// })