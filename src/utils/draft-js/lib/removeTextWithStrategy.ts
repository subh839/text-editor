// @ts-nocheck
/**
 *
 * @format
 *
 * @emails oncall+draft_js
 */

var DraftModifier = require('./DraftModifier');

var gkx = require('draft-js/lib/gkx');

var experimentalTreeDataSupport = gkx('draft_tree_data_support');

function removeTextWithStrategy(editorState, strategy, direction) {
  var selection = editorState.getSelection();
  var content = editorState.getCurrentContent();
  var target = selection;
  var anchorKey = selection.getAnchorKey();
  var focusKey = selection.getFocusKey();
  var anchorBlock = content.getBlockForKey(anchorKey);

  if (experimentalTreeDataSupport) {
    if (direction === 'forward') {
      if (anchorKey !== focusKey) {
        return content;
      }
    }
  }

  if (selection.isCollapsed()) {
    if (direction === 'forward') {
      if (editorState.isSelectionAtEndOfContent()) {
        return content;
      }

      if (experimentalTreeDataSupport) {
        var isAtEndOfBlock =
          selection.getAnchorOffset() ===
          content.getBlockForKey(anchorKey).getLength();

        if (isAtEndOfBlock) {
          var anchorBlockSibling = content.getBlockForKey(
            anchorBlock.nextSibling
          );

          if (!anchorBlockSibling || anchorBlockSibling.getLength() === 0) {
            
            return content;
          }
        }
      }
    } else if (editorState.isSelectionAtStartOfContent()) {
      return content;
    }

    target = strategy(editorState);

    if (target === selection) {
      return content;
    }
  }

  return DraftModifier.removeRange(content, target, direction);
}

module.exports = removeTextWithStrategy;
