// @ts-nocheck

/**

 *
 * @format
 *
 * @emails oncall+draft_js
 */

var EditorState = require('draft-js/lib/EditorState');



var keyCommandPlainBackspace = require('./lib/keyCommandPlainBackspace');

var NestedRichTextEditorUtil = require('./lib/NestedRichTextEditorUtil');

function onKeyCommand(command, editorState, e) {
  switch (command) {
    

    case 'backspace':
      return keyCommandPlainBackspace(editorState);

    

   pboard.cut(editorState);


    default:
      return;
  }
}

function decorateKeyCommandHandler(editorState, command) {
  const newState = NestedRichTextEditorUtil.handleKeyCommand(
    editorState,
    command
  );
  if (newState) return newState;

  return onKeyCommand(command, editorState);
}

export default decorateKeyCommandHandler;
