import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import thunk from 'redux-thunk'
import {rootReducer} from './redux/reducers/rootReducer'
import {createStore, applyMiddleware} from 'redux'
import {Provider} from 'react-redux'
const store = createStore(rootReducer, applyMiddleware(thunk));

if (!sessionStorage.getItem("Auth")){
  sessionStorage.setItem("Auth", false);  //by default the user is logged out
}

ReactDOM.render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
