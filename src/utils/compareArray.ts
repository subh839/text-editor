

export default (a: string[] = [], b: string[] = []) => {
  if (a === b) return [];

  const result = [];
  const aLen = a.length;
  const bLen = b.length;

  for (let i = 0; i < aLen; ++i) {
    const blockKey = a[i];
    if (b.indexOf(blockKey) === -1) {
      result.push({
        op: 'remove',
        blockKey,
      });
    }
  }

  for (let i = 0; i < bLen; ++i) {
    const blockKey = b[i];
    if (a.indexOf(blockKey) === -1) {
      result.push({
        op: 'add',
        blockKey,
      });
    }
  }

  return result;
};
