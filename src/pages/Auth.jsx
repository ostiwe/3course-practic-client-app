import { Card, Divider, Layout, Space } from 'antd';
import React, { Component } from 'react';
import { connect } from 'react-redux';

const { Content } = Layout;

class Auth extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Content className="app-content">
        <Divider>
          <Space direction="vertical">
            <Divider>Центр авторизации</Divider>
            <Card>
              hi here!
            </Card>
          </Space>
        </Divider>
      </Content>
    );
  }
}

function mapStateToProps(state) {
  return state;
}

export default connect(mapStateToProps)(Auth);
