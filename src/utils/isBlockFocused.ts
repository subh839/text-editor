import { EditorState } from 'draft-js';
import { ContentBlockNode } from '../types';

const isBlockFocused = (editorState: EditorState, block: ContentBlockNode) => {
  const selection = editorState.getSelection();

  if (!selection.getHasFocus()) return false;

  if (!selection.isCollapsed()) return false;

  const blockKey = block.getKey();
  const startKey = selection.getStartKey();

  return blockKey === startKey;
};

export default isBlockFocused;
