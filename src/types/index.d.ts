type ValueType = string | number | object | array | boolean | null;
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
type StateType = {
  value: ValueType;
  error: string;
};
type StateActionType = {
  type?: string;
  payload?: StateType | ValueType;
};
