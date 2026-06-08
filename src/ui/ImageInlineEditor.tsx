import { createPopUp, atAnchorTopCenter, PopUpHandle } from '@modusoperandi/licit-ui-commands';
import React from 'react';
import { Icon } from './Icon';
import { EditorView } from 'prosemirror-view';
import { TextSelection } from 'prosemirror-state';
import { CropImagePopup, CropDataPropValue } from './CropImagePopup';

export type PropValue = {
  value?: string;
  text?: string;
  label?: string;
};

const ICON_LABEL_PATTERN = /\[([A-Za-z_\d]+)\](.*)/;

type parseLabeltype = {
  icon: React.ReactNode;
  title: string | null;
};
type AddParaKey = 'ABOVE' | 'BELOW';
type ReplaceKey = 'FILE' | 'CLIPBOARD';
type AlignKey = 'LEFT' | 'CENTER' | 'RIGHT';
type FloatKey = 'FLOAT_LEFT' | 'FLOAT_RIGHT';
type AlterKey = 'DELETE' | 'CROP' | 'RESET_CROP';

const ImageParaValues: { [key in AddParaKey]: PropValue } = {
  ABOVE: {
    value: 'above',
    text: 'Insert Paragraph Above',
    label: '[north] Insert Paragraph Above',
  },
  BELOW: {
    value: 'below',
    text: 'Insert Paragraph Below',
    label: '[south] Insert Paragraph Below',
  }
};
const ImageReplaceValues: { [key in ReplaceKey]: PropValue } = {
  FILE: {
    value: 'file',
    text: 'File',
    label: '[folder_open] File',
  },
  CLIPBOARD: {
    value: 'clipboard',
    text: 'Clipboard',
    label: '[content_paste] Paste From Clipboard',
  }
};

const ImageAlignValues: { [key in AlignKey]: PropValue } = {
  LEFT: {
    value: 'left',
    text: 'Left',
    label: '[format_align_left] Left Align',
  },
  CENTER: {
    value: 'center',
    text: 'Center',
    label: '[format_align_center] Center Align',
  },
  RIGHT: {
    value: 'right',
    text: 'Right',
    label: '[format_align_right] Right Align',
  },
};
const ImageFloatValues: { [key in FloatKey]: PropValue } = {
  FLOAT_LEFT: {
    value: 'float-left',
    text: 'Float Left',
    label: '[format_textdirection_r_to_l] Left Align',
  },

  FLOAT_RIGHT: {
    value: 'float-right',
    text: 'Float Right',
    label: '[format_textdirection_l_to_r] Right Align',
  },
};
export const ImageAlterValues: { [key in AlterKey]: PropValue } = {

  DELETE: {
    value: 'delete',
    text: 'Delete',
    label: '[delete] ',
  },
  CROP: {
    value: 'crop',
    text: 'Crop',
    label: '[crop] ',
  },
  RESET_CROP: {
    value: 'reset-crop',
    text: 'Reset Crop',
    label: '[restore] Reset Crop',
  },
};
export type ImageInlineEditorValue = {
  align?: string;
  src?: string;
  cropData?: CropDataPropValue | null;
};
type ImageInlineProps = {
  onSelect: (val: ImageInlineEditorValue) => void;
  value: ImageInlineEditorValue;
  editorView?: EditorView;
  getPos?: () => number;
  imageId?: string;
};

type MenuItemConfig = {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
  active?: boolean;
  disabled?: boolean;
};

function HamburgerMenuDropdownView({
  menuItems,
}: {
  menuItems: MenuItemConfig[];
}): React.ReactElement {
  return React.createElement(
    'div',
    { className: 'enhanced-table-hamburger-menu' },
    ...menuItems.map((item) =>
      React.createElement(
        'button',
        {
          key: item.id,
          className: `enhanced-table-hamburger-menu-item${item.active ? ' active' : ''}`,
          'data-id': item.id,
          disabled: item.disabled ?? false,
          type: 'button',
          onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            e.stopPropagation();
            if (!item.disabled) {
              item.action();
            }
          },
        },
        React.createElement('span', { className: 'enhanced-table-hamburger-menu-icon' }, item.icon),
        React.createElement('span', { className: 'enhanced-table-hamburger-menu-label' }, item.label)
      )
    )
  );
}

export class ImageInlineEditor extends React.PureComponent<
  ImageInlineProps
