enum ActionTypes {
  Reset = 'RESET',
  Validate = 'VALIDATE',
  Change = 'CHANGE',
}

type ArrayType = any[];
type ValueType = string | number | object | ArrayType | boolean | Date | null | undefined;
type ValidatorType = ((value: ValueType) => boolean) | RegExp;
type ErrorType = ((value: ValueType) => string) | string;
type ValidationSchemaType = {
  required?: boolean;
  requiredError?: ErrorType;
  validators?: ValidatorType[];
  errors?: ErrorType[];
};
type CallbackType = (value: ValueType) => void;
type InvalidValidatorIndexType = number | null;
type StateType = {
  value: ValueType;
  error: string;
};
type ActionMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined ? { type: Key; } : { type: Key; payload: M[Key] };
};
type PayloadType = {
  [ActionTypes.Reset]: ValueType;
  [ActionTypes.Validate]: string;
  [ActionTypes.Change]: ValueType;
};
type ActionsType = ActionMap<PayloadType>[keyof ActionMap<PayloadType>];
