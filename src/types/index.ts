import { ActionTypes } from '../enums';

export type State<FieldTypes> = {
  [Key in keyof FieldTypes]?: { value: FieldTypes[Key]; error: string; };
};
export type ValidatorRule<Value, FieldTypes> = ((value: Value, state: State<FieldTypes>) => boolean) | RegExp;
export type ValidatorError<Value, FieldTypes> = ((value: Value, state: State<FieldTypes>) => string) | string;
export type Validator<Value, FieldTypes> = {
  rule: ValidatorRule<Value, FieldTypes>;
  error: ValidatorError<Value, FieldTypes>;
};
export type SchemaItem<Key, Value, FieldTypes> = {
  field: Key;
  value: Value;
  required?: boolean;
  requiredError?: ValidatorError<Value, FieldTypes>;
  validators?: Validator<Value, FieldTypes>[];
};
export type Schema<FieldTypes extends { [key: string]: any }> = Array<{ [Key in keyof FieldTypes]: SchemaItem<Key, FieldTypes[Key], FieldTypes> }[keyof FieldTypes]>;
export type OnSubmit<FieldTypes> = (state: State<FieldTypes>) => void;
export type HandleChangeHook = (event?: any) => void;
export type HandleSubmitHook = (event?: any) => void;
export type UseFormOutput<FieldTypes> = {
  state: State<FieldTypes>;
  handleChange: HandleChangeHook;
  handleSubmit: HandleSubmitHook;
};
export type ActionMap<Map extends { [key: string]: any }> = {
  [Key in keyof Map]: { type: Key; payload?: Map[Key] };
};
export type PayloadChange<FieldTypes extends { [key: string]: any }> = {
  key: string;
  value: FieldTypes[keyof FieldTypes];
};
export type Payload<FieldTypes> = {
  [ActionTypes.Reset]: undefined;
  [ActionTypes.Validate]: State<FieldTypes>;
  [ActionTypes.Change]: PayloadChange<FieldTypes>;
};
export type Actions<FieldTypes> = ActionMap<Payload<FieldTypes>>[keyof ActionMap<Payload<FieldTypes>>];
