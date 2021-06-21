import * as helpers from '../../src/helpers';
import { Fields } from '../../src/types';

type MockFieldTypes = { mock1: string };
const fields = {
  mock1: { value: '112233', error: '' },
};
const mock = {
  mockValue: fields.mock1.value,
  mockErrorString: 'This is not a valid value.',
  mockErrorFunction: (x: string): string => `"${x}" is not a valid value.`,
  mockErrorFunctionResult: `"${fields.mock1.value}" is not a valid value.`,
  mockErrorFunctionFields: (x: string, innerFields: Fields<MockFieldTypes>): string => `"${x}" is not a valid value. FIELDS: ${JSON.stringify(innerFields)}`,
  mockErrorFunctionFieldsResult: `"${fields.mock1.value}" is not a valid value. FIELDS: ${JSON.stringify(fields)}`,
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
