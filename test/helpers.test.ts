import * as helpers from '../src/helpers';
import { Fields, Schema, Actions } from '../src/types';
import { REQUIRED_ERROR, INVALID_FIELD } from '../src/constants';
import { ActionTypes } from '../src/enums';

type FieldTypes = { field1: string; field2: number };
const error3 = 'Length must be greater than 3.';
const error125 = (value: string) => `${value} length is not <= 125`;
const error7 = (value: string, fields: Fields<FieldTypes>) => `${value} length is not === 7. FIELDS: ${JSON.stringify(fields)}`;
const errorRequired = 'I do not like this.';
const error4 = 'This is not 4!';
const field1 = {
  field: 'field1',
  value: '0112233',
  required: true,
  validators: [
    { rule: /^.{3,}$/, error: error3 },
    { rule: (value: string): boolean => value.length <= 125, error: error125 },
    {
      rule: (value: string): boolean => value.length === 7,
      error: error7,
    },
  ],
};
const field2 = {
  field: 'field2',
  value: 96,
  required: (): boolean => true,
  requiredError: errorRequired,
};
const field3 = {
  field: 'field3',
  value: '333333',
  required: (_: any, { field1: extra }: any): boolean => !!extra,
  requiredError: errorRequired,
};
const field4 = {
  field: 'field4',
  value: '4444',
  required: { rule: (_: any, { field1: extra }: any): boolean => !!extra, error: error4 },
  requiredError: errorRequired,
};
const fields = {
  field1: { value: field1.value, error: '' },
  field2: { value: field2.value, error: '' },
  field3: { value: field3.value, error: '' },
  field4: { value: field4.value, error: '' },
};

describe('getIsValueExists', () => {
  it('returns false on empty string', () => {
    expect(helpers.getIsValueExists('')).toEqual(false);
  });

  it('returns true on valid string', () => {
    expect(helpers.getIsValueExists(field1.value)).toEqual(true);
  });

  it('returns false on null', () => {
    expect(helpers.getIsValueExists(null)).toEqual(false);
  });

  it('returns false on undefined', () => {
    expect(helpers.getIsValueExists(undefined)).toEqual(false);
  });

  it('returns true on number', () => {
    expect(helpers.getIsValueExists(field2.value)).toEqual(true);
  });

  it('returns true on array', () => {
    expect(helpers.getIsValueExists([])).toEqual(true);
  });
});

describe('getFieldValidatorError', () => {
  it('returns an empty string - no error passed', () => {
    expect(helpers.getFieldValidatorError(field1.value, fields)).toEqual('');
  });

  it('returns a valid error string - from string', () => {
    expect(helpers.getFieldValidatorError(field1.value, fields, field1.validators[0].error)).toEqual(error3);
  });

  it('returns a valid error string - from function with value argument', () => {
    expect(helpers.getFieldValidatorError(field1.value, fields, field1.validators[1].error)).toEqual(error125(field1.value));
  });

  it('returns a valid error string - from function with all argument', () => {
    expect(helpers.getFieldValidatorError(field1.value, fields, field1.validators[2].error)).toEqual(error7(field1.value, fields));
  });
});

describe('getFieldValidatorResult', () => {
  it('returns true boolean value - false validator rule', () => {
    expect(helpers.getFieldValidatorResult(/^.{3,}$/, field1.value, fields)).toEqual(true);
  });

  it('returns true boolean value - function based validator rule', () => {
    expect(helpers.getFieldValidatorResult(field1.validators[1].rule, field1.value, fields)).toEqual(true);
  });

  it('returns true boolean value - RegExp based validator rule', () => {
    expect(helpers.getFieldValidatorResult(field1.validators[0].rule, field1.value, fields)).toEqual(true);
  });

  it('returns false boolean value - function based validator rule', () => {
    expect(helpers.getFieldValidatorResult(field1.validators[2].rule, '66666', fields)).toEqual(false);
  });

  it('returns false boolean value - RegExp based validator rule', () => {
    expect(helpers.getFieldValidatorResult(field1.validators[0].rule, '22', fields)).toEqual(false);
  });
});

describe('executeFieldValidatorsOnValue', () => {
  it('returns an empty string - empty validators array', () => {
    expect(helpers.executeFieldValidatorsOnValue(field1.value, fields, [])).toEqual('');
  });

  it('returns an empty string - false validator rule and value combination', () => {
    expect(helpers.executeFieldValidatorsOnValue(123, fields, [{ rule: /^.{3,}$/, error: error3 }])).toEqual('');
  });

  it('returns the given error - function based validator rule', () => {
    expect(helpers.executeFieldValidatorsOnValue(`0${field1.value}`, fields, field1.validators)).toEqual(error7(`0${field1.value}`, fields));
  });

  it('returns the given error - RegExp based validator rule', () => {
    expect(helpers.executeFieldValidatorsOnValue(field1.value.slice(0, 2), fields, field1.validators)).toEqual(error3);
  });

  it('returns the default error - invalid error declaration on validator', () => {
    expect(helpers.executeFieldValidatorsOnValue(field1.value, fields, [{ rule: /^.{333,}$/, error: '' }])).toEqual(INVALID_FIELD);
  });
});

