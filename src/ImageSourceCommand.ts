

import { Fragment, Schema } from 'prosemirror-model';
import { EditorState, Transaction ,TextSelection} from 'prosemirror-state';
import { Transform } from 'prosemirror-transform';
import { EditorView } from 'prosemirror-view';
import * as React from 'react';
import {
  hideCursorPlaceholder,
  showCursorPlaceholder,
} from './CursorPlaceholderPlugin';
import { UICommand } from '@modusoperandi/licit-doc-attrs-step';
import { createPopUp } from '@modusoperandi/licit-ui-commands';

import type { ImageLike } from './Types';

const IMAGE = 'image';

export function insertImage(tr: Transform, schema: Schema, src: string): Transform {
  const { selection } = tr as Transaction;
  if (!selection) {
    return tr;
  }
  const { from, to } = selection;
  if (from !== to) {
    return tr;
  }

  const image = schema.nodes[IMAGE];
  if (!image) {
    return tr;
  }

  const attrs = {
    src: src || '',
    alt: '',
    title: '',
  };

  const node = image.create(attrs, null, null);
  const frag = Fragment.from(node);
  tr = tr.insert(from, frag);
  return tr;
}

class ImageSourceCommand extends UICommand {
  _popUp = null;

  getEditor(): typeof React.Component {
    throw new Error('Not implemented');
  }

  isEnabled = (state: EditorState, view: EditorView): boolean => {
    return this.__isEnabled(state, view);
  };


  isPopUp(popup) {
    if (popup) {
      return true;
    }
    else { return false; }
  }
  waitForUserInput = (
    state: EditorState,
    dispatch: (tr: Transform) => void,
    view: EditorView,
    _event?: React.SyntheticEvent
  ): Promise<unknown> => {
    if (this.isPopUp(this._popUp)) {
      return Promise.resolve(undefined);
    }

    if (dispatch) {
      dispatch(showCursorPlaceholder(state));
    }

    return new Promise((resolve) => {
      const props = { runtime: view ? view['runtime'] : null };
      this._popUp = createPopUp(this.getEditor(), props, {
        modal: true,
        onClose: (val) => {
          if (this._popUp) {
            this._popUp = null;
            resolve(val);
          }
        },
      });
    });
  };

  executeWithUserInput = (
    state: EditorState,
    dispatch: (tr: Transform) => void,
    view: EditorView,
    inputs: ImageLike
  ): boolean => {
    if (dispatch) {
      const { selection, schema } = state;
      let { tr } = state;
      tr = view ? hideCursorPlaceholder(view.state) as Transaction: tr;
      tr = tr.setSelection(selection);
      if (inputs) {
        const { src } = inputs;
        tr = insertImage(tr, schema, src) as Transaction;
      }
      dispatch(tr);
      view && view.focus();
    }

    return false;
  };

  __isEnabled = (state: EditorState, _view: EditorView): boolean => {
    const tr = state;
    const { selection } = tr;
    if (selection instanceof TextSelection) {
      return selection.from === selection.to;
    }
    return true;
  };
}

export default ImageSourceCommand;
