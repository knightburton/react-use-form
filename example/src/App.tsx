import React, { useCallback } from 'react';
import useForm from '@knightburton/react-use-form';
import './App.css';

const SIMPLE = `const {
  fields,
  handleChange,
  handleSubmit,
} = useForm({
  schema: [
    { field: 'title', value: '' },
    { field: 'description', value: '' },
  ],
  onSubmit: data => console.log('simple ->', data),
});`;

const DETAILED = `const {
  fields,
  handleChange,
  handleSubmit,
} = useForm({
  schema: [
    {
      field: 'titleDetailed',
      value: '',
      required: true,
      requiredError: 'What about this one ?!',
      validators: [
        {
          rule: /^.{3,}$/,
          error: 'Length must be greater than 3.',
        },
      ],
    },
    {
      field: 'descriptionDetailed',
      value: 'Lorem ipsum',
      required: true,
      validators: [
        {
          rule: /^.{3,}$/,
          error: 'Length must be greater than 3.',
        },
        {
          rule: (value: string): boolean => value.length <= 125,
          error: 'Length must be smaller or equal than 125.',
        },
      ],
    },
  ],
  onSubmit: data => console.log('detailed ->', data),
  resetOnSubmit: true,
});`;

const App = () => {
  const onSubmit = useCallback(data => console.log('simple ->', data), []);
  const { fields, handleChange, handleSubmit } = useForm({
    schema: [
      { field: 'title', value: '' },
      { field: 'description', value: '' },
    ],
    onSubmit,
  });

  const onSubmitDetailed = useCallback(data => console.log('detailed ->', data), []);
  const {
    fields: fieldsDetailed,
    handleChange: handleChangeDetailed,
    handleSubmit: handleSubmitDetailed,
  } = useForm({
    schema: [
      {
        field: 'titleDetailed',
        value: '',
        required: true,
        requiredError: 'What about this one ?!',
        validators: [{ rule: /^.{3,}$/, error: 'Length must be greater than 3.' }],
      },
      {
        field: 'descriptionDetailed',
        value: 'Lorem ipsum',
        required: true,
        validators: [
          { rule: /^.{3,}$/, error: 'Length must be greater than 3.' },
          { rule: (value: string): boolean => value.length <= 125, error: 'Length must be smaller or equal than 125.' },
        ],
      },
    ],
    onSubmit: onSubmitDetailed,
    resetOnSubmit: true,
  });

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
            <div className="inputContainer">
              <label htmlFor="title" className="label">
                Title:
              </label>
              <br />
              <input id="title" name="title" className="input" value={fields.title?.value} onChange={handleChange} autoComplete="off" />
              {fields.title?.error && <span className="error">{fields.title.error}</span>}
            </div>
            <div className="inputContainer">
              <label htmlFor="description" className="label">
                Description:
              </label>
              <br />
              <textarea id="description" name="description" className="input" value={fields.description?.value} onChange={handleChange} autoComplete="off" rows={4} />
              {fields.description?.error && <span className="error">{fields.description.error}</span>}
            </div>

            <div className="actions">
              <input type="button" value="Submit" className="submit" onClick={handleSubmit} />
            </div>
          </div>
        </div>

        <div className="item">
          <pre className="description">
            <code>{DETAILED}</code>
          </pre>
          <div className="form">
            <div className="inputContainer">
              <label htmlFor="titleDetailed" className="label">
                Title:
              </label>
              <br />
              <input
                id="titleDetailed"
                name="titleDetailed"
                className="input"
                value={fieldsDetailed.titleDetailed?.value}
                onChange={handleChangeDetailed}
                autoComplete="off"
              />
              {fieldsDetailed.titleDetailed?.error && <span className="error">{fieldsDetailed.titleDetailed.error}</span>}
            </div>
            <div className="inputContainer">
              <label htmlFor="descriptionDetailed" className="label">
                Description:
              </label>
              <br />
              <textarea
                id="descriptionDetailed"
                name="descriptionDetailed"
                className="input"
                value={fieldsDetailed.descriptionDetailed?.value}
                onChange={handleChangeDetailed}
                autoComplete="off"
                rows={4}
              />
              {fieldsDetailed.descriptionDetailed?.error && <span className="error">{fieldsDetailed.descriptionDetailed.error}</span>}
            </div>

            <div className="actions">
              <input type="button" value="Submit" className="submit" onClick={handleSubmitDetailed} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
