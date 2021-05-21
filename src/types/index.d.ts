type ValueType = string | number | object | array | boolean | undefined | null;
type ValidatorType = ((value: ValueType) => boolean) | RegExp;
type ErrorType = ((value: ValueType) => string) | string;
type ValidationSchemaType = {
  required?: boolean;
  requiredError?: ErrorType;
  validators?: ValidatorType[];
  errors?: ErrorType[];
} | undefined;
type CallbackType = (value: ValueType) => void;
type InvalidValidatorIndexType = number | null;
