import React, { useCallback } from 'react';
import useInput from '@knightburton/react-use-input';
import { InputProps } from '../interfaces';

const Input = ({ title, description, type, id, defaultValue, valudationSchema }: InputProps) => {
  const onSubmit = useCallback((data: any) => console.log(title ? `${title}:` : 'onSubmit', data), [title]);
  const { value, error, handleChange, handleSubmit, updateDefaultValue } = useInput({
    defaultValue: defaultValue,
    onSubmit,
    valudationSchema,
  });
  const onReset = useCallback(() => updateDefaultValue(defaultValue), [updateDefaultValue, defaultValue]);

  return (
    <div className="card">
      <form onSubmit={handleSubmit} className="form">
        <p className="title">
          {title || 'Unknown title'}
        </p>
        {description && <p className="description">{description}</p>}
        <input type={type} id={id} name={id} className="input" value={value} onChange={handleChange} autoComplete="off" />
        {error && <span className="error">{error}</span>}
        <div className="actions">
          <input type="button" value="Reset" className="reset" onClick={onReset} />
          <input type="submit" value="Submit" className="submit" />
        </div>
      </form>
    </div>
  );
};

export default Input;
