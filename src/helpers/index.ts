import { REQUIRED_REGEX, REQUIRED_ERROR } from '../constants';

export const getErrorString = (value: ValueType, error?: ErrorType): string => {
  if (typeof error === 'function') return error(value);
  if (typeof error === 'string') return error;
  return '';
};

export const getInvalidValidatorIndex = (value: ValueType, validators: ValidatorType[]): InvalidValidatorIndexType => {
  const invalidIndex = validators.findIndex(validator => {
    if (typeof validator === 'function') return !validator(value);
    if (validator instanceof RegExp) return !validator.test(value);
    return false;
  });

  return invalidIndex !== -1 ? invalidIndex : null;
};

export const getValidationError = (value: ValueType, validationSchema: ValidationSchemaType = {}): string => {
  const { required, requiredError, validators, errors } = validationSchema;
  if (required && (!REQUIRED_REGEX.test(value) || value === null || value === undefined)) return getErrorString(value, requiredError) || REQUIRED_ERROR;
  if (validators && value) {
    const invalidIndex = getInvalidValidatorIndex(value, validators);
    return invalidIndex !== null ? getErrorString(value, errors?.[invalidIndex]) : '';
  }
  return '';
};

export const getInitialState = (initialValue: ValueType): StateType => ({ value: initialValue || '', error: '' });

export const reducer = (state: StateType, { type, payload }: StateActionType) => {
  if (type === 'reset') return getInitialState(payload);
  if (type === 'validate') return { ...state, error: payload };
  return {
    value: payload.value,
    error: payload.error || '',
  };
};
