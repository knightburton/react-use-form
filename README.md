# react-use-form

React hook to handle form change and validation.

### Getting started
#### Compatibility
Your project needs to use [React.js](https://reactjs.org/) 16.8 or later.

#### Installation
```bash
$ npm i @knightburton/react-use-form
```
or
```bash
yarn add @knightburton/react-use-form
```

### Usage
Here's an example of basic usage:
```jsx
import React from 'react';
import useForm from '@knightburton/react-use-form';

const App = () => {
  const onSubmit = data => console.log(data);
  const { fields, handleChange, handleSubmit } = useForm({
    schema: [{ field: 'text', value: '' }],
    onSubmit,
  });

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" id="text" name="text" value={fields.text.value} onChange={handleChange} />
      {fields.text.error && <p>{fields.text.error}</p>}
      <input type="submit" value="Submit" />
    </form>
  );
};

export default App;
```
For more detailed example check the [example](./example) directory.

### Output
The hook returns an object with the following props.
| Prop name | Type | Description |
| --- | --- | --- |
| fields | `object` | Generated fields state with values and errors. |
| handleChange | `function` | The function is used to update a value inside the fields state. It accepts an input change event. |
| handleSubmit | `function` | The function is used to submit the fields state for validation. It can accept an event, the default behaviour of that can be prevented with the `preventDefaultEventOnSubmit` option. |

### Options
The hook behaviour can be modified with the following props.
| Prop name | Type | Default Value | Description |
| --- | --- | --- | --- |
| schema | `object[]` | `[]` | Defines the initial fields state and provides the validation rulesets for later. Check the `schema` prop definitions [here](https://github.com/knightburton/react-use-form#schema-option) |
| onSubmit | `function` | `undefined` | Function called when the validation was successful after `handleSubmit` triggered. |
| resetOnSubmit | `boolean` | `false` | Whether the field values should be reseted to the default value after successful `onSubmit` or not. |
| preventDefaultEventOnSubmit | `boolean` | `true` | Whether the `handleSubmit` event default behaviour should be prevented (if event provided) or not. |

### Schema Option
The option itself is an `array of objects` and each object should look like this:
| Prop name | Type | Mandatory | Default Value | Description |
| --- | --- | --- | --- | --- |
| field | `string` | Yes | - | Identifier of the field. |
| value | `generic` | Yes | - | Defines the initial value of the field. |
| required | `boolean` | No | `false` | Defines whether teh field is required or not during the validation. |
| requiredError | `function` or `string` | No | `This field is required.` | Defines the returned error when a field marked as required. Check the error definitions [here](https://github.com/knightburton/react-use-form#validators). |
| validators | `array` | No | `[]` | Defines the validation rulesets. Check the definitions [here](https://github.com/knightburton/react-use-form#validators). |

### Validators


### Development
Local development is broken into two parts (ideally using two terminal tabs).

First, run rollup to watch your `src/` module and automatically recompile it into `dist/` whenever you make changes.
```bash
# Assume that you are in the project main folder
$ npm i
$ npm start
```
The second part will be running the `example/` create-react-app that's linked to the local version of your module.
```bash
# Assume that you are in the project main folder
$ cd example
$ npm i
$ npm start
```

### Contributing
First off all, thanks for taking the time to contribute! :muscle:

Before any action, please visit the [Code of Conduct](https://github.com/knightburton/react-use-form/blob/main/CODE_OF_CONDUCT.md) and [Contributing guideline](https://github.com/knightburton/react-use-form/blob/main/CONTRIBUTING.md) for more information.

### License

`react-use-form` is Open Source software under the MIT license. Complete license and copyright information can be found within the [license](https://github.com/knightburton/react-use-form/blob/main/LICENSE).
