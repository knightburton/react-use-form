import { ActionTypes } from '../enums';

export type Field<Value> = { value: Value; error: string };
export type Fields<FieldTypes> = {
  [Key in keyof FieldTypes]: Field<FieldTypes[Key]>;
};
export type ValidatorRule<Value, FieldTypes> = ((value: Value, fields: Fields<FieldTypes>) => boolean) | RegExp;
export type ValidatorError<Value, FieldTypes> = ((value: Value, fields: Fields<FieldTypes>) => string) | string;
export type Validator<Value, FieldTypes> = {
  rule: ValidatorRule<Value, FieldTypes>;
  error: ValidatorError<Value, FieldTypes>;
};
export type ValidationResult<FieldTypes> = {
  validatedFields: Fields<FieldTypes>;
  areFieldsValid: boolean;
};
export type SchemaField<Key, Value, FieldTypes> = {
  field: Key;
  value: Value;
  required?: boolean | ((value: Value, fields: Fields<FieldTypes>) => boolean);
  requiredError?: ValidatorError<Value, FieldTypes>;
  validators?: Validator<Value, FieldTypes>[];
};
export type Schema<FieldTypes extends { [key: string]: any }> = Array<{ [Key in keyof FieldTypes]: SchemaField<Key, FieldTypes[Key], FieldTypes> }[keyof FieldTypes]>;
export type OnSubmit<FieldTypes> = (fields: Fields<FieldTypes>) => void;
export type OnError<FieldTypes> = (fields: Fields<FieldTypes>) => void;
export type HandleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
export type HandleSubmit = (event?: React.FormEvent<HTMLFormElement>) => void;
export type UpdateSchema<FieldTypes> = (schema: Schema<FieldTypes>) => void;
export type UseFormOutput<FieldTypes> = {
  fields: Fields<FieldTypes>;
  handleChange: HandleChange;
  handleSubmit: HandleSubmit;
  updateSchema: UpdateSchema<FieldTypes>;
};
export type ActionMap<Map extends { [key: string]: any }> = {
  [Key in keyof Map]: { type: Key; payload: Map[Key] };
};
export type PayloadChange = {
  key: string;
  value: any;
};
export type Payload<FieldTypes> = {
  [ActionTypes.Reset]: Schema<FieldTypes>;
  [ActionTypes.Validate]: Fields<FieldTypes>;
  [ActionTypes.Change]: PayloadChange;
};
export type Actions<FieldTypes> = ActionMap<Payload<FieldTypes>>[keyof ActionMap<Payload<FieldTypes>>];
