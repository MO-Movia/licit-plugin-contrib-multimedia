
import VideoSourceCommand, { insertIFrame } from './VideoSourceCommand';
import VideoUploadEditor from './ui/VideoUploadEditor';
import type { EditorVideoRuntime } from './Types';
import VideoUploadCommand from './VideoUploadCommand';
import { EditorState, Selection } from 'prosemirror-state';
import { schema } from 'prosemirror-schema-basic';
import { EditorView } from 'prosemirror-view';

import { Node } from 'prosemirror-model';
import { MultimediaPlugin } from '..';
import { createEditor, doc, p } from 'jest-prosemirror';
// Mock data
const content = [
    {
        type: 'paragraph',
        content: [{ type: 'text', text: 'Hello World!' }],
    },
];

const plugin = new MultimediaPlugin();
const editor = createEditor(doc(p('<cursor>')), {
    plugins: [plugin],
});
const editorState = EditorState.create({
    schema: schema,
    selection: editor.selection,
    plugins: [new MultimediaPlugin()],
});

// Mock ProseMirror editor view
const mockEditorView = new EditorView(document.createElement('div'), {
    state: editorState,
});
const dummyEditorview = {
    focused: true,
    runtime: undefined,
    readOnly: false,
    state: editorState,
    dispatch: jest.fn(),
    update: jest.fn(),



    dom: document.createElement('div'),

    focus: jest.fn(),
    hasFocus: jest.fn(),

}
describe('video upload command', () => {
    const videouploadcommand = new VideoUploadCommand();
    it('should be defined ', () => {
        expect(videouploadcommand).toBeDefined();
    })
    it('should handle isEnabled  ', () => {
        expect(videouploadcommand.isEnabled(editorState)).toBeFalsy();
    })
    it('should handle isEnabled when view is present  ', () => {
        expect(videouploadcommand.isEnabled(editorState,dummyEditorview as unknown as EditorView)).toBeFalsy();
    })
    it('should handle isEnabled when  !canUploadVideo  ', () => {
        const dummyEditorview = {
            focused: true,
            runtime: {},
            readOnly: false,
            state: editorState,
            dispatch: jest.fn(),
            update: jest.fn(),
            dom: document.createElement('div'),
            focus: jest.fn(),
            hasFocus: jest.fn(),
        }
        expect(videouploadcommand.isEnabled(editorState,dummyEditorview as unknown as EditorView)).toBeFalsy();
    })
    it('should handle isEnabled when  !uploadVideo ', () => {
        const dummyEditorview = {
            focused: true,
            runtime: {canUploadVideo:()=>{}},
            readOnly: false,
            state: editorState,
            dispatch: jest.fn(),
            update: jest.fn(),
            dom: document.createElement('div'),
            focus: jest.fn(),
            hasFocus: jest.fn(),
        }
        expect(videouploadcommand.isEnabled(editorState,dummyEditorview as unknown as EditorView)).toBeFalsy();
    })
    it('should handle isEnabled when !canUploadVideo and uploadVideo ', () => {
        const dummyEditorview = {
            focused: true,
            runtime: {uploadVideo:()=>{}},
            readOnly: false,
            state: editorState,
            dispatch: jest.fn(),
            update: jest.fn(),
            dom: document.createElement('div'),
            focus: jest.fn(),
            hasFocus: jest.fn(),
        }
        expect(videouploadcommand.isEnabled(editorState,dummyEditorview as unknown as EditorView)).toBeFalsy();
    })
    it('should handle isEnabled when !canUploadVideo and uploadVideo ', () => {
        const dummyEditorview = {
            focused: true,
            runtime: {uploadVideo:()=>{},canUploadVideo:()=>{}},
            readOnly: false,
            state: editorState,
            dispatch: jest.fn(),
            update: jest.fn(),
            dom: document.createElement('div'),
            focus: jest.fn(),
            hasFocus: jest.fn(),
        }
        expect(videouploadcommand.isEnabled(editorState,dummyEditorview as unknown as EditorView)).toBeFalsy();
    })
    it('should handle isEnabled when canUploadVideo and uploadVideo ', () => {
        const dummyEditorview = {
            focused: true,
            runtime: {uploadVideo:()=>true,canUploadVideo:()=>true},
            readOnly: false,
            state: editorState,
            dispatch: jest.fn(),
            update: jest.fn(),
            dom: document.createElement('div'),
            focus: jest.fn(),
            hasFocus: jest.fn(),
        }
        expect(videouploadcommand.isEnabled(editorState,dummyEditorview as unknown as EditorView)).toBeTruthy();
    })
})