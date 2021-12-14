import React, { useCallback } from 'react';
import useForm from '@knightburton/react-use-form';
import './App.css';

interface IForm {
  type: string;
  title: string;
  description: string;
}

const CODE = `const onSubmit = useCallback(data => console.log('submit data ->', data), []);
const { fields, handleChange, handleSubmit } = useForm<IForm>({
  schema: [
    {
      field: 'type',
      value: '',
      required: true,
    },
    {
      field: 'title',
      value: '',
      required: true,
      requiredError: 'What about this one ?!',
      validators: [{ rule: /^.{3,}$/, error: 'Length must be greater than 3.' }],
    },
    {
      field: 'description',
      value: 'Lorem ipsum',
      required: true,
      validators: [
        { rule: /^.{3,}$/, error: 'Length must be greater than 3.' },
        { rule: (value: string): boolean => value.length <= 125, error: 'Length must be smaller or equal than 125.' },
      ],
    },
  ],
  onSubmit,
  useDirectOnChange: false,
  resetOnSubmit: true,
});`;

const App = () => {
  const onSubmit = useCallback(data => console.log('submit data ->', data), []);
  const { fields, handleChange, handleSubmit } = useForm<IForm>({
    schema: [
      {
        field: 'type',
        value: '',
        required: true,
      },
      {
        field: 'title',
        value: '',
        required: true,
        requiredError: 'What about this one ?!',
        validators: [{ rule: /^.{3,}$/, error: 'Length must be greater than 3.' }],
      },
      {
        field: 'description',
        value: 'Lorem ipsum',
        required: true,
        validators: [
          { rule: /^.{3,}$/, error: 'Length must be greater than 3.' },
          { rule: (value: string): boolean => value.length <= 125, error: 'Length must be smaller or equal than 125.' },
        ],
      },
    ],
    onSubmit,
    resetOnSubmit: true,
  });

  return (
    <div className="app">
      <h3>@knightburton/react-use-form</h3>
      <p>React hook to handle form change and validation.</p>
      <div className="container">
        <div className="item">
          <pre className="description">
            <code>{CODE}</code>
          </pre>
          <div className="form">
            <form onSubmit={handleSubmit}>
              <div className="flex-row">
                <div className="relative">
                  <select id="type" name="type" className="select" value={fields.type.value} onChange={handleChange}>
                    <option value="">Select type...</option>
                    <option value="simple">Simple</option>
                    <option value="complex">Complex</option>
                  </select>
                  {fields.type?.error && <span className="error">{fields.type.error}</span>}
                </div>
                <div className="flex-grow relative">
                  <input id="title" name="title" className="input" value={fields.title.value} onChange={handleChange} autoComplete="off" placeholder="Title" />
                  {fields.title?.error && <span className="error">{fields.title.error}</span>}
                </div>
              </div>
              <div className="relative">
                <textarea
                  id="description"
                  name="description"
                  className="textarea"
                  value={fields.description?.value}
                  onChange={handleChange}
                  autoComplete="off"
                  rows={4}
                  placeholder="Description"
                />
                {fields.description?.error && <span className="error">{fields.description.error}</span>}
              </div>
              <div className="actions">
                <input type="submit" value="Submit" className="submit" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
