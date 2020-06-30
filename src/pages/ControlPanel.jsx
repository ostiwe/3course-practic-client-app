import {
  Badge,
  Button, Card, DatePicker, Descriptions, Divider, Drawer, Form, Input, Layout, List, message,
  PageHeader,
  Select,
  Space, TimePicker,
  Tooltip,
} from 'antd';
import RcQueueAnim from 'rc-queue-anim';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Chart from 'chart.js';
import moment from 'moment';
import { API } from '../assets/js/API.ts';
import 'moment/locale/ru';

moment.locale('ru');

const { Content } = Layout;

class ControlPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      autoList: [],
      currentTime: 0,
      needMoreItems: false,
      autoPage: 1,
      noMoreAutoPages: false,
      drawerOpen: false,
      drawerWorkshopsOpen: false,
      workshops: [],
      models: [],
      users: [],
    };
    this.API = new API();

    this.updateTimeID = null;
    this.updateStatsID = null;

    this.getAutos = this.getAutos.bind(this);
    this.getAutoStats = this.getAutoStats.bind(this);
    this.updateTime = this.updateTime.bind(this);
    this.removeAuto = this.removeAuto.bind(this);
  }

  componentDidMount() {
    this.updateTime();
    this.updateTimeID = setInterval(this.updateTime, 5000);
    this.updateStatsID = setInterval(this.getAutoStats, 60000);

    const { userInfo } = this.props;
    if (userInfo) {
      this.getAutos();
      this.getAutoStats();

      this.API.getModels()
        .then((response) => {
          this.setState({ models: response.items });
        });
      this.API.getWorkshops()
        .then((response) => {
          this.setState({ workshops: response.items });
        });
    }
  }

  componentWillUnmount() {
    clearInterval(this.updateTimeID);
    clearInterval(this.updateStatsID);
  }

  getAutos() {
    const { autoPage, noMoreAutoPages, autoList } = this.state;

    return new Promise((resolve, reject) => {
      // const currentTime = Math.floor(+new Date() / 1000);
      this.API.getAutos(autoPage)
        .then((stats) => {
          const responseData = stats.items;

          if (responseData.length === 0) {
            this.setState({ noMoreAutoPages: !noMoreAutoPages });
            resolve();
            return;
          }

          const keys = Object.keys(responseData);
          const autos = autoList;
          keys.forEach((objectKey) => {
            responseData[objectKey].map((item) => autos.push(item));
          });
          this.setState({
            autoPage: autoPage + 1,
            autoList: autos,
          });
          resolve();
        })
        .catch(() => reject());
    });
  }

  getAutoStats() {
    message.loading('Обновляем информацию');
    this.API.getAutoStats()
      .then((stats) => {
        const responseData = stats.data;
        const keys = Object.keys(responseData);

        if (keys.length < 3) {
          this.setState({ needMoreItems: true });
        } else {
          this.setState({ needMoreItems: false });
        }

        const realizedAutosItems = this.getFilteredData('<', responseData, keys);

        const unRealizedAutosItems = this.getFilteredData('>', responseData, keys);

        const realizedAutos = realizedAutosItems.map((items) => items.length);
        const unRealizedAutos = unRealizedAutosItems.map((items) => items.length);

        const s = new Chart(document.getElementById('myChart'), {
          type: 'line',
          data: {
            labels: keys,
            datasets: [{
              label: 'Произведено автомобилей',
              data: realizedAutos,
              borderColor: [
                'rgba(54, 162, 235, 1)',
              ],
              backgroundColor: [
                'rgba(54,162,235,0.5)',
              ],
            }, {
              label: 'На очереди в производство',
              data: unRealizedAutos,
              borderColor: [
                'rgba(255, 99, 132, 1)',
              ],
              backgroundColor: [
                'rgba(255,99,132,0.5)',
              ],
            }],
          },
          options: {
            responsive: true,
          },
        });
        s.update();
        message.success('Информация обновлена');
      })
      .catch(() => {
        message.error('Не удалось обновить информацию');
      });
  }

  getFilteredData(type, responseData, keys) {
    const currentTime = Math.floor(+new Date() / 1000);
    if (type === '<') {
      return keys.map((date) => responseData[date].filter((item) => item.createdAt < currentTime));
    }
    return keys.map((date) => responseData[date].filter((item) => item.createdAt > currentTime));
  }

  removeAuto(autoID, page) {
    const { autoList } = this.state;
    this.API.removeAuto(autoID, page)
      .then((res) => {
        this.setState({
          autoList: autoList.filter((item) => parseInt(item.id, 10) !== parseInt(autoID, 10)),
        });
        console.log(res);
      })
      .catch((why) => {
        console.log(why);
      });
  }

  updateTime() {
    this.setState({ currentTime: Math.floor(+new Date() / 1000) });
  }

  render() {
    const {
      autoList, currentTime, needMoreItems, noMoreAutoPages,
      drawerOpen, models, workshops, drawerWorkshopsOpen,
    } = this.state;

    const listConfig = {
      dataSource: autoList,
      header: <PageHeader
        title="Автомобили"
        extra={<Button onClick={() => this.setState({ drawerOpen: true })}>Добавить</Button>}
      />,
      itemLayout: 'vertical',
      renderItem: (item) => (
        <RcQueueAnim>
          <List.Item
            key={item.id}
            actions={[
              <Button
                onClick={() => {
                  this.removeAuto(item.id, item.page);
                }}
              >
                Удалить
              </Button>]}
          >
            <Descriptions bordered style={{ width: '100%' }}>
              <Descriptions.Item label="Название авто">
                {item.name}
              </Descriptions.Item>
              <Descriptions.Item label="Мощность, л.с.">
                {item.power}
              </Descriptions.Item>
              <Descriptions.Item label="Цех производства">
                {item.workshopName}
              </Descriptions.Item>
              <Descriptions.Item label="Модель">
                {item.modelName}
              </Descriptions.Item>
              <Descriptions.Item label="Дата производства">
                <Tooltip title={moment.unix(item.createdAt)
                  .format('MMMM Do YYYY, HH:mm')}
                >
                  {moment.unix(item.createdAt)
                    .calendar()}
                </Tooltip>
              </Descriptions.Item>
              <Descriptions.Item label="Статус">
                {currentTime <= item.createdAt && (
                  <>
                    <Space>
                      <Badge dot status="processing"/>
                      В очереди на производство
                    </Space>
                  </>
                )}
                {currentTime >= item.createdAt && (
                  <>
                    <Space>
                      <Badge dot status="success"/>
                      Произведено
                    </Space>
                  </>
                )}
              </Descriptions.Item>
            </Descriptions>
          </List.Item>
        </RcQueueAnim>
      ),
      loadMore: (
        <Divider>
          {!noMoreAutoPages ? (
            <Button onClick={this.getAutos}>
              Загрузить еще
            </Button>
          ) : 'Больше нечего загружать'}
        </Divider>),
    };
    return (
      <Layout>
        <Drawer
          width={500}
          closable
          visible={drawerOpen}
          onClose={() => {
            this.setState({ drawerOpen: !drawerOpen });
          }}
          forceRender
          title="Создание нового авто"
        >
          <Drawer
            title="Test"
            visible={drawerWorkshopsOpen}
            onClose={() => {
              this.setState({ drawerWorkshopsOpen: !drawerWorkshopsOpen });
            }}
          >
            test
          </Drawer>
          <Form layout="vertical">
            <Form.Item label="Модель авто">
              <Select dropdownRender={(menu) => (
                <>
                  {menu}
                  <Divider/>
                  <div style={{ padding: '0 8px' }}>
                    <Button>Добавить</Button>
                  </div>
                </>
              )}
              >
                {models.map((model) => (
                  <Select.Option value={model.id} key={model.id}>{model.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Цех">
              <Select dropdownRender={(menu) => (
                <>
                  {menu}
                  <Divider/>
                  <div style={{ padding: '0 8px' }}>
                    <Space>
                      <Button>Добавить</Button>
                      <Button
                        onClick={() => {
                          this.setState({ drawerWorkshopsOpen: !drawerWorkshopsOpen });
                        }}
                      >
                        Редактирование
                      </Button>
                    </Space>
                  </div>
                </>
              )}
              >
                {workshops.map((workshop) => (
                  <Select.Option
                    value={workshop.id}
                    key={workshop.id}
                  >
                    <Space>
                      {!workshop.director && (
                        <Tooltip title="Для данного цеха не назначен руководитель">
                          <Badge dot status="error"/>
                        </Tooltip>
                      )}
                      {workshop.name}
                    </Space>
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Мощность (л.с.)">
              <Input min={64} defaultValue={64} type="number"/>
            </Form.Item>
            <Form.Item label="Дата производства">
              <DatePicker
                showTime
                format="MMMM Do YYYY, HH:mm"
                onChange={(mom) => {
                  if (mom) {
                    console.log(mom.unix());
                  }
                }}
              />
            </Form.Item>
            <Form.Item>
              <Button>Сохранить</Button>
            </Form.Item>
          </Form>
        </Drawer>
        <Content className="app-content">
          <Card title="Статистика" style={{ marginBottom: 20 }}>
            <canvas id="myChart" style={{ display: needMoreItems ? 'none' : 'block' }}/>
            {needMoreItems && <Divider>Для отображения графика, необходимо больше данных</Divider>}
          </Card>
          <Card>
            <RcQueueAnim>
              <List {...listConfig}/>
            </RcQueueAnim>
          </Card>
        </Content>
      </Layout>
    );
  }
}

function mapStateToProps(state) {
  return state;
}

export default connect(
  mapStateToProps,
)(ControlPanel);
