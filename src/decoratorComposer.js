function decorateComposer(...funcs) {
  if (!funcs.length) return args => args;

  if (funcs.length === 1) {
    return funcs[0];
  }
  return funcs.reduce((a, b) => (...args) => {
    console.log('args  : ', a);
    
    return a(b(args[0].bind(this, 3))).bind(this, 4);
  });
  
}

export default decorateComposer;