describe('validateFieldValue', () => {
  it('returns an empty string - no validation required', () => {
    expect(helpers.validateFieldValue(field1.value, { field: field1.field, value: field1.value }, fields)).toEqual('');
  });

  it('returns an empty string - valid value', () => {
    expect(helpers.validateFieldValue(field1.value, field1, fields)).toEqual('');
  });

  it('returns an empty string - valid value + function where the require value will be false', () => {
    expect(helpers.validateFieldValue(field3.value, field3, { ...fields, field1: { value: '', error: '' } })).toEqual('');
  });

  it('returns an empty string - valid value + validator', () => {
    expect(helpers.validateFieldValue(field4.value, field4, fields)).toEqual('');
  });

  it('returns the default required error string - empty string value', () => {
    expect(helpers.validateFieldValue('', field1, fields)).toEqual(REQUIRED_ERROR);
  });

  it('returns the default required error string - empty string value + validator', () => {
    expect(helpers.validateFieldValue('', { ...field4, required: { rule: () => false }, requiredError: undefined }, fields)).toEqual(REQUIRED_ERROR);
  });

  it('returns the default required error string - empty string value + function', () => {
    expect(helpers.validateFieldValue('', { ...field3, requiredError: undefined }, fields)).toEqual(REQUIRED_ERROR);
  });

  it('returns the default required error string - undefined value', () => {
    expect(helpers.validateFieldValue(undefined, { ...field2, requiredError: undefined }, fields)).toEqual(REQUIRED_ERROR);
  });

  it('returns the default required error string - undefined value + function', () => {
    expect(helpers.validateFieldValue(undefined, { ...field3, requiredError: undefined }, fields)).toEqual(REQUIRED_ERROR);
  });

  it('returns the default required error string - null value', () => {
    expect(helpers.validateFieldValue(null, { ...field2, requiredError: undefined }, fields)).toEqual(REQUIRED_ERROR);
  });

  it('returns the default required error string - null value + function', () => {
    expect(helpers.validateFieldValue(null, { ...field3, requiredError: undefined }, fields)).toEqual(REQUIRED_ERROR);
  });

  it('returns a user specified required error string - null value', () => {
    expect(helpers.validateFieldValue(null, field2, fields)).toEqual(errorRequired);
  });

  it('returns a user specified required error string - null value + validator', () => {
    expect(helpers.validateFieldValue(null, { ...field4, required: { rule: () => false }, requiredError: field4.requiredError }, fields)).toEqual(errorRequired);
  });

  it('returns a user specified required error string - null value + function', () => {
    expect(helpers.validateFieldValue(null, field3, fields)).toEqual(errorRequired);
  });

  it('returns a user specified validator error string - null value', () => {
    expect(helpers.validateFieldValue('12', field1, fields)).toEqual(error3);
  });

  it('returns a user specified required validator error string - null value + validator', () => {
    expect(helpers.validateFieldValue(null, { ...field4, required: { rule: () => false, error: field4.required.error } }, fields)).toEqual(error4);
  });

  it('returns a user specified validator error string - long value', () => {
    expect(helpers.validateFieldValue(field1.value.repeat(22), field1, fields)).toEqual(error125(field1.value.repeat(22)));
  });
});

describe('validateFields', () => {
  it('returns empty fields and valid flag - empty schema', () => {
    expect(helpers.validateFields({} as Fields<FieldTypes>, [])).toEqual({ validatedFields: {}, areFieldsValid: true });
  });

  it('returns fields and valid flag - valid schema', () => {
    expect(helpers.validateFields(fields, [field1, field2, field3, field4] as Schema<FieldTypes>)).toEqual({ validatedFields: fields, areFieldsValid: true });
  });

  it('returns fields and invalid flag - invalid schema', () => {
    const field = { ...fields.field1, value: `12` };
    const fieldWithError = { value: `12`, error: error3 };
    expect(helpers.validateFields({ ...fields, field1: field }, [field1, field2, field3, field4] as Schema<FieldTypes>)).toEqual({
      validatedFields: { ...fields, field1: fieldWithError },
      areFieldsValid: false,
    });
  });
});

describe('initializer', () => {
  it('returns an empty fields object - empty schema', () => {
    expect(helpers.initializer([] as Schema<FieldTypes>)).toEqual({});
  });

  it('returns the fields object - valid schema', () => {
    expect(helpers.initializer([field1, field2, field3, field4] as Schema<FieldTypes>)).toEqual(fields);
  });
});

describe('reducer', () => {
  it('returns the previous state - invalid action', () => {
    expect(helpers.reducer(fields, {} as Actions<FieldTypes>)).toEqual(fields);
  });

  it('returns empty state state - invalid action', () => {
    expect(helpers.reducer({} as Fields<FieldTypes>, {} as Actions<FieldTypes>)).toEqual({});
  });

  it('returns the initial state - reset action', () => {
    expect(helpers.reducer({} as Fields<FieldTypes>, { type: ActionTypes.Reset, payload: [field1, field2, field3, field4] as Schema<FieldTypes> })).toEqual(fields);
  });

  it('returns the validated state - validate action', () => {
    expect(helpers.reducer(fields, { type: ActionTypes.Validate, payload: fields })).toEqual(fields);
  });

  it('returns the updated state - change action - field1', () => {
    expect(helpers.reducer(fields, { type: ActionTypes.Change, payload: { key: 'field1', value: '1' } })).toEqual({ ...fields, field1: { value: '1', error: '' } });
  });
});

describe('extractFieldValues', () => {
  it('returns an empty object - empty fields', () => {
    expect(helpers.extractFieldValues({})).toEqual({});
  });

  it('returns a key value paired object - valid fields state', () => {
    expect(helpers.extractFieldValues(fields)).toEqual({ field1: field1.value, field2: field2.value, field3: field3.value, field4: field4.value });
  });
});
