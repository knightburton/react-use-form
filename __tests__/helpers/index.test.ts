import * as helpers from '../../src/helpers';
import { Fields } from '../../src/types';
import { REQUIRED_ERROR } from '../../src/constants';

type MockFieldTypes = { mock1: string; mock2: number };
const fields = {
  mock1: { value: '112233', error: '' },
  mock2: { value: 96, error: '' },
};
const schemaMock1 = {
  field: 'mock1',
  value: fields.mock1.value,
  required: true,
  validators: [
    { rule: /^.{3,}$/, error: 'Length must be greater than 3.' },
    { rule: (value: string): boolean => value.length <= 125, error: 'Length must be smaller or equal than 125.' },
  ],
};
const schemaMock2 = {
  field: 'mock2',
  value: fields.mock2.value,
  required: true,
  requiredError: 'I do not like this.',
};
const longValue =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent vel elementum lectus. Vestibulum quam dolor, tempus non dolor et, lacinia tincidunt leo.';
const mock = {
  mockValue: fields.mock1.value,
  mockValueAsNumber: +fields.mock1.value,
  mockErrorString: 'This is not a valid value.',
  mockErrorFunction: (x: string): string => `"${x}" is not a valid value.`,
  mockErrorFunctionResult: `"${fields.mock1.value}" is not a valid value.`,
  mockErrorFunctionFields: (x: string, innerFields: Fields<MockFieldTypes>): string => `"${x}" is not a valid value. FIELDS: ${JSON.stringify(innerFields)}`,
  mockErrorFunctionFieldsResult: `"${fields.mock1.value}" is not a valid value. FIELDS: ${JSON.stringify(fields)}`,
  mockValidators: [{ rule: (x: string): boolean => x.length === 16, error: 'The length is not valid' }],
  mockValidatorsRegexp: [{ rule: /^.{16}$/, error: 'The length is not valid - regexp' }],
};

describe('getFieldValidatorError', () => {
  it('returns an empty string - no error passed', () => {
    expect(helpers.getFieldValidatorError(mock.mockValue, fields)).toEqual('');
  });

  it('returns a valid error string - from string', () => {
    expect(helpers.getFieldValidatorError(mock.mockValue, fields, mock.mockErrorString)).toEqual(mock.mockErrorString);
  });

  it('returns a valid error string - from function with value argument', () => {
    expect(helpers.getFieldValidatorError(mock.mockValue, fields, mock.mockErrorFunction)).toEqual(mock.mockErrorFunctionResult);
  });

  it('returns a valid error string - from function with all argument', () => {
    expect(helpers.getFieldValidatorError(mock.mockValue, fields, mock.mockErrorFunctionFields)).toEqual(mock.mockErrorFunctionFieldsResult);
  });
});

describe('executeFieldValidatorsOnValue', () => {
  it('returns an empty string - empty validators array', () => {
    expect(helpers.executeFieldValidatorsOnValue(mock.mockValue, fields, [])).toEqual('');
  });

  it('returns an empty string - false validator rule and value combination', () => {
    expect(helpers.executeFieldValidatorsOnValue(mock.mockValueAsNumber, fields, mock.mockValidatorsRegexp)).toEqual('');
  });

  it('returns the given error - function based validator rule', () => {
    expect(helpers.executeFieldValidatorsOnValue(mock.mockValue, fields, mock.mockValidators)).toEqual(mock.mockValidators[0].error);
  });

  it('returns the given error - RegExp based validator rule', () => {
    expect(helpers.executeFieldValidatorsOnValue(mock.mockValue, fields, mock.mockValidatorsRegexp)).toEqual(mock.mockValidatorsRegexp[0].error);
  });
});

describe('validateFieldValue', () => {
  it('returns an empty string - no validation required', () => {
    expect(helpers.validateFieldValue(mock.mockValue, { field: schemaMock1.field, value: schemaMock1.value }, fields)).toEqual('');
  });

  it('returns an empty string - valid value', () => {
    expect(helpers.validateFieldValue(mock.mockValue, schemaMock1, fields)).toEqual('');
  });

  it('returns the default required error string - empty string value', () => {
    expect(helpers.validateFieldValue('', schemaMock1, fields)).toEqual(REQUIRED_ERROR);
  });

  it('returns the default required error string - undefined value', () => {
    expect(helpers.validateFieldValue(undefined, { ...schemaMock2, requiredError: undefined }, fields)).toEqual(REQUIRED_ERROR);
  });

  it('returns the default required error string - null value', () => {
    expect(helpers.validateFieldValue(null, { ...schemaMock2, requiredError: undefined }, fields)).toEqual(REQUIRED_ERROR);
  });

  it('returns a user specified required error string - null value', () => {
    expect(helpers.validateFieldValue(null, schemaMock2, fields)).toEqual(schemaMock2.requiredError);
  });

  it('returns a user specified validator error string - null value', () => {
    expect(helpers.validateFieldValue('12', schemaMock1, fields)).toEqual(schemaMock1.validators[0].error);
  });

  it('returns a user specified validator error string - long value', () => {
    expect(helpers.validateFieldValue(longValue, schemaMock1, fields)).toEqual(schemaMock1.validators[1].error);
  });
});
