import { useReducer, useCallback } from 'react';
import { useInputInterface } from './interfaces/index.interface';
import { getValidationError, initalizer, reducer } from './helpers';
import { DEFAULT_OPTIONS } from './constants';

const useInput = ({
  defaultValue = DEFAULT_OPTIONS.DEFAULT_VALUE,
  valudationSchema = DEFAULT_OPTIONS.VALIDATION_SCHEMA,
  onSubmit = DEFAULT_OPTIONS.ON_SUBMIT,
  resetOnSubmit = DEFAULT_OPTIONS.RESET_ON_SUBMIT,
  useEventTargetValueOnChange = DEFAULT_OPTIONS.USE_EVENT_TARGET_VALUE_ON_CHANGE,
  preventDefaultEventOnSubmit = DEFAULT_OPTIONS.PREVENT_DEFAULT_EVENT_ON_SUBMIT,
}: useInputInterface): UseInputReturn => {
  const [state, dispatch] = useReducer<(state: State, action: Actions) => State, Value>(reducer, defaultValue, initalizer);

  const handleChange = useCallback<HandleChangeHook>(
    arg => dispatch({ type: ActionTypes.Change, payload: useEventTargetValueOnChange ? arg?.currentTarget?.value : arg }),
    [dispatch, useEventTargetValueOnChange],
  );

  const handleSubmit = useCallback<HandleSubmitHook>(
    event => {
      if (event && preventDefaultEventOnSubmit) event?.preventDefault();

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

  const updateDefaultValue = useCallback<UpdateDefaultValueHook>(value => dispatch({ type: ActionTypes.Change, payload: value }), [dispatch]);

  return {
    value: state.value,
    error: state.error,
    handleChange,
    handleSubmit,
    updateDefaultValue,
  };
};

export default useInput;
