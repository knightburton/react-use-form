import { ActionTypes } from '../enums';
import { REQUIRED_REGEX, REQUIRED_ERROR } from '../constants';
import type { Schema, ValidatorError, SchemaField, Fields, Actions, Validator, ValidationResult } from '../types';

export const getFieldValidatorError = <Value, FieldTypes>(value: Value, fields: Fields<FieldTypes>, error?: ValidatorError<Value, FieldTypes>): string => {
  if (typeof error === 'function') return error(value, fields);
  if (typeof error === 'string') return error;
  return '';
};

export const executeFieldValidatorsOnValue = <Value, FieldTypes>(value: Value, fields: Fields<FieldTypes>, validators: Validator<Value, FieldTypes>[]): string => {
  const invalidValidator = validators.find(({ rule }) => {
    if (typeof rule === 'function') return !rule(value, fields);
    if (rule instanceof RegExp && typeof value === 'string') return !rule.test(value);
    return false;
  });

  return invalidValidator?.error ? getFieldValidatorError(value, fields, invalidValidator.error) : '';
};

export const validateFieldValue = <Key, Value, FieldTypes>(value: Value, schemaField: SchemaField<Key, Value, FieldTypes>, fields: Fields<FieldTypes>): string => {
  const { required, requiredError, validators } = schemaField;
  if (required && ((typeof value === 'string' && !REQUIRED_REGEX.test(value)) || value === null || value === undefined))
    return getFieldValidatorError(value, fields, requiredError || REQUIRED_ERROR);
  if (validators && value) return executeFieldValidatorsOnValue(value, fields, validators);
  return '';
};

export const validateFields = <FieldTypes>(fields: Fields<FieldTypes>, schema: Schema<FieldTypes>): ValidationResult<FieldTypes> =>
  schema.reduce(
    (o: ValidationResult<FieldTypes>, schemaField) => {
      const value = fields[schemaField.field].value;
      const error = validateFieldValue(value, schemaField, fields);
      const validatedFields = {
        ...o.validatedFields,
        [schemaField.field]: { value, error },
      };
      const areFieldsValid = o.areFieldsValid && !error;
      return { validatedFields, areFieldsValid };
    },
    { validatedFields: {} as Fields<FieldTypes>, areFieldsValid: true },
  );

export const initalizer = <FieldTypes>(schema: Schema<FieldTypes>): Fields<FieldTypes> =>
  schema.reduce(
    (fields, item) => ({
      ...fields,
      [item.field]: {
        value: item.value,
        error: '',
      },
    }),
    {} as Fields<FieldTypes>,
  );

export const reducer = <FieldTypes>(fields: Fields<FieldTypes>, action: Actions<FieldTypes>): Fields<FieldTypes> => {
  switch (action.type) {
    case ActionTypes.Reset:
      return initalizer(action.payload);
    case ActionTypes.Validate:
      return action.payload;
    case ActionTypes.Change:
      return {
        ...fields,
        [action.payload.key]: {
          value: action.payload.value,
          error: '',
        },
      };
    default:
      return fields;
  }
};