> {
  declare props: ImageInlineProps;
  _buttonEl?: HTMLButtonElement | null;
  _menuHandle?: PopUpHandle | null;

  componentWillUnmount(): void {
    this._closeMenu();
  }

  render(): React.ReactNode {
    return (
      <div className="molm-czi-inline-editor molm-czi-inline-editor-hamburger">
        <button
          aria-label="Image options"
          className="molm-czi-inline-editor-toggle figure-select-hamburger"
          onClick={this._toggleMenu}
          onMouseDown={this._stopEvent}
          ref={this._onButtonRef}
          type="button"
        >
          &#9776;
        </button>
      </div>
    );
  }

  prepMenuItems(ImgValues, align): MenuItemConfig[] {
    const { editorView } = this.props;
    if (
      ImgValues === ImageAlterValues ||
      ImgValues === ImageParaValues ||
      ImgValues === ImageReplaceValues
    ) {
      return Object.keys(ImgValues).map((key) => {
        const { text, label } = ImgValues[key];
        const { icon } = this.parseLabel(label);

        const handler =
          {
            ABOVE: this.insertParagraphAbove,
            BELOW: this.insertParagraphBelow,
            FILE: this.handleChooseFile.bind(this),
            CLIPBOARD: this.handlePasteFromClipboard.bind(this),
            DELETE: this._onRemove,
            RESET_CROP: this._onResetCrop,
          }[key] ?? this._onCrop;

        const hasCropData = !!this.props.value?.cropData;

        return {
          id: String(ImgValues[key].value || key),
          label: text,
          icon,
          disabled:
            !editorView ||
            (key === 'RESET_CROP' && !hasCropData),
          action: () => {
            this._closeMenu();

            if (editorView) {
              if (key === 'CROP') {
                window.setTimeout(() => handler(editorView), 0);
              } else {
                handler(editorView);
              }
            }
          },
        };
      });
    }
    // React.createElement('span', { className: 'enhanced-table-hamburger-menu-icon' }, item.icon),
    return Object.keys(ImgValues).map((key) => {
      const { value, text, label } = ImgValues[key];
      const { icon } = this.parseLabel(label, value);
      return {
        id: String(value || key),
        label: text,
        icon,
        active: align === value,
        action: () => {
          if (value) {
            this._onClick(value);
          }
          this._closeMenu();
        },
      };
    });
  }

  parseLabel(input: string, value?: string): parseLabeltype {
    const matched = RegExp(ICON_LABEL_PATTERN).exec(input);
    if (matched) {
      const icon = matched[1];
      const label = matched[2];
      if (value) {
        const klass = 'molm-custom-align-icon-' + value;
        return {
          icon: <span className={klass}>{value}</span>,
          title: label || null,
        };
      }
      return {
        icon: icon ? Icon.get(icon) : null,
        title: label || null,
      };
    }
    return {
      icon: null,
      title: input || null,
    };
  }

  _onClick = (align?: string) => {
    if (this._setImageAttrs({ align })) {
      return;
    }

    this.props.onSelect({ align: align });
  };

  _onButtonRef = (ref?: HTMLButtonElement | null): void => {
    this._buttonEl = ref;
  };

  _stopEvent = (e: React.MouseEvent): void => {
    e.preventDefault();
    e.stopPropagation();
  };

  _toggleMenu = (e: React.MouseEvent): void => {
    e.preventDefault();
    e.stopPropagation();

    if (this._menuHandle) {
      this._closeMenu();
      return;
    }

    const align = this.props.value ? this.props.value.align : null;
    const menuItems = [
      ...this.prepMenuItems(ImageParaValues, align),
      ...this.prepMenuItems(ImageReplaceValues, align),
      ...this.prepMenuItems(ImageAlignValues, align),
      ...this.prepMenuItems(ImageFloatValues, align),
      ...this.prepMenuItems(ImageAlterValues, align),
    ];

    this._menuHandle = createPopUp(
      HamburgerMenuDropdownView,
      { menuItems },
      {
        anchor: this._buttonEl || undefined,
        autoDismiss: true,
        onClose: () => {
          this._menuHandle = null;
        },
      }
    );
  };

  _closeMenu = (): void => {
    this._menuHandle?.close?.(undefined);
    this._menuHandle = null;
  };

  _onAlter = (): void => {
    //Handle Edit
  };

  _getImageNodeContext = (view: EditorView): { pos: number; node } | null => {
    let pos: number | undefined;
    try {
      pos = this.props.getPos?.();
    } catch {
      pos = undefined;
    }

    if (pos != null) {
      const node = view.state.doc.nodeAt(pos);
      if (node?.type?.name === 'image') {
        return { pos, node };
      }
    }

    const { selection } = view.state;
    const selectedNode = (selection as { node?: { type?: { name?: string } } }).node;
    if (selectedNode?.type?.name === 'image') {
      return { pos: selection.from, node: selectedNode };
    }

    const node = view.state.doc.nodeAt(selection.from);
    if (node?.type?.name === 'image') {
      return { pos: selection.from, node };
    }

    return null;
  };

  _setImageAttrs = (attrs: Record<string, unknown>): boolean => {
    const { editorView } = this.props;
    if (!editorView) {
      return false;
    }

    const imageContext = this._getImageNodeContext(editorView);
    if (!imageContext) {
      return false;
    }

    const { pos, node } = imageContext;
    const tr = editorView.state.tr.setNodeMarkup(pos, null, {
      ...node.attrs,
      ...attrs,
    });
    editorView.dispatch(tr);
    return true;
  };

  _onRemove = (view?: EditorView): void => {
    if (!view) {
      return;
    }

    const imageContext = this._getImageNodeContext(view);
    if (!imageContext) {
      return;
    }

    const { pos, node } = imageContext;
    const tr = view.state.tr.delete(pos, pos + node.nodeSize);
    view.dispatch(tr);
  };

  _onResetCrop = (view?: EditorView): void => {
    if (!view) {
      return;
    }

    this._setImageAttrs({ cropData: null });
  };

  _onCrop = (view?: EditorView): void => {
    if (!view) {
      return;
    }

    const imageContext = this._getImageNodeContext(view);
    if (!imageContext) {
      return;
    }

    const { pos, node } = imageContext;

    const src = node.attrs.src;

    const popupHandle = createPopUp(
      CropImagePopup,
      {
        src,
        position: atAnchorTopCenter,
        onConfirm: (cropData: CropDataPropValue) => {
          const tr = view.state.tr.setNodeMarkup(pos, null, {
            ...node.attrs,
            cropData,
          });
          if (popupHandle) {
            popupHandle.close(cropData);
          }
          view.dispatch(tr);
        },
        onCancel: () => {
          if (popupHandle) {
            popupHandle.close(null);
          }
        },
        defaultUnit: 'px',
      },
      {
        anchor: this._buttonEl || document.body,
        autoDismiss: false,
      }
    );
  };

  insertParagraphAbove = (view?: EditorView): void => {
    if (!view) {
      return;
    }

    const imageContext = this._getImageNodeContext(view);
    if (!imageContext) {
      return;
    }
    const { state, dispatch } = view;
    const { schema } = state;
    const { pos } = imageContext;
    // Create empty paragraph node
    const paragraph = schema.nodes.paragraph.create();

    // Insert at the node position
    let tr = state.tr.insert(pos, paragraph);

    // Set cursor in the new paragraph
    const resolvedPos = tr.doc.resolve(pos + 1);
    tr = tr.setSelection(TextSelection.create(tr.doc, resolvedPos.pos));

    dispatch(tr);
  };

  insertParagraphBelow = (view?: EditorView): void => {
    if (!view) {
      return;
    }

    const imageContext = this._getImageNodeContext(view);
    if (!imageContext) {
      return;
    }
    const { state, dispatch } = view;
    const { schema } = state;
    const { pos } = imageContext;
    // Create empty paragraph node
    const paragraph = schema.nodes.paragraph.create();

    // Calculate position after the figure
    const posAfterNode = pos + imageContext.node.nodeSize;

    // Insert after the node
    let tr = state.tr.insert(posAfterNode, paragraph);

    // Set cursor in the new paragraph
    const resolvedPos = tr.doc.resolve(posAfterNode + 1);
    tr = tr.setSelection(TextSelection.create(tr.doc, resolvedPos.pos));

    dispatch(tr);
  };
  handleChooseFile = (view?: EditorView): void => {
    // Open file chooser dialog
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';

    fileInput.onchange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];

      if (file) {
        // Handle file selection
        const reader = new FileReader();
        reader.onload = (e) => {
          const src = e.target?.result as string;
          if (src) {
            this.updateImageSource(src, view);
          }
        };
        reader.readAsDataURL(file);
      }
    };

    fileInput.click();
  };

  handlePasteFromClipboard = (view?: EditorView): void => {
    // Read image from clipboard
    if (!navigator.clipboard?.read) {
      console.error('Clipboard API not available');
      return;
    }

    navigator.clipboard.read().then((clipboardItems) => {
      for (const clipboardItem of clipboardItems) {
        const imageTypes = clipboardItem.types.filter((type) => type.startsWith('image/'));
        if (imageTypes.length > 0) {
          clipboardItem.getType(imageTypes[0]).then((blob) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              const src = e.target?.result as string;
              if (src) {
                this.updateImageSource(src, view);
              }
            };
            reader.readAsDataURL(blob);
          });
          return;
        }
      }
    }).catch((err) => {
      console.error('Failed to read from clipboard:', err);
    });
  };

  updateImageSource = (src: string, view?: EditorView): void => {
    // Update the image source in the document
    if (!view) {
      return;
    }
    const { state, dispatch } = view;
    const imageContext = this._getImageNodeContext(view);
    if (!imageContext) {
      return;
    }
    const imageNode = state.doc.nodeAt(imageContext.pos);
    if (imageNode) {
      const tr = state.tr.setNodeMarkup(imageContext.pos, undefined, {
        ...imageNode.attrs,
        src,
      });
      dispatch(tr);
    }
  };

}
