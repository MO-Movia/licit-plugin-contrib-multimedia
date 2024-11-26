import {Plugin, PluginKey, EditorState, TextSelection} from 'prosemirror-state';
import {Decoration, DecorationSet, EditorView} from 'prosemirror-view';
import {uuid} from './ui/uuid';

const IMAGE = 'image';
const IMAGE_FILE_TYLES = new Set([
  'image/jpeg',
  'image/gif',
  'image/png',
  'image/jpg',
]);

const TITLE = 'Uploading...';

const INNER_HTML = new Array(4).join(
  '<div class="molm-czi-image-upload-placeholder-child"></div>'
);

export type customEditorView = EditorView & {
  runtime;
  readOnly;
  disabled;
};
function isImageUploadPlaceholderPlugin(plugin: Plugin): boolean {
  return plugin instanceof ImageUploadPlaceholderPlugin;
}

function isImageFileType(file: File): boolean {
  return file && IMAGE_FILE_TYLES.has(file.type);
}

export function findImageUploadPlaceholder(
  placeholderPlugin: ImageUploadPlaceholderPlugin,
  state: EditorState,
  id: Record<string, unknown>
): Decoration {
  const decos = placeholderPlugin.getState(state);
  const found = decos?.find(null, null, (spec) => spec.id === id);
  return found?.length ? found[0].from : null;
}

function defer(fn: () => void) {
  return () => {
    setTimeout(fn, 0);
  };
}

export function uploadImageFiles(
  view: customEditorView,
  files: Array<File>,
  coords: {x: number; y: number}
): boolean {
  const {runtime, state, readOnly, disabled} = view;
  const {schema, plugins} = state;
  const imageType = schema?.nodes?.[IMAGE];
  const {uploadImage, canUploadImage} = runtime;
  const imageFiles = Array.from(files).filter(isImageFileType);
  const placeholderPlugin = plugins.find(isImageUploadPlaceholderPlugin);
  if (
    readOnly ||
    disabled ||
    !runtime?.canUploadImage ||
    !imageType ||
    !uploadImage ||
    !canUploadImage ||
    !imageFiles.length ||
    !placeholderPlugin
  ) {
    return false;
  }

  // A fresh object to act as the ID for this upload.
  const id = {
    debugId: 'image_upload_' + uuid(),
  };

  const uploadNext = defer(() => {
    const done = (imageInfo: {src: string}) => {
      const pos = findImageUploadPlaceholder(placeholderPlugin, view.state, id);
      let trNext = view.state.tr;
      if (pos && !view.readOnly && !view.disabled) {
        const imageNode = imageType.create(imageInfo);
        trNext = trNext.replaceWith(pos.from, pos.to, imageNode);
      } else {
        // Upload was cancelled.
        imageFiles.length = 0;
      }
      if (imageFiles.length) {
        uploadNext();
      } else {
        // Remove the placeholder.
        trNext = trNext.setMeta(placeholderPlugin, {remove: {id}});
      }
      view.dispatch(trNext);
    };
    const ff = imageFiles.shift(); // Get the next image file
    if (!ff) {
      return; // No file to upload
    }
    uploadImage(ff)
      .then(done)
      .catch(done.bind(null, {src: null}));
  });

  uploadNext();

  let {tr} = state;

  // Replace the selection with a placeholder
  let from = 0;

  // Adjust the cursor to the dropped position.
  if (coords) {
    const dropPos = view.posAtCoords({
      left: coords.x,
      top: coords.y,
    });

    if (!dropPos) {
      return false;
    }

    from = dropPos.pos;
    tr = tr.setSelection(TextSelection.create(tr.doc, from, from));
  } else {
    from = tr.selection.to;
    tr = tr.setSelection(TextSelection.create(tr.doc, from, from));
  }
  const meta = {
    add: {
      id,
      pos: from,
    },
  };

  tr = tr.setMeta(placeholderPlugin, meta);
  view.dispatch(tr);
  return true;
}

// https://prosemirror.net/examples/upload/
export class ImageUploadPlaceholderPlugin extends Plugin {
  constructor() {
    super({
      // [FS] IRAD-1005 2020-07-07
      // Upgrade outdated packages.
      key: new PluginKey('ImageUploadPlaceholderPlugin'),
      state: {
        init() {
          return DecorationSet.empty;
        },
        apply(tr, set: DecorationSet): DecorationSet {
          // Adjust decoration positions to changes made by the transaction
          set = set.map(tr.mapping, tr.doc);
          // See if the transaction adds or removes any placeholders
          const action = tr.getMeta(this);
          if (action?.add) {
            const el = document.createElement('div');
            el.title = TITLE;
            el.className = 'molm-czi-image-upload-placeholder';
            el.innerHTML = INNER_HTML;

            const deco = Decoration.widget(action.add.pos, el, {
              id: action.add.id,
            });

            set = set.add(tr.doc, [deco]);
          } else if (action?.remove) {
            const finder = (spec) => spec.id == action.remove.id;
            set = set.remove(set.find(null, null, finder));
          }
          return set;
        },
      },
      props: {
        decorations(state: EditorState): DecorationSet {
          return this.getState(state);
        },
      },
    });
  }
}
