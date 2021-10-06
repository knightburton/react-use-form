import { useReducer, useCallback, Reducer } from 'react';
import { IUseForm } from './interfaces/index.interface';
import { initalizer, reducer, validateFields } from './helpers';
import { DEFAULT_OPTIONS } from './constants';
import { ActionTypes } from './enums';
import type { Fields, Actions, Schema, HandleChangeCallback, HandleDirectChangeCallback, HandleSubmitCallback, UpdateSchemaCallback, UseFormOutput } from './types';

/**
 * Returns stateful fields for forms and memoized callbacks to handle changes and validation.
 *
 * @param options Attributes to change the hook behaviour and init the form schema.
 * @returns Fields state object and callback handlers.
 */
const useForm = <FieldTypes>({
  schema,
  onSubmit,
  resetOnSubmit,
  useDirectOnChange,
  preventDefaultEventOnSubmit = DEFAULT_OPTIONS.PREVENT_DEFAULT_EVENT_ON_SUBMIT,
}: IUseForm<FieldTypes>): UseFormOutput<FieldTypes> => {
  const [fields, dispatch] = useReducer<Reducer<Fields<FieldTypes>, Actions<FieldTypes>>, Schema<FieldTypes>>(reducer, schema, initalizer);

  const handleChangeCallback = useCallback<HandleChangeCallback>(
    ({ target: { name, value } }) => dispatch({ type: ActionTypes.Change, payload: { key: name, value } }),
    [],
  );

  const handleDirectChangeCallback = useCallback<HandleDirectChangeCallback>(name => value => dispatch({ type: ActionTypes.Change, payload: { key: name, value } }), []);

  const handleSubmit = useCallback<HandleSubmitCallback>(
    event => {
      if (event && preventDefaultEventOnSubmit) event?.preventDefault();

      const { validatedFields, areFieldsValid } = validateFields(fields, schema);

      if (areFieldsValid) {
        if (onSubmit) onSubmit(fields);
        if (resetOnSubmit) dispatch({ type: ActionTypes.Reset, payload: schema });
        return;
      }
      dispatch({ type: ActionTypes.Validate, payload: validatedFields });
    },
    [fields, schema, onSubmit, resetOnSubmit, preventDefaultEventOnSubmit],
  );

  const updateSchema = useCallback<UpdateSchemaCallback<FieldTypes>>(newSchema => dispatch({ type: ActionTypes.Reset, payload: newSchema }), []);

  return {
    fields,
    handleChange: useDirectOnChange ? handleDirectChangeCallback : handleChangeCallback,
    handleSubmit,
    updateSchema,
  };
};

export default useForm;
