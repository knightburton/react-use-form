import { useReducer, useCallback, Reducer } from 'react';
import { UseInputInterface } from './interfaces/index.interface';
import { getValidationError, initalizer, reducer } from './helpers';
import { DEFAULT_OPTIONS } from './constants';
import { ActionTypes } from './enums';
import type { State, Actions, HandleChangeHook, HandleSubmitHook, UpdateDefaultValueHook, UseInputPayload } from './types';

/**
 * `useInput` returns with stateful value, error and functions to handle change, submit and default value update.
 * Preferable to use on a single input field which does not have complex logic or multiple sub-values.
 * @link https://github.com/knightburton/react-use-input#readme
 */
const useInput = <T>({
  defaultValue = DEFAULT_OPTIONS.DEFAULT_VALUE,
  valudationSchema = DEFAULT_OPTIONS.VALIDATION_SCHEMA,
  onSubmit = DEFAULT_OPTIONS.ON_SUBMIT,
  resetOnSubmit = DEFAULT_OPTIONS.RESET_ON_SUBMIT,
  useEventTargetValueOnChange = DEFAULT_OPTIONS.USE_EVENT_TARGET_VALUE_ON_CHANGE,
  preventDefaultEventOnSubmit = DEFAULT_OPTIONS.PREVENT_DEFAULT_EVENT_ON_SUBMIT,
}: UseInputInterface<T> = {}): UseInputPayload<T> => {
  const [state, dispatch] = useReducer<Reducer<State<T>, Actions<T>>, T>(reducer, defaultValue as T, initalizer);

  const handleChange = useCallback<HandleChangeHook>(
    event => {
      dispatch({ type: ActionTypes.Change, payload: useEventTargetValueOnChange ? event?.currentTarget?.value : event });
    },
    [dispatch, useEventTargetValueOnChange],
  );

  const handleSubmit = useCallback<HandleSubmitHook>(
    event => {
      if (event && preventDefaultEventOnSubmit) event?.preventDefault();

      const validationError = getValidationError(state.value, valudationSchema);

      if (!validationError) {
        if (onSubmit) onSubmit(state.value);
        if (resetOnSubmit) dispatch({ type: ActionTypes.Reset });
        return;
      }
      dispatch({ type: ActionTypes.Validate, payload: validationError });
    },
    [dispatch, state, valudationSchema, onSubmit, resetOnSubmit, preventDefaultEventOnSubmit],
  );

  const updateDefaultValue = useCallback<UpdateDefaultValueHook>(value => dispatch({ type: ActionTypes.UpdateDefaultValue, payload: value }), [dispatch]);

  return {
    value: state.value,
    error: state.error,
    handleChange,
    handleSubmit,
    updateDefaultValue,
  };
};

export default useInput;
