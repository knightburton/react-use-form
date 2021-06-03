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
  const { state, handleChange, handleSubmit } = useForm({
    schema: {},
    valudationSchema: {},
    onSubmit,
  });

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" id="text" name="text" value={value} onChange={handleChange} />
      {error && <p>{error}</p>}
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
| state | `object` | State schema |
| handleChange | `function` | The function is used to update the a value inside the form state. It accepts a direct new value or input change event, depends on the `useEventTargetValueOnChange` option. |
| handleSubmit | `function` | The function is used to submit the state for validation. It can accept an event, the default behaviour of that can be prevented with the `preventDefaultEventOnSubmit` option. |

### Options
The hook behaviour can be modified with the following props.
| Prop name | Type | Default Value | Description |
| --- | --- | --- | --- |
| schema | `object` | `{}` | Defines the initial state schema. |
| valudationSchema | `object` | `{}` | Object of validation rules and corresponding errors. Check the prop definition [here](https://github.com/knightburton/react-use-form#validation-schema). |
| onSubmit | `function` | `undefined` | Function called when the validation was successful after `handleSubmit` triggered. |
| resetOnSubmit | `boolean` | `false` | Whether the value should be reseted to the default value after successful `onSubmit` or not. |
| useEventTargetValueOnChange | `boolean` | `true` | Whether the `handleChange` should destruct the value from the input event or not. |
| preventDefaultEventOnSubmit | `boolean` | `true` | Whether the `handleSubmit` event default behaviour should be prevented (if event provided) or not. |

### Validation Schema
The prop definition of validation rules and errors.
| Prop name | Type | Description |
| --- | --- | --- |

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
