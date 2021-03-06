import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch, withRouter } from 'react-router-dom';
import {
  Button, Layout, Result,
} from 'antd';
import HomeOutlined from '@ant-design/icons/lib/icons/HomeOutlined';
import { Auth, ControlPanel } from './pages';

const { Content } = Layout;

const appRoutes = [
  {
    path: '/auth',
    ex: true,
    component: Auth,
  },
  {
    path: '/cp',
    component: ControlPanel,
  },
];

class AppRouter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { userInfo, history } = this.props;
    if (!userInfo) {
      history.push('/auth');
    }
  }

  render() {
    const { history } = this.props;
    return (
      <Layout>
        <Switch>
          {appRoutes.map((route) => (
            <Route
              key={route.path}
              exact={route.ex}
              path={route.path}
              component={route.component}
            />
          ))}

          {/* 404 handler */}
          <Route path="*">
            <Content className="app-content">
              <Result
                status={404}
                title="Page Not Found"
                extra={(
                  <Button
                    icon={<HomeOutlined/>}
                    onClick={() => history.push('/')}
                  >
                    Go Home
                  </Button>
                )}
              />
            </Content>
          </Route>
        </Switch>
      </Layout>
    );
  }
}

function stateToProps(state) {
  return {
    userInfo: state.userInfo,
  };
}

AppRouter.defaultProps = {};
AppRouter.propTypes = {};

export default withRouter(connect(stateToProps)(AppRouter));
