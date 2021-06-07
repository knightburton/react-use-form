import { Dispatch } from 'react';
import { ActionTypes } from '../enums';
import type { Schema, ValidatorError, State, Actions, Validator } from '../types';

export const getValidatorError = <Value, FieldTypes>(value: Value, state: State<FieldTypes>, error?: ValidatorError<Value, FieldTypes>): string => {
  if (typeof error === 'function') return error(value, state);
  if (typeof error === 'string') return error;
  return '';
};

export const executeValidators = <Value, FieldTypes>(value: Value, state: State<FieldTypes>, validators: Validator<Value, FieldTypes>[]): string => {
  const invalidValidator = validators.find(({ rule }) => {
    if (typeof rule === 'function') return !rule(value, state);
    if (rule instanceof RegExp && typeof value === 'string') return !rule.test(value);
    return false;
  });

  return invalidValidator?.error ? getValidatorError(value, state, invalidValidator.error) : '';
};

export const validateField = (): string => {
  return '';
};

export const validateState = <FieldTypes>(dispatch: Dispatch<Actions<FieldTypes>>): boolean => {
  dispatch({ type: ActionTypes.Validate, payload: {} });
  return true;
};

export const initalizer = <FieldTypes>(schema: Schema<FieldTypes>): State<FieldTypes> =>
  schema.reduce(
    (state, item) => ({
      ...state,
      [item.field]: {
        ...item,
        error: '',
      },
    }),
    {},
  );

export const reducer = <FieldTypes>(state: State<FieldTypes>, action: Actions<FieldTypes>): State<FieldTypes> => {
  switch (action.type) {
    default:
      return state;
  }
};
