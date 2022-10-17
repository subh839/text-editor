import React from 'react';
import Editor from '../src'

export default {
  title: 'Welcome',
};


export const Default = (props?: Partial<any>) => <Editor {...props} plugins={[]}/>;