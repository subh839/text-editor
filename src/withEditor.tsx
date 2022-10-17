import React, { useContext, ComponentType, FC } from 'react';
import Context from './Context';
import { ReturnProps, GetEditor, IWrappedComponent } from './types';

function getDisplayName<T>(
  WrappedComponent: ComponentType<IWrappedComponent<T>>
) {
  return (
    WrappedComponent.displayName ||
    WrappedComponent.name ||
    'WithEditorComponent'
  );
}

function withEditor<T>(
  WrappedComponent: ComponentType<IWrappedComponent<T>>
): FC<ReturnProps<T>> {
  return (props: T) => {
    WrappedComponent.displayName = `WrappedComponent(${getDisplayName(
      WrappedComponent
    )})`;
    const getEditor = useContext<GetEditor | null>(Context) as GetEditor;
    return <WrappedComponent {...props} getEditor={getEditor} />;
  };
}

export default withEditor;
