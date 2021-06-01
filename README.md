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

### Development

### Contributing

### License
