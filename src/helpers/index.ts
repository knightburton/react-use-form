import { REQUIRED_REGEX, REQUIRED_ERROR } from '../constants';
import { ActionTypes } from '../enums';
import type { ValidationError, InvalidValidatorIndex, ValidationSchema, State, Actions, Validator } from '../types';

/**
 * Gets the actual value and the error and returns the final error string.
 *
 * @param value Actual state value to hand over function bsed errors.
 * @param error Actual string or function that returns with an error string.
 * @returns Error string.
 */
export const getErrorString = <T>(value: T, error?: ValidationError<T>): string => {
  if (typeof error === 'function') return error(value);
  if (typeof error === 'string') return error;
  return '';
};

/**
 * Returns the index of the validator function or regexp that is failing on the actual state value.
 *
 * @param value Actual state value to hand over to the given validators.
 * @param validators List of functions or regexps to check the validity of the actual state value.
 * @returns Invalid validator index number or null.
 */
export const getInvalidValidatorIndex = <T>(value: T, validators: Validator<T>[]): InvalidValidatorIndex => {
  const invalidIndex = validators.findIndex(validator => {
    if (typeof validator === 'function') return !validator(value);
    if (validator instanceof RegExp && typeof value === 'string') return !validator.test(value);
    return false;
  });

  return invalidIndex !== -1 ? invalidIndex : null;
};

/**
 * Returns with the error that the user provided for the corresponding validator based on array index.
 *
 * @param value Actual state value to work with.
 * @param validationSchema Validators and errors list to work with.
 * @returns Validation error string or empty string.
 */
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

/**
 * Returns or resets the initial state based on the given initial value.
 *
 * @param arg Initial value.
 * @returns Initial state with value and error props.
 */
export const initalizer = <T>(arg: T): State<T> => ({ value: arg, error: '' });

/**
 * Executes the incoming action on the previous state and creates a new one
 * or keep it in case of non matching action.
 *
 * @param state Previous state.
 * @param action Action to execute.
 * @returns A new state.
 */
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
