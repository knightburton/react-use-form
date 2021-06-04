import { Dispatch } from 'react';
import { REQUIRED_REGEX, REQUIRED_ERROR } from '../constants';
import { ActionTypes } from '../enums';
import type { Schema, ValidationObject, ValidationSchema, ValidationSchemaItem, ValidatorError, State, Actions, Validator } from '../types';

export const getValidatorError = <T>(value: keyof T, state: State<T>, error?: ValidatorError<T, keyof T>): string => {
  if (typeof error === 'function') return error(value, state);
  if (typeof error === 'string') return error;
  return '';
};

export const executeValidators = <T>(value: keyof T, state: State<T>, validators: Validator<T, keyof T>[]): string => {
  const invalidValidator = validators.find(({ rule }) => {
    if (typeof rule === 'function') return !rule(value, state);
    if (rule instanceof RegExp && typeof value === 'string') return !rule.test(value);
    return false;
  });

  return invalidValidator?.error ? getValidatorError(value, state, invalidValidator.error) : '';
};

export const validateValue = <T>(value: keyof T, validationSchema: ValidationSchemaItem<T, keyof T>, state: State<T>): string => {
  const { required, requiredError, validators } = validationSchema;
  if (required && ((typeof value === 'string' && !REQUIRED_REGEX.test(value)) || value === null || value === undefined))
    return getValidatorError(value, state, requiredError) || REQUIRED_ERROR;
  if (validators?.length && value) return executeValidators(value, state, validators);
  return '';
};

export const validateState = <T>(state: State<T>, validationSchema: ValidationSchema<T>, dispatch: Dispatch<Actions<T>>) => {
  const { validatedState, invalid }: ValidationObject<T> = Object.keys(state).reduce(
    (o: ValidationObject<T>, key: string): ValidationObject<T> => {
      const error: string = validateValue<T>(state[key].value, validationSchema[key], state);
      return {
        validatedState: {
          ...o.validatedState,
          [key]: {
            ...state[key],
            error,
          },
        },
        invalid: !!error,
      };
    },
    {
      validatedState: state,
      invalid: false,
    },
  );

  dispatch({ type: ActionTypes.Validate, payload: validatedState });
  return invalid;
};

/**
 * Returns or resets the initial state based on the given schema.
 *
 * @param schema State schema.
 * @returns Initial state schema with additional props.
 */
export const initalizer = <T>(schema: Schema<T>): State<T> =>
  Object.keys(schema).reduce(
    (o: State<T>, key: string) => ({
      ...o,
      [key]: { value: schema[key], error: '' },
    }),
    {},
  );

export const reducer = <T>(state: State<T>, action: Actions<T>): State<T> => {
  switch (action.type) {
    default:
      return state;
  }
};
