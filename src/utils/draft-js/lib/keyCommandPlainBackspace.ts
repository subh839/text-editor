// @ts-nocheck

/**
 *
 * @format
 *
 * @emails oncall+draft_js
 */

var EditorState = require('draft-js/lib/EditorState');

var UnicodeUtils = require('fbjs/lib/UnicodeUtils');

var moveSelectionBackward = require('draft-js/lib/moveSelectionBackward');

var removeTextWithStrategy = require('./removeTextWithStrategy');
/*
 */

function keyCommandPlainBackspace(editorState) {
  var afterRemoval = removeTextWithStrategy(
    editorState,
    function(strategyState) {
      var selection = strategyState.getSelection();
      var content = strategyState.getCurrentContent();
      var key = selection.getAnchorKey();
      var offset = selection.getAnchorOffset();
      var charBehind = content.getBlockForKey(key).getText()[offset - 1];
      return moveSelectionBackward(
        strategyState,
        charBehind ? UnicodeUtils.getUTF16Length(charBehind, 0) : 1
      );
    },
    'backward'
  );

  if (afterRemoval === editorState.getCurrentContent()) {
    return editorState;
  }

  var selection = editorState.getSelection();
  return EditorState.push(
    editorState,
    afterRemoval.set('selectionBefore', selection),
    selection.isCollapsed() ? 'backspace-character' : 'remove-range'
  );
}

module.exports = keyCommandPlainBackspace;
