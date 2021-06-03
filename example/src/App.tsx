import React, { useCallback } from 'react';
import useForm from '@knightburton/react-use-form';
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
const onUpdate = updateDefaultValue('Updated');
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
  resetOnSubmit: true,
  preventDefaultEventOnSubmit: true,
  useEventTargetValueOnChange: true,
});
const onUpdate = updateDefaultValue('Updated Complex');`;

const App = () => {
  const onSimpleSubmit = useCallback(simple => console.log('Simple:', simple), []);
  const {
    value: simple,
    error: simpleError,
    handleChange: onSimpleChange,
    handleSubmit: simpleHandleSubmit,
    updateDefaultValue: updateSimpleDefaultValue,
  } = useForm({
    defaultValue: '',
    valudationSchema: {},
    onSubmit: onSimpleSubmit,
    resetOnSubmit: false,
    preventDefaultEventOnSubmit: true,
    useEventTargetValueOnChange: true,
  });
  const onSimpleUpdateDefaultValue = useCallback(() => updateSimpleDefaultValue('Updated'), [updateSimpleDefaultValue]);

  const onComplexSubmit = useCallback(complex => console.log('Complex:', complex), []);
  const {
    value: complex,
    error: complexError,
    handleChange: onComplexChange,
    handleSubmit: complexHandleSubmit,
    updateDefaultValue: updateComplexDefaultValue,
  } = useForm<string>({
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
  const onComplexUpdateDefaultValue = useCallback(() => updateComplexDefaultValue('Updated Complex'), [updateComplexDefaultValue]);

  return (
    <div className="app">
      <h3>@knightburton/react-use-form</h3>
      <p>React hook to handle form change and validation.</p>
      <div className="container">
        <div className="item">
          <pre className="description">
            <code>{SIMPLE}</code>
          </pre>
          <div className="form">
            {simpleError && <span className="error">{simpleError}</span>}
            <textarea id="text" name="text" className="input" value={simple} onChange={onSimpleChange} autoComplete="off" rows={4} />
            <div className="actions">
              <input type="button" value="Update default value" className="update" onClick={onSimpleUpdateDefaultValue} />
              <input type="button" value="Submit" className="submit" onClick={simpleHandleSubmit} />
            </div>
          </div>
        </div>

        <div className="item">
          <pre className="description">
            <code>{COMPLEX}</code>
          </pre>
          <div className="form">
            {complexError && <span className="error">{complexError}</span>}
            <textarea id="text" name="text" className="input" value={complex} onChange={onComplexChange} autoComplete="off" rows={4} />
            <div className="actions">
              <input type="button" value="Update default value" className="update" onClick={onComplexUpdateDefaultValue} />
              <input type="button" value="Submit" className="submit" onClick={complexHandleSubmit} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
