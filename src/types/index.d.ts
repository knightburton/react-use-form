enum ActionTypes {
  Reset = 'RESET',
  Validate = 'VALIDATE',
  Change = 'CHANGE',
}

type GenericArray = any[];
type Value = string | number | object | GenericArray | boolean | Date | null | undefined;
type Validator = ((value: Value) => boolean) | RegExp;
type ValidationError = ((value: Value) => string) | string;
type ValidationSchema = {
  required?: boolean;
  requiredError?: ValidationError;
  validators?: Validator[];
  errors?: ValidationError[];
};
type OnSubmit = (value: Value) => void;
type InvalidValidatorIndex = number | null;
type State = {
  value: Value;
  error: string;
};
type ActionMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined ? { type: Key; } : { type: Key; payload: M[Key] };
};
type Payload = {
  [ActionTypes.Reset]: Value;
  [ActionTypes.Validate]: string;
  [ActionTypes.Change]: Value;
};
type Actions = ActionMap<Payload>[keyof ActionMap<Payload>];
