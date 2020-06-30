import { Button, Form, Input } from 'antd';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { API } from '../assets/js/API.ts';
import { setAccessToken, setUserInfo } from '../redux/actions/mainActions';

const { Item } = Form;

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.API = new API();
    this.formRef = React.createRef();
    this.onFinish = this.onFinish.bind(this);
  }

  onFinish() {
    const { dispatch } = this.props;
    this.formRef.current.validateFields();
    const fieldData = this.formRef.current.getFieldsValue();
    this.API.login(fieldData)
      .then((value) => {
        dispatch(setUserInfo(value.data.userInfo));
        dispatch(setAccessToken(value.data.accessToken));
        window.location.reload();
      })
      .catch((reason) => {
        console.log(reason);
      });
  }

  render() {
    return (
      <Form ref={this.formRef} onFinish={this.onFinish} layout="vertical">
        <Item
          required
          rules={[
            {
              required: true,
              message: 'Введите логин',
            },
          ]}
          label="Ваш логин"
          name="login"
        >
          <Input/>
        </Item>
        <Item
          rules={[
            {
              required: true,
              message: 'Введите пароль',
            },
          ]}
          required
          label="Ваш пароль"
          name="password"
        >
          <Input.Password/>
        </Item>
        <Item wrapperCol={{
          offset: 0,
          span: 1,
        }}
        >
          <Button htmlType="submit">
            Войти
          </Button>
        </Item>
      </Form>
    );
  }
}

function mapStateToProps(state) {
  return state;
}

export default connect(mapStateToProps)(LoginForm);
