import { EditorRef } from '../../types';

const getRootNode = (editorRef: EditorRef) => {
  if (!editorRef) return;

  let rootNode = (editorRef.current as any).editor;

  while (rootNode && rootNode.className.indexOf('DraftEditor-root') === -1) {
    rootNode = rootNode.parentNode as any;
  }

  return rootNode;
};

export default getRootNode;
