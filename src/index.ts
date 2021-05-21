import { useState, useCallback } from 'react';
import { useInputInterface } from './interfaces/index.interface';
import { getValidationError } from './helpers';

const useInput = ({ defaultValue = '', valudationSchema, callback, resetOnCallback = false }: useInputInterface) => {
  const [value, setValue] = useState(defaultValue);
  const [error, setError] = useState('');

  const handleChange = useCallback(({ target: { value: incomingValue } }) => {
    setValue(incomingValue);
    setError('');
  }, []);

  const handleSubmit = useCallback(
    event => {
      if (event) event.preventDefault();

      const validationError = getValidationError(value, valudationSchema);

      if (!validationError) {
        if (callback) callback(value);
        if (resetOnCallback) {
          setValue(defaultValue);
          setError('');
        }
        return;
      }
      setError(validationError);
    },
    [value, valudationSchema, callback, resetOnCallback, defaultValue],
  );

  const updateDefaultValue = useCallback(updateValue => setValue(updateValue), []);

  return [value, error, handleChange, handleSubmit, updateDefaultValue];
};

export default useInput;
