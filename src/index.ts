import { useReducer, useCallback, Reducer } from 'react';
import { IUseForm } from './interfaces';
import { initalizer, reducer, validateFields, extractFieldValues } from './helpers';
import { DEFAULT_OPTIONS } from './constants';
import { ActionTypes } from './enums';
import { Fields, Actions, Schema, HandleChange, HandleSubmit, UpdateSchema, UseFormOutput, FormValues } from './types';

export type { Schema, Fields, HandleChange, HandleSubmit, UpdateSchema, UseFormOutput } from './types';

/**
 * Returns stateful fields for forms and memoized callbacks to handle changes and validation.
 *
 * @param options Properties to change the hook behaviour and init the form schema.
 * @returns Fields state object and callback handlers.
 */
const useForm = <FieldTypes extends FormValues = FormValues>({
  schema,
  onSubmit,
  onError,
  resetOnSubmit,
  preventDefaultEventOnSubmit = DEFAULT_OPTIONS.PREVENT_DEFAULT_EVENT_ON_SUBMIT,
  stopPropagationEventOnSubmit = DEFAULT_OPTIONS.STOP_PROPAGATION_EVENT_ON_SUBMIT,
}: IUseForm<FieldTypes>): UseFormOutput<FieldTypes> => {
  const [fields, dispatch] = useReducer<Reducer<Fields<FieldTypes>, Actions<FieldTypes>>, Schema<FieldTypes>>(reducer, schema, initalizer);

  const handleChange = useCallback<HandleChange>(({ target: { name, value } }) => dispatch({ type: ActionTypes.Change, payload: { key: name, value } }), []);

  const handleSubmit = useCallback<HandleSubmit>(
    event => {
      if (event && preventDefaultEventOnSubmit) event?.preventDefault();
      if (event && stopPropagationEventOnSubmit) event?.stopPropagation();

      const { validatedFields, areFieldsValid } = validateFields(fields, schema);

      if (areFieldsValid) {
        if (onSubmit) onSubmit(extractFieldValues(fields));
        if (resetOnSubmit) dispatch({ type: ActionTypes.Reset, payload: schema });
        return;
      }
      if (onError) onError(validatedFields);
      dispatch({ type: ActionTypes.Validate, payload: validatedFields });
    },
    [fields, schema, onSubmit, onError, resetOnSubmit, preventDefaultEventOnSubmit, stopPropagationEventOnSubmit],
  );

  const updateSchema = useCallback<UpdateSchema<FieldTypes>>(newSchema => dispatch({ type: ActionTypes.Reset, payload: newSchema }), []);

  return {
    fields,
    handleChange,
    handleSubmit,
    updateSchema,
  };
};

export default useForm;
