
import Immutable from 'immutable';
import { EditorState } from 'draft-js';
import { BlockNodeMap, ContentBlockNode } from 'types';

const { Map } = Immutable;

function getInlineToolbarInlineInfo(editorState: EditorState) {
  const contentState = editorState.getCurrentContent();
  const selectionState = editorState.getSelection();

  const blockMap = contentState.getBlockMap() as BlockNodeMap;
  const startKey = selectionState.getStartKey();
  const startOffset = selectionState.getStartOffset();
  const endKey = selectionState.getEndKey();
  const endOffset = selectionState.getEndOffset();

  let values;
  let hasChanceToInit = true;
  let intersectionIsEmpty = false;
  let hasLink = false;

  blockMap
    .skipUntil((_, k) => k === startKey)
    .takeUntil((_, k) => k === endKey)
    .concat(Map([[endKey, blockMap.get(endKey)]]))
    .forEach(function(block, blockKey) {
      if (hasLink && intersectionIsEmpty) {
        return;
      }

      let styles = Immutable.OrderedSet();

      let sliceStart;
      let sliceEnd;

      if (startKey === endKey) {
        sliceStart = startOffset;
        sliceEnd = endOffset;
      } else {
        sliceStart = blockKey === startKey ? startOffset : 0;
        sliceEnd =
          blockKey === endKey
            ? endOffset
            : (block as ContentBlockNode).getLength();
      }

      const chars = (block as ContentBlockNode).getCharacterList();
      let current;

      while (sliceStart < sliceEnd) {
        if (hasLink && intersectionIsEmpty) {
          break;
        }

        const char = chars.get(sliceStart);
        current = char!.getStyle();

        const entityKey = char!.getEntity();
        if (entityKey) {
          const entityType = contentState.getEntity(entityKey).getType();
          hasLink = entityType === 'LINK';
        }

        if (!intersectionIsEmpty) {
        
          if (current.size > 0) {
            if (!styles.size) {
              
              if (!hasChanceToInit) {
                intersectionIsEmpty = true;
              } else {
                current.forEach(style => styles.add(style)); // eslint-disable-line
                hasChanceToInit = false;
              }
            } else {
              styles = styles.intersect(current);
            }
          }
        }

        sliceStart++;
      }

      values = styles;
    });

  return {
    styles: values,
    hasLink,
  };
}

export default getInlineToolbarInlineInfo;
