import React, { useCallback } from 'react';
import useInput from '@knightburton/react-use-input';
import './App.css';

const SIMPLE = `
const onSubmit = simple => console.log('Simple:', simple);
const {
  value,
  error,
  handleChange,
  handleSubmit,
  updateDefaultValue,
} = useInput({
  defaultValue: '',
  valudationSchema: {},
  onSubmit: onSubmit,
  resetOnSubmit: false,
  preventDefaultEventOnSubmit: true,
  useEventTargetValueOnChange: true,
});
const onReset = updateDefaultValue('');
`;

const COMPLEX = `
const onSubmit = complex => console.log('Complex:', complex);
const {
  value,
  error,
  handleChange,
  handleSubmit,
  updateDefaultValue,
} = useInput({
  defaultValue: 'Complex',
  valudationSchema: {
    required: true,
    requiredError: 'Hey! Give me this!',
    validators: [
      /^.{3,}$/,
      value => value.length <= 125,
    ],
    errors: [
      'Length must be greater than 3.',
      'Length must be smaller or equal than 125.',
    ],
  },
  onSubmit: onSubmit,
  resetOnSubmit: false,
  preventDefaultEventOnSubmit: true,
  useEventTargetValueOnChange: true,
});
const onReset = updateDefaultValue('Complex');`;

const App = () => {
  const onSimpleSubmit = useCallback(simple => console.log('Simple:', simple), []);
  const {
    value: simple,
    error: simpleError,
    handleChange: onSimpleChange,
    handleSubmit: simpleHandleSubmit,
    updateDefaultValue: updateSimpleDefaultValue,
  } = useInput({
    defaultValue: '',
    valudationSchema: {},
    onSubmit: onSimpleSubmit,
    resetOnSubmit: false,
    preventDefaultEventOnSubmit: true,
    useEventTargetValueOnChange: true,
  });
  const onSimpleReset = useCallback(() => updateSimpleDefaultValue(''), [updateSimpleDefaultValue]);

  const onComplexSubmit = useCallback(complex => console.log('Complex:', complex), []);
  const {
    value: complex,
    error: complexError,
    handleChange: onComplexChange,
    handleSubmit: complexHandleSubmit,
    updateDefaultValue: updateComplexDefaultValue,
  } = useInput({
    defaultValue: 'Complex',
    valudationSchema: {
      required: true,
      requiredError: 'Hey! Give me this!',
      validators: [/^.{3,}$/, (value: string) => value.length <= 125],
      errors: ['Length must be greater than 3.', 'Length must be smaller or equal than 125.'],
    },
    onSubmit: onComplexSubmit,
    resetOnSubmit: true,
    preventDefaultEventOnSubmit: true,
    useEventTargetValueOnChange: true,
  });
  const onComplexReset = useCallback(() => updateComplexDefaultValue('Complex'), [updateComplexDefaultValue]);

  return (
    <div className="app">
      <h3>@knightburton/react-use-input</h3>
      <p>React hook to handle controlled input change and validation.</p>
      <div className="container">
        <div className="item">
          <pre className="description">
            <code>{SIMPLE}</code>
          </pre>
          <form onSubmit={simpleHandleSubmit} className="form">
            {simpleError && <span className="error">{simpleError}</span>}
            <textarea id="text" name="text" className="input" value={simple} onChange={onSimpleChange} autoComplete="off" rows={4} />
            <div className="actions">
              <input type="button" value="Reset" className="reset" onClick={onSimpleReset} />
              <input type="submit" value="Submit" className="submit" />
            </div>
          </form>
        </div>

        <div className="item">
          <pre className="description">
            <code>{COMPLEX}</code>
          </pre>
          <form onSubmit={complexHandleSubmit} className="form">
            {complexError && <span className="error">{complexError}</span>}
            <textarea id="text" name="text" className="input" value={complex} onChange={onComplexChange} autoComplete="off" rows={4} />
            <div className="actions">
              <input type="button" value="Reset" className="reset" onClick={onComplexReset} />
              <input type="submit" value="Submit" className="submit" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default App;
