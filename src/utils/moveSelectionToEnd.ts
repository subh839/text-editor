import { EditorState, SelectionState } from 'draft-js';
import { BlockNodeMap, ContentBlockNode } from 'types';


const moveSelectionToEnd = (editorState: EditorState) => {
  const content = editorState.getCurrentContent();
  const blockMap = content.getBlockMap() as BlockNodeMap;

  const key = blockMap.last<ContentBlockNode>().getKey();
  const length = blockMap.last<ContentBlockNode>().getLength();

  const selection = new SelectionState().merge({
    anchorKey: key,
    anchorOffset: length,
    focusKey: key,
    focusOffset: length,
  });

  return EditorState.acceptSelection(editorState, selection);
};

export default moveSelectionToEnd;
