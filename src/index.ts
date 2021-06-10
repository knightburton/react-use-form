import { useReducer, useCallback, Reducer } from 'react';
import { IUseForm } from './interfaces/index.interface';
import { initalizer, reducer, validateFields } from './helpers';
import { DEFAULT_OPTIONS } from './constants';
import { ActionTypes } from './enums';
import type { Fields, Actions, Schema, HandleChangeHook, HandleSubmitHook, UseFormOutput } from './types';

const useForm = <FieldTypes>({
  schema = DEFAULT_OPTIONS.SCHEMA,
  onSubmit = DEFAULT_OPTIONS.ON_SUBMIT,
  resetOnSubmit = DEFAULT_OPTIONS.RESET_ON_SUBMIT,
  preventDefaultEventOnSubmit = DEFAULT_OPTIONS.PREVENT_DEFAULT_EVENT_ON_SUBMIT,
}: IUseForm<FieldTypes> = {}): UseFormOutput<FieldTypes> => {
  const [fields, dispatch] = useReducer<Reducer<Fields<FieldTypes>, Actions<FieldTypes>>, Schema<FieldTypes>>(reducer, schema, initalizer);

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

      const { validatedFields, areFieldsValid } = validateFields(fields, schema);

      if (areFieldsValid) {
        if (onSubmit) onSubmit(fields);
        if (resetOnSubmit) dispatch({ type: ActionTypes.Reset, payload: schema });
      } else {
        dispatch({ type: ActionTypes.Validate, payload: validatedFields });
      }
    },
    [dispatch, fields, schema, onSubmit, resetOnSubmit, preventDefaultEventOnSubmit],
  );

  return {
    fields,
    handleChange,
    handleSubmit,
  };
};

export default useForm;
