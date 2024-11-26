import {Node} from 'prosemirror-model';
import {Decoration, EditorView, NodeView} from 'prosemirror-view';
import React from 'react';
import ReactDOM from 'react-dom';
import {EditorVideoRuntime} from '../Types';

import {SelectionObserver} from './SelectionObserver';

export type EditorFocused = EditorView & {
  focused: boolean;
  runtime: EditorVideoRuntime;
  readOnly?: boolean;
};
export type NodeViewProps = {
  decorations: Array<Decoration>;
  editorView: EditorFocused;
  getPos: () => number;
  node: Node;
  selected: boolean;
  focused: boolean;
};

// Standard className for selected node.
const SELECTED_NODE_CLASS_NAME = 'ProseMirror-selectednode';

const mountedViews = new Set<CustomNodeView>();
const pendingViews = new Set<CustomNodeView>();

export function onMutation(_mutations, observer: MutationObserver): void {
  const root = document.body;
  if (!root) {
    return;
  }

  const mountingViews = [];
  for (const view of pendingViews) {
    const el = view.dom;
    if (root.contains(el)) {
      pendingViews.delete(view);
      mountingViews.push(view);
      view.__renderReactComponent();
    }
  }

  for (const view of mountedViews) {
    const el: Element = view.dom;
    if (!root.contains(el)) {
      mountedViews.delete(view);
      ReactDOM.unmountComponentAtNode(el);
    }
  }

  mountingViews.forEach((view) => mountedViews.add(view));

  if (mountedViews.size === 0) {
    observer.disconnect();
  }
}

// Workaround to get in-selection views selected.
// See https://discuss.prosemirror.net/t/copy-selection-issue-with-the-image-node/1673/2;
export function onSelection(_entries: [], observer: SelectionObserver): void {
  if (!window.getSelection) {
    console.warn('window.getSelection() is not supported');
    observer.disconnect();
    return;
  }

  const selection = window.getSelection();
  if (!selection?.containsNode) {
    console.warn('selection.containsNode() is not supported');
    observer.disconnect();
    return;
  }

  for (const view of mountedViews) {
    const el = view.dom;
    if (selection.containsNode(el)) {
      view.selectNode();
    } else {
      view.deselectNode();
    }
  }

  if (mountedViews.size === 0) {
    observer.disconnect();
  }
}

const selectionObserver = new SelectionObserver(onSelection);
const mutationObserver = new MutationObserver(onMutation);

// This implements the `NodeView` interface and renders a Node with a react
// Component.
// https://prosemirror.net/docs/ref/#view.NodeView
// https://github.com/ProseMirror/prosemirror-view/blob/master/src/viewdesc.js#L429
export class CustomNodeView implements NodeView {
  dom: HTMLElement;
  _onClick: () => void;
  props: NodeViewProps;

  _selected: boolean;

  constructor(
    node: Node,
    editorView: EditorFocused,
    getPos: () => number,
    decorations: Array<Decoration>
  ) {
    this.props = {
      decorations,
      editorView,
      getPos,
      node,
      selected: false,
      focused: false,
    };

    pendingViews.add(this);

    // The editor will use this as the node's DOM representation
    const dom = this.createDOMElement();
    this.dom = dom;
    dom.onclick = this._onClick;

    if (pendingViews.size === 1) {
      // [FS] IRAD-1060 2020-09-10
      // Observe the editorview's dom insteadof root document so that
      // if multiple instances of editor in a page shouldn't cross-talk
      mutationObserver.observe(/*document*/ editorView.dom, {
        childList: true,
        subtree: true,
      });
      selectionObserver.observe(/*document*/ editorView.dom);
    }
  }

  update(node: Node, _decorations: Array<Decoration>): boolean {
    this.props = {
      ...this.props,
      node,
    };
    this.__renderReactComponent();
    return true;
  }

  stopEvent(): boolean {
    return false;
  }

  // Mark this node as being the selected node.
  selectNode(): void {
    this._selected = true;
    this.dom.classList.add(SELECTED_NODE_CLASS_NAME);
    this.__renderReactComponent();
  }

  // Remove selected node marking from this node.
  deselectNode(): void {
    this._selected = false;
    this.dom.classList.remove(SELECTED_NODE_CLASS_NAME);
    this.__renderReactComponent();
  }

  // This should be overwrite by subclass.
  createDOMElement(): HTMLElement {
    // The editor will use this as the node's DOM representation.
    // return document.createElement('span');
    throw new Error('not implemented');
  }

  // This should be overwrite by subclass.
  renderReactComponent(): React.ReactElement {
    throw new Error('not implemented');
  }

  destroy(): void {
    // Called when the node view is removed from the editor or the whole
    // editor is destroyed.
    // sub-class may override this method.
    // [FS] IRAD-1555 2021-09-13
    // When destroying the node view, remove from the set.
    // FIX: This solves the image missing issue.
    pendingViews.delete(this);
  }

  __renderReactComponent(callback?: () => void): void {
    const {editorView, getPos} = this.props;

    if (editorView?.state?.selection) {
      const {from} = editorView.state.selection;
      const pos = getPos();
      this.props.selected = this._selected;
      this.props.focused = editorView.focused && pos === from;
    } else {
      this.props.selected = false;
      this.props.focused = false;
    }

    ReactDOM.render(this.renderReactComponent(), this.dom, callback);
  }
}
