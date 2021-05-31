import React from 'react';
import useInput from '@knightburton/react-use-input';
import './App.css';

const App = () => {
  const { value, error, handleChange } = useInput<string>({ defaultValue: 'default value' });

  return (
    <div className="App">
      <label htmlFor="test">Simple text input: </label>
      <input type="text" id="test" name="test" value={value} onChange={handleChange} />
      {error && <p>{error}</p>}
    </div>
  );
};

export default App;
