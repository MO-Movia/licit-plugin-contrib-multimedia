import {EditorState} from 'prosemirror-state';
import {builders} from 'prosemirror-test-builder';
import Enzyme from 'enzyme';
import Adapter from '@cfaester/enzyme-adapter-react-18';
import {schema} from 'jest-prosemirror';
import {MultimediaPlugin} from '../index';
import {Icon} from './Icon';

Enzyme.configure({adapter: new Adapter()});

describe('initialize icon', () => {
  const plugin = new MultimediaPlugin();
  const effSchema = plugin.getEffectiveSchema(schema);
  const {doc, p} = builders(effSchema, {p: {nodeType: 'paragraph'}});

  const state = EditorState.create({
    doc: doc(p('Hello World!!')),
    schema: schema,
  });
  state.plugins.concat([plugin]);

  const props = {type: 'type', title: 'title'};
  const icon = new Icon(props);
  it('should handle Icon ', () => {
    expect(icon).toBeDefined();
  });

  it('should handle Icon ', () => {
    expect(icon.render()).toBeDefined();
  });

  test.each(['superscript', 'subscript', undefined])('should handle Icon type', type => {
    const props = {type, title: 'title'};
    const icon = new Icon(props);
    expect(icon.render()).toBeDefined();
  });
});
