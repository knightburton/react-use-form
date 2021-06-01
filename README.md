# react-use-input

React hook to handle controlled input change and validation.

### Getting started
#### Compatibility
Your project needs to use [React.js](https://reactjs.org/) 16.8 or later.

#### Installation
```bash
$ npm i @knightburton/react-use-input
```
or
```bash
yarn add @knightburton/react-use-input
```

### Usage
Here's an example of basic usage:
```jsx
import React from 'react';
import useInput from '@knightburton/react-use-input';

const App = () => {
  const onSubmit = data => console.log(data);
  const { value, error, handleChange, handleSubmit } = useInput({
    defaultValue: '',
    valudationSchema: {
      required: true,
    },
    onSubmit,
  });

  return (
    <div>
      <input type="text" id="text" name="text" value={value} onChange={handleChange} />
      {error && <p>{error}</p>}
      <input type="button" value="Submit" onClick={handleSubmit} />
    </div>
  );
};

export default App;
```
For more detailed example check the [example](./example) directory.

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

Before any action, please visit the [Code of Conduct](https://github.com/knightburton/react-use-input/blob/main/CODE_OF_CONDUCT.md) and [Contributing guideline](https://github.com/knightburton/react-use-input/blob/main/CONTRIBUTING.md) for more information.

### License

`react-use-input` is Open Source software under the MIT license. Complete license and copyright information can be found within the [license](https://github.com/knightburton/react-use-input/blob/main/LICENSE).
