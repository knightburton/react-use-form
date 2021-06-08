import { Dispatch } from 'react';
import { ActionTypes } from '../enums';
import { REQUIRED_REGEX, REQUIRED_ERROR } from '../constants';
import type { Schema, ValidatorError, State, StateField, Actions, Validator } from '../types';

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

export const validateField = <Value, FieldTypes>(field: StateField<Value, FieldTypes>, state: State<FieldTypes>): string => {
  const { value, required, requiredError, validators } = field;
  if (required && ((typeof value === 'string' && !REQUIRED_REGEX.test(value)) || value === null || value === undefined))
    return getValidatorError(value, state, requiredError || REQUIRED_ERROR);
  if (validators && value) return executeValidators(value, state, validators);
  return '';
};

export const validateState = <FieldTypes>(state: State<FieldTypes>, dispatch: Dispatch<Actions<FieldTypes>>): boolean => {
  const { validatedState, invalid } = Object.keys(state).reduce(
    (o, key) => {
      const error = validateField(state[key], state);
      return {
        validatedState: {
          ...o.validatedState,
          [key]: {
            ...state[key],
            error,
          },
        },
        invalid: o.invalid || !!error,
      };
    },
    {
      validatedState: {},
      invalid: false,
    },
  );

  dispatch({ type: ActionTypes.Validate, payload: validatedState });
  return invalid;
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
    case ActionTypes.Reset:
      return initalizer(action.payload);
    case ActionTypes.Validate:
      return action.payload;
    case ActionTypes.Change:
      return {
        ...state,
        [action.payload.key]: {
          ...state[action.payload.key],
          value: action.payload.value,
          error: '',
        },
      };
    default:
      return state;
  }
};
