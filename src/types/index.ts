import { ActionTypes } from '../enums';

export type Schema<T> = { [key: string]: T };
export type State<T> = {
  [Key in keyof T]?: { value: T[Key]; error: string };
};
export type ValidatorRule<T, ValueT> = ((value: ValueT, state: State<T>) => boolean) | RegExp;
export type ValidatorError<T, ValueT> = ((value: ValueT, state: State<T>) => string) | string;
export type ValidationObject<T> = {
  validatedState: State<T>;
  invalid: boolean;
};
export type Validator<T, ValueT> = {
  rule: ValidatorRule<T, ValueT>;
  error: ValidatorError<T, ValueT>;
};
export type ValidationSchemaItem<T, ItemT> = {
  required?: boolean;
  requiredError?: string;
  validators?: Validator<T, ItemT>[];
};
export type ValidationSchema<T> = {
  [Key in keyof T]?: ValidationSchemaItem<T, T[Key]>;
};
export type OnSubmit<T> = (state: State<T>) => void;
export type HandleChangeHook = (event?: any) => void;
export type HandleSubmitHook = (event?: any) => void;
export type UseFormOutput<T> = {
  state: State<T>;
  handleChange: HandleChangeHook;
  handleSubmit: HandleSubmitHook;
};
export type ActionMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: { type: Key; payload?: M[Key] };
};
export type Payload<T> = {
  [ActionTypes.Reset]: undefined;
  [ActionTypes.Validate]: State<T>;
  [ActionTypes.Change]: { key: string; value: T };
};
export type Actions<T> = ActionMap<Payload<T>>[keyof ActionMap<Payload<T>>];
