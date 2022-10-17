

import { ContentBlockNode } from 'types';

// `%u200B` nonWidthCharacter
export const hasText = (block: ContentBlockNode) =>
  escape(block.getText()).replace(/%u200B/g, '').length > 0;
