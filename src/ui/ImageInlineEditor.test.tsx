
import ImageInlineEditor from './ImageInlineEditor';
import { EditorState, TextSelection, Plugin, PluginKey, Transaction } from 'prosemirror-state';
import { Schema } from 'prosemirror-model';
import { schema } from 'prosemirror-test-builder';
import { MultimediaPlugin } from '..';
import { createEditor, doc, p } from 'jest-prosemirror';
import { EditorView } from 'prosemirror-view';
import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from '@cfaester/enzyme-adapter-react-18'; // or any other adapter for your version of React

Enzyme.configure({ adapter: new Adapter() });

describe('ImageInlineEditor', () => {
  const plugin = new MultimediaPlugin();
  const editor = createEditor(doc(p('<cursor>')), {
    plugins: [plugin],
  });
  const state: EditorState = EditorState.create({
    schema: schema,
    selection: editor.selection,
    plugins: [new MultimediaPlugin()],
  });
  const view1 = new EditorView(document.querySelector('#editor'), {
    state,
  });

  const imageInlineEditorValue = {
    align: 'align',
    src: 'test'
  };


  const props = { onSelect: (val) => { }, value: imageInlineEditorValue, editorView: view1 };
  const wrapper = shallow(<ImageInlineEditor {...props} />);
  //const imageinlineeditor = new ImageInlineEditor(props)  ;


  // it('should define',()=>{
  //   expect(wrapper).toMatchSnapshot();
  // })

  // it('should render',()=>{
  //   const plugin = new MultimediaPlugin();
  //   const editor = createEditor(doc(p('<cursor>')), {
  //     plugins: [plugin],
  //   });
  //       const state: EditorState = EditorState.create({
  //           schema: schema,
  //           selection: editor.selection,
  //           plugins: [new MultimediaPlugin()],
  //         });
  //         const view1 = new EditorView(document.querySelector('#editor'), {
  //           state,
  //         });

  //       const imageInlineEditorValue ={align: 'align',
  //       src:'test'};


  //       const props = {onSelect:(val)=>{},value:imageInlineEditorValue,editorView:view1}
  //       const wrapper = shallow(<ImageInlineEditor {...props} />);
  //     //const imageinlineeditor = new ImageInlineEditor(props)  ;
  //   expect(wrapper.render()).toBeDefined();
  // })

  it('should render', () => {
    const imageinlineeditor = new ImageInlineEditor((val) => { }, imageInlineEditorValue);
    expect(imageinlineeditor).toBeDefined();
  });
  it('should render', () => {
    const imageinlineeditor = new ImageInlineEditor((val) => { }, imageInlineEditorValue);
    imageinlineeditor.props = {
      onSelect: () => { }, value: {
        align: '',
        src: 'test'
      },
      editorView: view1
    };

    expect(imageinlineeditor.render()).toBeDefined();
  });

  it('should handle parseLabel when input ""', () => {
    const imageinlineeditor = new ImageInlineEditor((val) => { }, imageInlineEditorValue);
    expect(imageinlineeditor.parseLabel('')).toStrictEqual({
      'icon': null,
      'title': null,
    });
  });

  it('should handle _onClick ', () => {
    const imageinlineeditor = new ImageInlineEditor((val) => { }, imageInlineEditorValue);
    imageinlineeditor.props = {
      onSelect: (val) => val.align, value: {
        align: '',
        src: 'test'
      },
      editorView: view1
    };
 const spy = jest.spyOn(imageinlineeditor.props,'onSelect');
    imageinlineeditor._onClick ('align_test');
    expect(spy).lastReturnedWith('align_test');
  });
});