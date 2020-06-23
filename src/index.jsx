import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRouter from './AppRouter';
import store from './redux/store';

import 'antd/dist/antd.css';
import './assets/styles/main.css';

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <AppRouter/>
    </Router>
  </Provider>,
  document.getElementById('root'),
);
