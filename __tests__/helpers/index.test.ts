import * as helpers from '../../src/helpers';
import { Fields } from '../../src/types';
import { REQUIRED_ERROR } from '../../src/constants';

type FieldTypes = { field1: string; field2: number };
const error3 = 'Length must be greater than 3.';
const error125 = (value: string) => `${value} length is not <= 125`;
const error7 = (value: string, fields: Fields<FieldTypes>) => `${value} length is not === 7. FIELDS: ${JSON.stringify(fields)}`;
const errorRequired = 'I do not like this.';
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
  required: true,
  requiredError: errorRequired,
};
const fields = {
  field1: { value: field1.value, error: '' },
  field2: { value: field2.value, error: '' },
};

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
});

describe('validateFieldValue', () => {
  it('returns an empty string - no validation required', () => {
    expect(helpers.validateFieldValue(field1.value, { field: field1.field, value: field1.value }, fields)).toEqual('');
  });

  it('returns an empty string - valid value', () => {
    expect(helpers.validateFieldValue(field1.value, field1, fields)).toEqual('');
  });

  it('returns the default required error string - empty string value', () => {
    expect(helpers.validateFieldValue('', field1, fields)).toEqual(REQUIRED_ERROR);
  });

  it('returns the default required error string - undefined value', () => {
    expect(helpers.validateFieldValue(undefined, { ...field2, requiredError: undefined }, fields)).toEqual(REQUIRED_ERROR);
  });

  it('returns the default required error string - null value', () => {
    expect(helpers.validateFieldValue(null, { ...field2, requiredError: undefined }, fields)).toEqual(REQUIRED_ERROR);
  });

  it('returns a user specified required error string - null value', () => {
    expect(helpers.validateFieldValue(null, field2, fields)).toEqual(errorRequired);
  });

  it('returns a user specified validator error string - null value', () => {
    expect(helpers.validateFieldValue('12', field1, fields)).toEqual(error3);
  });

  it('returns a user specified validator error string - long value', () => {
    expect(helpers.validateFieldValue(field1.value.repeat(22), field1, fields)).toEqual(error125(field1.value.repeat(22)));
  });
});
