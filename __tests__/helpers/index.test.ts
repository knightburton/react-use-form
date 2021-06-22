import * as helpers from '../../src/helpers';
import { Fields } from '../../src/types';

type MockFieldTypes = { mock1: string };
const fields = {
  mock1: { value: '112233', error: '' },
};
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
