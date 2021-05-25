import { useReducer, useCallback } from 'react';
import { useInputInterface } from './interfaces/index.interface';
import { getValidationError, getInitialState, reducer } from './helpers';

const useInput = ({ defaultValue = '', valudationSchema, onSubmit, resetOnSubmit = false, preventDefaultEventOnSubmit = true }: useInputInterface) => {
  const [state, dispatch] = useReducer(reducer, defaultValue, getInitialState);

  const handleChange = useCallback(({ target: { value } }) => dispatch({ type: ActionTypes.Change, payload: value }), [dispatch]);

  const handleSubmit = useCallback(
    event => {
      if (event && preventDefaultEventOnSubmit) event.preventDefault();

      const validationError = getValidationError(state.value, valudationSchema);

      if (!validationError) {
        if (onSubmit) onSubmit(state.value);
        if (resetOnSubmit) dispatch({ type: ActionTypes.Reset, payload: defaultValue });
        return;
      }
      dispatch({ type: ActionTypes.Validate, payload: validationError });
    },
    [dispatch, state, valudationSchema, onSubmit, resetOnSubmit, defaultValue, preventDefaultEventOnSubmit],
  );

  const updateDefaultValue = useCallback(value => dispatch({ type: ActionTypes.Change, payload: value }), [dispatch]);

  return [state.value, state.error, handleChange, handleSubmit, updateDefaultValue];
};

export default useInput;
