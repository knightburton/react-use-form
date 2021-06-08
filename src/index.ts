import { useReducer, useCallback, Reducer } from 'react';
import { IUseForm } from './interfaces/index.interface';
import { initalizer, reducer, validateState } from './helpers';
import { DEFAULT_OPTIONS } from './constants';
import { ActionTypes } from './enums';
import type { State, Actions, Schema, HandleChangeHook, HandleSubmitHook, UseFormOutput } from './types';

const useForm = <FieldTypes>({
  schema = DEFAULT_OPTIONS.SCHEMA,
  onSubmit = DEFAULT_OPTIONS.ON_SUBMIT,
  resetOnSubmit = DEFAULT_OPTIONS.RESET_ON_SUBMIT,
  // useEventTargetValueOnChange = DEFAULT_OPTIONS.USE_EVENT_TARGET_VALUE_ON_CHANGE,
  preventDefaultEventOnSubmit = DEFAULT_OPTIONS.PREVENT_DEFAULT_EVENT_ON_SUBMIT,
}: IUseForm<FieldTypes> = {}): UseFormOutput<FieldTypes> => {
  const [state, dispatch] = useReducer<Reducer<State<FieldTypes>, Actions<FieldTypes>>, Schema<FieldTypes>>(reducer, schema, initalizer);

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

      const isStateValid = validateState(state, dispatch);

      if (isStateValid) {
        if (onSubmit) onSubmit(state);
        if (resetOnSubmit) dispatch({ type: ActionTypes.Reset, payload: schema });
      }
    },
    [dispatch, state, onSubmit, resetOnSubmit, preventDefaultEventOnSubmit],
  );

  return {
    state,
    handleChange,
    handleSubmit,
  };
};

export default useForm;
