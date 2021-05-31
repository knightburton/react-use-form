import { REQUIRED_REGEX, REQUIRED_ERROR } from '../constants';
import { ActionTypes } from '../enums';
import type { ValidationError, InvalidValidatorIndex, ValidationSchema, State, Actions, Validator } from '../types';

export const getErrorString = <T>(value: T, error?: ValidationError<T>): string => {
  if (typeof error === 'function') return error(value);
  if (typeof error === 'string') return error;
  return '';
};

export const getInvalidValidatorIndex = <T>(value: T, validators: Validator<T>[]): InvalidValidatorIndex => {
  const invalidIndex = validators.findIndex(validator => {
    if (typeof validator === 'function') return !validator(value);
    if (validator instanceof RegExp && typeof value === 'string') return !validator.test(value);
    return false;
  });

  return invalidIndex !== -1 ? invalidIndex : null;
};

export const getValidationError = <T>(value: T, validationSchema: ValidationSchema<T>): string => {
  const { required, requiredError, validators, errors } = validationSchema;
  if (required && ((typeof value === 'string' && !REQUIRED_REGEX.test(value)) || value === null || value === undefined))
    return getErrorString(value, requiredError) || REQUIRED_ERROR;
  if (validators && value) {
    const invalidIndex = getInvalidValidatorIndex(value, validators);
    return invalidIndex !== null ? getErrorString(value, errors?.[invalidIndex]) : '';
  }
  return '';
};

export const initalizer = <T>(arg: T): State<T> => ({ value: arg, error: '' });

export const reducer = <T>(state: State<T>, action: Actions<T>): State<T> => {
  switch (action.type) {
    case ActionTypes.Reset:
      return initalizer(action.payload);
    case ActionTypes.Validate:
      return { ...state, error: action.payload };
    case ActionTypes.Change:
      return { value: action.payload, error: '' };
    default:
      return state;
  }
};
