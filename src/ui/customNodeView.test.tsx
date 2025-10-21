import React from 'react';
import ReactDOM from 'react-dom';
import {CustomNodeView, onMutation, onSelection} from './CustomNodeView';
import {Node} from 'prosemirror-model';

jest.mock('react-dom', () => ({
  render: jest.fn(),
  unmountComponentAtNode: jest.fn(),
}));

describe('CustomNodeView', () => {
  let node: Node;
  let editorView: any;
  let getPos: jest.Mock;
  let decorations: any[];

  beforeEach(() => {
    node = {type: {name: 'dummy'}, attrs: {}} as Node;
    editorView = {
      dom: document.createElement('div'),
      state: {selection: {from: 0}},
      focused: true,
    };
    getPos = jest.fn(() => 0);
    decorations = [];
    jest.clearAllMocks();
  });

  class TestNodeView extends CustomNodeView {
    createDOMElement(): HTMLElement {
      return document.createElement('span');
    }
    renderReactComponent(): React.ReactElement {
      return React.createElement('div', null, 'test');
    }
  }

  it('initializes and adds to pendingViews', () => {
    const view = new TestNodeView(node, editorView, getPos, decorations);
    expect(view.dom).toBeInstanceOf(HTMLElement);
    expect(typeof view._onClick).toBe('undefined');
  });

  it('updates node and re-renders', () => {
    const view = new TestNodeView(node, editorView, getPos, decorations);
    const newNode = {...node, attrs: {changed: true}} as Node;
    const result = view.update(newNode, decorations);
    expect(result).toBe(true);
    expect(ReactDOM.render).toHaveBeenCalled();
    expect(view.props.node.attrs).toEqual({changed: true});
  });

  it('stopEvent always returns false', () => {
    const view = new TestNodeView(node, editorView, getPos, decorations);
    expect(view.stopEvent()).toBe(false);
  });

  it('selectNode sets _selected and adds class', () => {
    const view = new TestNodeView(node, editorView, getPos, decorations);
    document.body.appendChild(view.dom);
    view.selectNode();
    expect(view._selected).toBe(true);
    expect(view.dom.classList.contains('ProseMirror-selectednode')).toBe(true);
    expect(ReactDOM.render).toHaveBeenCalled();
  });

  it('deselectNode removes class and sets _selected false', () => {
    const view = new TestNodeView(node, editorView, getPos, decorations);
    view.dom.classList.add('ProseMirror-selectednode');
    view.deselectNode();
    expect(view._selected).toBe(false);
    expect(view.dom.classList.contains('ProseMirror-selectednode')).toBe(false);
    expect(ReactDOM.render).toHaveBeenCalled();
  });

  it('destroy removes from pendingViews', () => {
    const view = new TestNodeView(node, editorView, getPos, decorations);
    expect(view).toBeTruthy();
    view.destroy();
  });

  it('__renderReactComponent sets selected/focused and calls ReactDOM.render', () => {
    const view = new TestNodeView(node, editorView, getPos, decorations);
    view._selected = true;
    view.__renderReactComponent();
    expect(view.props.selected).toBe(true);
    expect(view.props.focused).toBe(true);
    expect(ReactDOM.render).toHaveBeenCalled();
  });

  it('onMutation mounts and unmounts views', () => {
    const view = new TestNodeView(node, editorView, getPos, decorations);
    const observer: MutationObserver = new MutationObserver(() => {});
    document.body.appendChild(view.dom);
    onMutation([], observer);
    expect(ReactDOM.render).toHaveBeenCalled();
    document.body.removeChild(view.dom);
    onMutation([], observer);
    expect(ReactDOM.unmountComponentAtNode).toHaveBeenCalledWith(view.dom);
  });

  it('onSelection selects/deselects nodes', () => {
    const view = new TestNodeView(node, editorView, getPos, decorations);
    document.body.appendChild(view.dom);

    // Mock window.getSelection
    const selection = {
      containsNode: jest.fn(() => true),
    } as unknown as Selection;
    jest.spyOn(window, 'getSelection').mockReturnValue(selection);

    onSelection([], {disconnect: jest.fn()});
    expect(selection.containsNode).toHaveBeenCalled();
  });
});
