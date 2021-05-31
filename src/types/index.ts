import { ActionTypes } from '../enums';

export type GenericArray = any[];
export type Validator<T> = ((value: T) => boolean) | RegExp;
export type ValidationError<T> = ((value: T) => string) | string;
export type ValidationSchema<T> = {
  required?: boolean;
  requiredError?: ValidationError<T>;
  validators?: Validator<T>[];
  errors?: ValidationError<T>[];
};
export type OnSubmit<T> = (value: T) => void;
export type InvalidValidatorIndex = number | null;
export type State<T> = {
  value: T;
  error: string;
};
export type HandleChangeHook = (event?: any) => void;
export type HandleSubmitHook = (event?: any) => void;
export type UpdateDefaultValueHook = (value?: any) => void;
export type UseInputReturn<T> = {
  value: T;
  error: ValidationError<T>;
  handleChange: HandleChangeHook;
  handleSubmit: HandleSubmitHook;
  updateDefaultValue: UpdateDefaultValueHook;
};
export type ActionMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: { type: Key; payload: M[Key] };
};
export type Payload<T> = {
  [ActionTypes.Reset]: T;
  [ActionTypes.Validate]: string;
  [ActionTypes.Change]: T;
};
export type Actions<T> = ActionMap<Payload<T>>[keyof ActionMap<Payload<T>>];
