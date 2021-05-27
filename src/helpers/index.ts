import { REQUIRED_REGEX, REQUIRED_ERROR } from '../constants';

export const getErrorString = (value: ValueType, error?: ErrorType): string => {
  if (typeof error === 'function') return error(value);
  if (typeof error === 'string') return error;
  return '';
};

export const getInvalidValidatorIndex = (value: ValueType, validators: ValidatorType[]): InvalidValidatorIndexType => {
  const invalidIndex = validators.findIndex(validator => {
    if (typeof validator === 'function') return !validator(value);
    if (validator instanceof RegExp && typeof value === 'string') return !validator.test(value);
    return false;
  });

  return invalidIndex !== -1 ? invalidIndex : null;
};

export const getValidationError = (value: ValueType, validationSchema: ValidationSchemaType = {}): string => {
  const { required, requiredError, validators, errors } = validationSchema;
  if (required && ((typeof value === 'string' && !REQUIRED_REGEX.test(value)) || value === null || value === undefined))
    return getErrorString(value, requiredError) || REQUIRED_ERROR;
  if (validators && value) {
    const invalidIndex = getInvalidValidatorIndex(value, validators);
    return invalidIndex !== null ? getErrorString(value, errors?.[invalidIndex]) : '';
  }
  return '';
};

export const getInitialState = (initialValue: ValueType): StateType => ({ value: initialValue || '', error: '' });

export const reducer = (state: StateType, action: ActionsType) => {
  switch (action.type) {
    case ActionTypes.Reset:
      return getInitialState(action.payload);
    case ActionTypes.Validate:
      return { ...state, error: action.payload };
    case ActionTypes.Change:
      return { value: action.payload, error: '' };
    default:
      return state;
  }
};
