import React from 'react';
import Input from './input';
import './App.css';

const App = () => {
  return (
    <div className="app">
      <h3>@knightburton/react-use-input</h3>
      <p className="description">Each submit result can be checked in the console.</p>
      <div className="container">
        <Input type="text" title="Text without validation" id="textWithoutValidation" defaultValue="Lorem ipsum" />
        <Input
          type="text"
          title="Text with validation"
          description="Min length function and Max length regex validators."
          id="textWithValidation"
          defaultValue=""
          valudationSchema={{
            required: true,
            requiredError: 'Hey! This is missing!',
            validators: [(value: string) => value.length > 3, /^\d{0,6}$/],
            errors: ['The number of characters must be 3 at least.', 'The number of characters can be 6 maximum.'],
          }}
        />
        <Input type="number" title="Number without validation" id="numberWithoutValidation" defaultValue={11} />
        <Input
          type="number"
          title="Number with validation"
          description="Between value function validator."
          id="numberWithValidation"
          defaultValue={0}
          valudationSchema={{
            required: true,
            validators: [(value: number) => value >= 0 && value <= 100],
            errors: ['This field must be between 0 and 100.'],
          }}
        />
      </div>
    </div>
  );
};

export default App;
