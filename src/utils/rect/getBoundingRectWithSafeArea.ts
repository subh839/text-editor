

import { EditorState } from 'draft-js';
import { getNodeByBlockKey } from '../findNode';
import { generateOffsetKey } from '../keyHelper';
import { SafeArea, BlockNodeMap } from '../../types';

export default function getBoundingRectWithSafeArea(
  editorState: EditorState,
  safeArea = 100
) {
  if (!editorState) return;
  const currentState = editorState.getCurrentContent();
  const blockMap = currentState.getBlockMap() as BlockNodeMap;

  //  display sidebar
  const shiftLeft = [] as SafeArea[];
  // display drop direction bar..
  const shiftRight = [] as SafeArea[];

  blockMap.forEach(block => {
    const blockKey = block.getKey();
    const offsetKey = generateOffsetKey(blockKey);
    const node = getNodeByBlockKey(blockKey);
    const childrenSize = block.getChildKeys().size;

    // node with children should be omitted.
    if (!node || childrenSize) return;

    const { top, right, bottom, left } = node.getBoundingClientRect();


    shiftLeft.push({
      blockKey,
      offsetKey,
      rect: {
        top,
        right: right - safeArea,
        bottom,
        left: left - safeArea,
      },
    });

    shiftRight.push({
      blockKey,
      offsetKey,
      rect: {
        top,
        right: right + safeArea,
        bottom,
        left: left + safeArea,
      },
    });
  });

  return {
    shiftLeft: shiftLeft.filter(v => v),
    shiftRight: shiftRight.filter(v => v),
  };
}
