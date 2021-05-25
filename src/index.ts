import { useReducer, useCallback } from 'react';
import { useInputInterface } from './interfaces/index.interface';
import { getValidationError, getInitialState, reducer } from './helpers';

const useInput = ({ defaultValue = '', valudationSchema, callback, resetOnCallback = false }: useInputInterface) => {
  const [state, dispatch] = useReducer(reducer, defaultValue, getInitialState);

  const handleChange = useCallback(({ target: { value } }) => dispatch({ payload: { value } }), [dispatch]);

  const handleSubmit = useCallback(
    event => {
      if (event) event.preventDefault();

      const validationError = getValidationError(state.value, valudationSchema);

      if (!validationError) {
        if (callback) callback(state.value);
        if (resetOnCallback) dispatch({ type: 'reset', payload: defaultValue });
        return;
      }
      dispatch({ type: 'validate', payload: validationError });
    },
    [dispatch, state, valudationSchema, callback, resetOnCallback, defaultValue],
  );

  const updateDefaultValue = useCallback(value => dispatch({ payload: { value } }), [dispatch]);

  return [state.value, state.error, handleChange, handleSubmit, updateDefaultValue];
};

export default useInput;
