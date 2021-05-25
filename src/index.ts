import { useReducer, useCallback } from 'react';
import { useInputInterface } from './interfaces/index.interface';
import { getValidationError, getInitialState, reducer } from './helpers';

const useInput = ({ defaultValue = '', valudationSchema, callback, resetOnCallback = false, preventDefaultEventOnSubmit = true }: useInputInterface) => {
  const [state, dispatch] = useReducer(reducer, defaultValue, getInitialState);

  const handleChange = useCallback(({ target: { value } }) => dispatch({ type: 'change', payload: { value } }), [dispatch]);

  const handleSubmit = useCallback(
    event => {
      if (event && preventDefaultEventOnSubmit) event.preventDefault();

      const validationError = getValidationError(state.value, valudationSchema);

      if (!validationError) {
        if (callback) callback(state.value);
        if (resetOnCallback) dispatch({ type: 'reset', payload: defaultValue });
        return;
      }
      dispatch({ type: 'validate', payload: validationError });
    },
    [dispatch, state, valudationSchema, callback, resetOnCallback, defaultValue, preventDefaultEventOnSubmit],
  );

  const updateDefaultValue = useCallback(value => dispatch({ type: 'change', payload: { value } }), [dispatch]);

  return [state.value, state.error, handleChange, handleSubmit, updateDefaultValue];
};

export default useInput;
