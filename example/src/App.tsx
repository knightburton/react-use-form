import React, { useCallback } from 'react';
import useForm from '@knightburton/react-use-form';
import './App.css';

const SIMPLE = `
const onSubmit = data => console.log('simple ->', data);
const {
  state,
  handleChange,
  handleSubmit,
} = useForm({
  schema: [
    { field: 'title', value: '' },
    { field: 'description', value: '' },
  ],
  onSubmit,
  resetOnSubmit: false,
  preventDefaultEventOnSubmit: true,
  useEventTargetValueOnChange: true,
});
`;

const DETAILED = `
const onSubmit = data => console.log('detailed ->', data);
const {
  state,
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
      requiredError: 'Hey! Give me this!',
      validators: [
        { rule: /^.{3,}$/, error: 'Length must be greater than 3.' },
        {
          rule: (value: string): boolean => value.length <= 125,
          error: 'Length must be smaller or equal than 125.',
        },
      ],
    },
  ],
  onSubmit,
  resetOnSubmit: true,
  preventDefaultEventOnSubmit: true,
  useEventTargetValueOnChange: true,
});
`;

const App = () => {
  const onSubmit = useCallback(data => console.log('simple ->', data), []);
  const { state, handleChange, handleSubmit } = useForm({
    schema: [
      { field: 'title', value: '' },
      { field: 'description', value: '' },
    ],
    onSubmit,
    resetOnSubmit: false,
    preventDefaultEventOnSubmit: true,
    useEventTargetValueOnChange: true,
  });

  const onSubmitDetailed = useCallback(data => console.log('detailed ->', data), []);
  const {
    state: stateDetailed,
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
        requiredError: 'Hey! Give me this!',
        validators: [
          { rule: /^.{3,}$/, error: 'Length must be greater than 3.' },
          { rule: (value: string): boolean => value.length <= 125, error: 'Length must be smaller or equal than 125.' },
        ],
      },
    ],
    onSubmit: onSubmitDetailed,
    resetOnSubmit: true,
    preventDefaultEventOnSubmit: true,
    useEventTargetValueOnChange: true,
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
            <label htmlFor="title">title</label>
            <br />
            <input id="title" name="title" className="input" value={state.title?.value} onChange={handleChange} autoComplete="off" />
            {state.title?.error && <span className="error">{state.title.error}</span>}
            <label htmlFor="description">description</label>
            <br />
            <textarea id="description" name="description" className="input" value={state.description?.value} onChange={handleChange} autoComplete="off" rows={4} />
            {state.description?.error && <span className="error">{state.description.error}</span>}
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
            <label htmlFor="titleDetailed">title</label>
            <br />
            <input
              id="titleDetailed"
              name="titleDetailed"
              className="input"
              value={stateDetailed.titleDetailed?.value}
              onChange={handleChangeDetailed}
              autoComplete="off"
            />
            {stateDetailed.titleDetailed?.error && <span className="error">{stateDetailed.titleDetailed.error}</span>}
            <label htmlFor="descriptionDetailed">description</label>
            <br />
            <textarea
              id="descriptionDetailed"
              name="descriptionDetailed"
              className="input"
              value={stateDetailed.descriptionDetailed?.value}
              onChange={handleChangeDetailed}
              autoComplete="off"
              rows={4}
            />
            {stateDetailed.descriptionDetailed?.error && <span className="error">{stateDetailed.descriptionDetailed.error}</span>}
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
