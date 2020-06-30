import LoadingOutlined from '@ant-design/icons/lib/icons/LoadingOutlined';
import {
  Card, Divider, Layout, Space, Spin,
} from 'antd';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { API } from '../assets/js/API.ts';
import { LoginForm } from '../components';
import { setAccessToken, setUserInfo } from '../redux/actions/mainActions';

const { Content } = Layout;

class Auth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstLoad: true,
      action: 'login',
    };
    this.API = new API();

    this.tryAutoLogin = this.tryAutoLogin.bind(this);
  }

  componentDidMount() {
    setTimeout(this.tryAutoLogin, 1000);
  }

  tryAutoLogin() {
    const { dispatch, history } = this.props;
    if (!this.API.hasAccessToken()) {
      this.setState({ firstLoad: false });
      return;
    }
    this.API.getUserInfo()
      .then((response) => {
        console.log('Auth response', response);
        dispatch(setUserInfo(response.data.userInfo));
        dispatch(setAccessToken(response.data.accessToken));
        history.push('/cp');
      })
      .catch(() => this.setState({ firstLoad: false }));
  }

  render() {
    const { firstLoad, action } = this.state;
    return (
      <Content className="app-content app-content__center">
        <div>
          <Space direction="vertical">
            <Divider><h2>Центр авторизации</h2></Divider>
            <Card className="app-auth-wrapper" data-load={firstLoad}>
              {firstLoad && (
                <Space align="center" direction="vertical">
                  <Spin indicator={<LoadingOutlined style={{ fontSize: '100px' }}/>}/>
                  <span>Пытаемся вас авторизовать...</span>
                </Space>
              )}
              {!firstLoad && (action === 'login' ? <LoginForm/> : 'reg')}

              {!firstLoad && (
                <div className="app-auth-wrapper__footer">
                  <Space>
                    <Link
                      to="/auth"
                      onClick={() => this.setState({ action: 'login' })}
                    >
                      Вход
                    </Link>
                    <Link
                      to="/auth"
                      onClick={() => this.setState({ action: 'register' })}
                    >
                      Регистрация
                    </Link>
                  </Space>
                </div>
              )}
            </Card>
          </Space>
        </div>
      </Content>
    );
  }
}

function mapStateToProps(state) {
  return {
    userInfo: state.userInfo,
  };
}

export default connect(mapStateToProps)(Auth);
