import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Context from './Context';
import './main.scss';

ReactDOM.render(
  <React.StrictMode>
    <Context>
    <App />
   </Context>  
  </React.StrictMode>,
  document.getElementById('root')
);
// why do we have to wrap the children component around the context component

