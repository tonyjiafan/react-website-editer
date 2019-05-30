import React from 'react';
import { Link } from 'react-router-dom';


import logo from './logo.svg';
import './App.less';

function App() {
  return (
    <div className="App">
      <img src={logo} className="App-logo" alt="logo" />

      <Link to="webEdit">
        <span className="a-button">网站设计</span>
      </Link>
    </div>
  )
}

export default App;
