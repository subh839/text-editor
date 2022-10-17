import Immutable from 'immutable';

import generateRandomKey from 'draft-js/lib/generateRandomKey';
import { ContentState } from 'draft-js';
import { findLastBlockWithNullParent } from './updateBlockMapLinks';
import { ContentBlockNode, BlockNodeMap } from '../../types';

const { List, Map } = Immutable;

const BlockUtil = {
  
  insertNewLine() {},

  
  insertNewLineAfterAll(currentState: ContentState) {
    const lastBlock = currentState.getLastBlock() as ContentBlockNode;
    const lastBlockText = lastBlock.getText();

    
    if (!lastBlockText) return currentState;

    const keyBelow = generateRandomKey() as string;
    const blockMap = currentState.getBlockMap() as BlockNodeMap;
    let blockBelow = lastBlock.merge({
      parent: null,
      children: List([]),
      key: keyBelow,
      type: 'unstyled',
      text: '',
      characterList: List(),
      depth: 0,
      data: Map(),
    });

    let newBlockMap = blockMap
      .toSeq()
      .concat([[keyBelow, blockBelow] as any])
      .toOrderedMap();

    const lastBlockWithNullParent = findLastBlockWithNullParent(currentState);
    if (lastBlockWithNullParent) {
      let blockToUpdate = lastBlockWithNullParent.last<ContentBlockNode>();
      const blockToUpdateKey = blockToUpdate.getKey();
      blockBelow = blockBelow.merge({
        prevSibling: blockToUpdateKey,
      });
      blockToUpdate = blockToUpdate.merge({
        nextSibling: keyBelow,
      });
      newBlockMap = newBlockMap.set(keyBelow, blockBelow);
      newBlockMap = newBlockMap.set(blockToUpdateKey, blockToUpdate);
    }

    return (currentState as any).merge({
      blockMap: newBlockMap,
    });
  },

  removeEmptyLineAfterAll() {},

  insertDelimiter() {},

  blocksBefore(blockMap: BlockNodeMap, block: ContentBlockNode) {
    return blockMap.toSeq().takeUntil(function(v) {
      return v === block;
    });
  },

  blocksAfter(blockMap: BlockNodeMap, block: ContentBlockNode) {
    return blockMap
      .toSeq()
      .skipUntil(function(v) {
        return v === block;
      })
      .skip(1);
  },

  // removeRangeFromContentState.js
  transformBlock: function transformBlock(
    key: string | undefined,
    blockMap: BlockNodeMap,
    func: Function
  ) {
    if (!key) {
      return;
    }

    const block = blockMap.get(key);

    if (!block) {
      return;
    }

    return func(block);
  },

  getChildrenAfterRemoveBlock: function getChildrenAfterRemoveBlock(
    parentBlock: ContentBlockNode,
    block: ContentBlockNode
  ) {
    const parentChildrenList = parentBlock.getChildKeys();
    const blockKey = block.getKey();
    return parentChildrenList.delete(parentChildrenList.indexOf(blockKey));
  },

  getChildrenSize: function getChildrenSize(
    parentBlock: ContentBlockNode | undefined
  ) {
    if (!parentBlock) return;
    const parentChildrenList = parentBlock.getChildKeys();
    return parentChildrenList.size;
  },

  getChildrenBlocks(blockMap: BlockNodeMap, parentBlock: ContentBlockNode) {
    const parentKey = parentBlock.getKey();
    return blockMap
      .toSeq()
      .skipUntil(v => v === parentBlock)
      .skip(1)
      .takeUntil(function(v: ContentBlockNode) {
        let parent = v.getParentKey();
        while (parent) {
          if (parent === parentKey) return false;
          const next = blockMap.get(parent as any);
          if (next) parent = next.getParentKey();
        }

        return true;
      })
      .toOrderedMap();
  },
};

export default BlockUtil;
