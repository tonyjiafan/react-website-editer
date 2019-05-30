import React from 'react';
import { Route } from 'react-router-dom';

import App from './components/app/App';
import WebEditWarp from './components/website/index';


export default (
  <div className="container">
    <Route exact path="/" component={ App } />
    <Route path="/webEdit" component={ WebEditWarp } />
  </div>
)
