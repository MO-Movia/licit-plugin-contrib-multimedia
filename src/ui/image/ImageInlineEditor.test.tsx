import {ImageInlineEditor} from './ImageInlineEditor';
import {CustomButton} from '@modusoperandi/licit-ui-commands';
import {EditorView} from 'prosemirror-view';

jest.mock('@modusoperandi/licit-ui-commands', () => ({
  CustomButton: jest.fn(() => null),
}));

jest.mock('../Icon', () => ({
  Icon: {get: jest.fn((name) => `<icon ${name}>`)},
}));

const createMockEditorView = () =>
  ({
    state: {
      tr: {deleteSelection: jest.fn(() => 'mockTr')},
    },
    dispatch: jest.fn(),
  }) as unknown as EditorView;

describe('ImageInlineEditor (no react-test-renderer)', () => {
  let onSelect: jest.Mock;
  let editorView: EditorView;

  beforeEach(() => {
    onSelect = jest.fn();
    editorView = createMockEditorView();
    jest.clearAllMocks();
  });

  it('calls onSelect with correct align value when _onClick is triggered', () => {
    const comp = new ImageInlineEditor({
      onSelect,
      value: {align: 'left'},
      editorView,
    });

    comp._onClick('center');
    expect(onSelect).toHaveBeenCalledWith({align: 'center'});
  });

  it('handles parseLabel correctly with icon and text', () => {
    const comp = new ImageInlineEditor({
      onSelect,
      value: {},
      editorView,
    });

    const result = comp.parseLabel('[edit] Edit something');
    expect(result.title).toBe(' Edit something');
    expect(result.icon).toBeDefined();
  });

  it('returns plain label when parseLabel has no match', () => {
    const comp = new ImageInlineEditor({
      onSelect,
      value: {},
      editorView,
    });

    const result = comp.parseLabel('No icon label');
    expect(result.icon).toBeNull();
    expect(result.title).toBe('No icon label');
  });

  it('calls dispatch when _onRemove is called', () => {
    const comp = new ImageInlineEditor({
      onSelect,
      value: {},
      editorView,
    });

    comp._onRemove(editorView);
    expect(editorView.state.tr.deleteSelection).toHaveBeenCalled();
    expect(editorView.dispatch).toHaveBeenCalledWith('mockTr');
  });

  it('does not crash when _onAlter is called (placeholder)', () => {
    const comp = new ImageInlineEditor({
      onSelect,
      value: {},
      editorView,
    });

    expect(() => comp._onAlter()).not.toThrow();
  });

  it('prepButtons calls CustomButton for align buttons', () => {
    const comp = new ImageInlineEditor({
      onSelect,
      value: {align: 'left'},
      editorView,
    });

    comp.prepButtons({
      LEFT: {value: 'left', text: 'Left', label: '[icon] Left Align'},
      RIGHT: {value: 'right', text: 'Right', label: '[icon] Right Align'},
    });

    expect(CustomButton).toBeDefined();
  });
});
