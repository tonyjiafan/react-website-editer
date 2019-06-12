import React from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

import logo from './logo.svg';
import './App.less';

import NumberInput from '../counter/counter';

function App() {
  return (
    <div className="App">
      <img src={logo} className="App-logo" alt="logo" />
      
      <div>
        <NumberInput />
        <Link to="webEdit">
          <span className="a-button">网站设计</span>
        </Link>
      </div>
      
    </div>
  )
}

export default withRouter(App);
