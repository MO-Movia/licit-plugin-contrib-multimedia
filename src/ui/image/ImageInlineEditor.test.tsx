import {ImageInlineEditor} from './ImageInlineEditor';
import {
  EditorState,
} from 'prosemirror-state';
import {schema} from 'prosemirror-test-builder';
import {MultimediaPlugin} from '../index';
import {createEditor, doc, p} from 'jest-prosemirror';
import {EditorView} from 'prosemirror-view';
import React from 'react';
import Enzyme, {shallow} from 'enzyme';
import Adapter from '@cfaester/enzyme-adapter-react-18'; // or any other adapter for your version of React

Enzyme.configure({adapter: new Adapter()});
jest.mock('../../src/assets/theme_icons/dark/Icon_Multi-media.svg', () => 'Icon SVG content');
jest.mock('../../src/assets/theme_icons/light/Icon_Multi-media.svg', () => 'Icon SVG content');
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
    src: 'test',
  };

  const props = {
    onSelect: () => undefined,
    value: imageInlineEditorValue,
    editorView: view1,
  };
  const wrapper = shallow(<ImageInlineEditor {...props} />);

  it('should render', () => {
    expect(wrapper.instance()).toBeDefined();
    const imageinlineeditor = new ImageInlineEditor(
      () => undefined
    );
    expect(imageinlineeditor).toBeDefined();
  });
  it('should render', () => {
    const imageinlineeditor = new ImageInlineEditor(
      () => undefined
    );
    imageinlineeditor.props = {
      onSelect: () => undefined,
      value: {
        align: '',
        src: 'test',
      },
      editorView: view1,
    };

    expect(imageinlineeditor.render()).toBeDefined();
  });

  it('should handle parseLabel when input ""', () => {
    const imageinlineeditor = new ImageInlineEditor(
      () => undefined
    );
    expect(imageinlineeditor.parseLabel('')).toStrictEqual({
      icon: null,
      title: null,
    });
  });

  it('should handle _onClick ', () => {
    const imageinlineeditor = new ImageInlineEditor(
      () => undefined
    );
    imageinlineeditor.props = {
      onSelect: (val) => val.align,
      value: {
        align: '',
        src: 'test',
      },
      editorView: view1,
    };
    const spy = jest.spyOn(imageinlineeditor.props, 'onSelect');
    imageinlineeditor._onClick('align_test');
    expect(spy).lastReturnedWith('align_test');
  });
});
