import { ConfigProvider } from 'antd';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import ruRu from 'antd/es/locale/ru_RU';
import AppRouter from './AppRouter';
import store from './redux/store';

import 'antd/dist/antd.css';
import './assets/styles/main.css';

ReactDOM.render(
  <ConfigProvider locale={ruRu}>
    <Provider store={store}>
      <Router>
        <AppRouter/>
      </Router>
    </Provider>
  </ConfigProvider>,
  document.getElementById('root'),
);
