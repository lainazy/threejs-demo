import React from 'react';
import logo from './logo.svg';
import './App.scss';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="#/lesson-list"
          rel="noopener noreferrer"
        >
          Learn Threejs
        </a>
      </header>
    </div>
  );
};

export default App;
