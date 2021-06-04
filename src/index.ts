import { useReducer, useCallback, Reducer } from 'react';
import { IUseForm } from './interfaces/index.interface';
import { initalizer, reducer, validateState } from './helpers';
import { DEFAULT_OPTIONS } from './constants';
import { ActionTypes } from './enums';
import type { State, Actions, Schema, HandleChangeHook, HandleSubmitHook, UseFormOutput } from './types';

const useForm = <T>({
  schema = DEFAULT_OPTIONS.SCHEMA,
  validationSchema = DEFAULT_OPTIONS.VALIDATION_SCHEMA,
  onSubmit = DEFAULT_OPTIONS.ON_SUBMIT,
  resetOnSubmit = DEFAULT_OPTIONS.RESET_ON_SUBMIT,
  // useEventTargetValueOnChange = DEFAULT_OPTIONS.USE_EVENT_TARGET_VALUE_ON_CHANGE,
  preventDefaultEventOnSubmit = DEFAULT_OPTIONS.PREVENT_DEFAULT_EVENT_ON_SUBMIT,
}: IUseForm<T> = {}): UseFormOutput<T> => {
  const [state, dispatch] = useReducer<Reducer<State<T>, Actions<T>>, Schema<T>>(reducer, schema, initalizer);

  const handleChange = useCallback<HandleChangeHook>(
    event => {
      const { name, value } = event.target;
      dispatch({ type: ActionTypes.Change, payload: { key: name, value } });
    },
    [dispatch],
  );

  const handleSubmit = useCallback<HandleSubmitHook>(
    event => {
      if (event && preventDefaultEventOnSubmit) event?.preventDefault();

      const isStateValid = validateState(state, validationSchema, dispatch);

      if (isStateValid) {
        if (onSubmit) onSubmit(state);
        if (resetOnSubmit) dispatch({ type: ActionTypes.Reset });
      }
    },
    [dispatch, state, validationSchema, onSubmit, resetOnSubmit, preventDefaultEventOnSubmit],
  );

  return {
    state,
    handleChange,
    handleSubmit,
  };
};

export default useForm;
