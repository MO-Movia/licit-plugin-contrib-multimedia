import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { render, screen } from '@testing-library/react';
import { builders } from 'prosemirror-test-builder';
import Enzyme, { shallow } from 'enzyme';
import Adapter from '@cfaester/enzyme-adapter-react-18';
import { doc, p, schema, strong } from 'jest-prosemirror';
import { MultimediaPlugin } from '../index';
import Icon from './Icon';

Enzyme.configure({ adapter: new Adapter() });

describe('initialize icon', () => {

    let wrapper;
    let capcoBuilder;

    const plugin = new MultimediaPlugin();
    const effSchema = plugin.getEffectiveSchema(schema);
    const { doc, p } = builders(effSchema, { p: { nodeType: 'paragraph' } });


    const state = EditorState.create({
        doc: doc(p('Hello World!!')),
        schema: schema,
    });
    state.plugins.concat([plugin]);
    const dom = document.createElement('div');

    const editorView = new EditorView(
        { mount: dom },
        {
            state: state,
        }
    );
    const props = {type:'type',title:'title'};
    const icon = new Icon(props);
    it('should handle Icon ',()=>{
        expect(icon).toBeDefined();
    });

    it('should handle Icon ',()=>{
        expect(icon.render()).toBeDefined();
    });
    it('should handle Icon when type is superscript',()=>{
        const props = {type:'superscript',title:'title'};
        const icon = new Icon(props);
        expect(icon.render()).toBeDefined();

    });
    it('should handle Icon when type is subscript',()=>{
        const props = {type:'subscript',title:'title'};
        const icon = new Icon(props);
        expect(icon.render()).toBeDefined();

    });
    it('should handle Icon when type is undefined',()=>{
        const props = {type:undefined,title:'title'};
        const icon = new Icon(props);
        expect(icon.render()).toBeDefined();

    });


});

