import { ActionTypes } from '../enums';
import { REQUIRED_REGEX, REQUIRED_ERROR, INVALID_FIELD } from '../constants';
import type { Schema, ValidatorRule, ValidatorError, SchemaField, Fields, Actions, Validator, ValidationResult } from '../types';

/**
 * Extracts all the values from the fields object and reduce them into a smaller key value pair based object.
 *
 * @param fields Actual field objects with values and errors.
 * @returns Actual field object with values only.
 */
export const extractFieldValues = <FieldTypes extends { [key: string]: any }>(fields: Fields<FieldTypes>): FieldTypes =>
  Object.keys(fields).reduce((acc, field) => ({ ...acc, [field]: fields[field].value }), {} as FieldTypes);

/**
 * Checks if the given incoming parameter is exists or not as a usable value.
 *
 * @param value Field value to check the existance on.
 * @returns Boolean based on the given value.
 */
export const getIsValueExists = <Value>(value: Value): boolean => (typeof value === 'string' ? REQUIRED_REGEX.test(value) : value !== null && value !== undefined);

/**
 * Finds the error message for the given field.
 * If the error is a function then it will pass all the available fields and value to the user custom error handler.
 *
 * @param value Field value to pass to the error.
 * @param fields All the fields to pass to the error.
 * @param error Actual error that will be used or executed.
 * @returns Error message or empty string if no error message passed.
 */
export const getFieldValidatorError = <Value, FieldTypes>(value: Value, fields: FieldTypes, error?: ValidatorError<Value, FieldTypes>): string => {
  if (typeof error === 'function') return error(value, fields);
  if (typeof error === 'string') return error;
  return '';
};

/**
 * Checks whether the given field is valid on the given validator rule.
 *
 * @param rule Actual validator rule to check and run on the value.
 * @param value Field value to execute the validator on
 * @param fields All the fields to pass to the custom validators.
 * @returns A boolean value based on that the field is valid or not.
 */
export const getFieldValidatorResult = <Value, FieldTypes>(rule: ValidatorRule<Value, FieldTypes>, value: Value, fields: FieldTypes): boolean => {
  if (typeof rule === 'function') return rule(value, fields);
  if (rule instanceof RegExp && typeof value === 'string') return rule.test(value);
  // If there is no valid rule consider the field as valid.
  return true;
};

/**
 * Runs all the given validator on the given field value and finds the error for the invalid one.
 *
 * @param value Field value to execute the validator on.
 * @param fields All the fields to pass to the custom validators.
 * @param validators All the validators that associated with the actual field.
 * @returns An error string in case of invalid validator or an empty string otherwise.
 */
export const executeFieldValidatorsOnValue = <Value, FieldTypes>(value: Value, fields: FieldTypes, validators: Validator<Value, FieldTypes>[]): string => {
  const invalidValidator = validators.find(({ rule }) => !getFieldValidatorResult(rule, value, fields));
  return invalidValidator ? getFieldValidatorError(value, fields, invalidValidator.error || INVALID_FIELD) : '';
};

/**
 * Validates the given value based on the determined schema.
 *
 * @param value Field value to validate.
 * @param schemaField Field schema to get the errors and validators from.
 * @param fields All the fields to pass to the custom validators.
 * @returns An error message in case of invalid field value, or an empty string otherwise.
 */
export const validateFieldValue = <Key, Value, FieldTypes>(value: Value, schemaField: SchemaField<Key, Value, FieldTypes>, fields: FieldTypes): string => {
  const { required, requiredError, validators } = schemaField;
  if (required && typeof required === 'function' && required(value, fields) && !getIsValueExists(value))
    return getFieldValidatorError(value, fields, requiredError || REQUIRED_ERROR);
  if (required && typeof required === 'boolean' && !getIsValueExists(value)) return getFieldValidatorError(value, fields, requiredError || REQUIRED_ERROR);
  if (validators && value) return executeFieldValidatorsOnValue(value, fields, validators);
  return '';
};

/**
 * Validates the given fields based on the validators in the schema and determines wheater the whole fields attribute is valid or not.
 * (The fields are overall valid if there is no invalid field in it.)
 *
 * @param fields Actual field objects with values and errors to validate.
 * @param schema Inner state schema to get the fields from.
 * @returns The validated state fields and a flag that indicates the whole state is valid or not.
 */
export const validateFields = <FieldTypes>(fields: Fields<FieldTypes>, schema: Schema<FieldTypes>): ValidationResult<FieldTypes> => {
  const extractedFields = extractFieldValues<FieldTypes>(fields);
  return schema.reduce(
    (o: ValidationResult<FieldTypes>, schemaField) => {
      const value = extractedFields[schemaField.field];
      const error = validateFieldValue(value, schemaField, extractedFields);
      const validatedFields = {
        ...o.validatedFields,
        [schemaField.field]: { value, error },
      };
      const areFieldsValid = o.areFieldsValid && !error;
      return { validatedFields, areFieldsValid };
    },
    { validatedFields: {} as Fields<FieldTypes>, areFieldsValid: true },
  );
};

/**
 * Creates the inner state schema with init values.
 *
 * @param schema State schema to start with.
 * @returns Enhanced inner state with init values.
 */
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

/**
 * Reducer for the inner form state.
 *
 * @param fields Actual field objects with values and errors.
 * @param action Current action that should go through in the reducer.
 * @returns A new state object.
 */
export const reducer = <FieldTypes extends { [key: string]: any }>(fields: Fields<FieldTypes>, action: Actions<FieldTypes>): Fields<FieldTypes> => {
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
