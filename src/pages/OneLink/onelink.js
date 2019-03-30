import React, { Component } from 'react';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import Result from '@/components/Result';
import { getUserInfo, getOneID } from '@/utils/userInfo';
import { connect } from 'dva';
import { Spin, Button, Steps, Card, Row, Col, List, Collapse, Drawer, Modal } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './onelink.less';

const { Step } = Steps;
const { Panel } = Collapse;
const { Meta } = Card;
const getWindowWidth = () => window.innerWidth || document.documentElement.clientWidth;

function onSelectFile() {
  const messageData = {
    from: 'iframe',
    data: {
      command: 'onmessage',
      data: {
        type: 'command',
        content: 'open_file_picker',
      },
    },
  };
  window.parent.postMessage(messageData, '*');
}

@connect(({ onelink, loading }) => ({
  result: onelink.result,
  proCompres: onelink.proCompres, // 设备端project编译结果
  device: onelink.device,
  devDetailInfo: onelink.devDetailInfo,
  loading: loading.models.result,
}))
class onelinkPage extends Component {
  state = {
    stepDirection: 'horizontal',
    current: 0,
    filepath: '/home/project/Case3.cpp',
    proname: '',
    uid: '',
    Drawervis: false,
    Modalvis: false,
    curappName: '',
    curInstance: '',
  };

  componentDidMount() {
    this.setStepDirection();
    window.addEventListener('resize', this.setStepDirection, { passive: true });

    window.addEventListener('message', e => {
      const { path } = e.data.data;
      this.setState({
        filepath: path,
      });
    });

    const params = {};
    window.location.search
      .slice(1)
      .split('&')
      .forEach(value => {
        const [k, v] = value.split('=');
        params[k] = v;
      });
    const { projectname, username } = params;
    this.setState({
      proname: projectname,
      uid: username,
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setStepDirection);
    this.setStepDirection.cancel();
  }

  onDrawerClose = () => {
    this.setState({
      Drawervis: false,
    });
  };

  onModalClose = () => {
    this.setState({
      Modalvis: false,
    });
  };

  @Bind()
  @Debounce(200)
  setStepDirection() {
    const { stepDirection } = this.state;
    const w = getWindowWidth();
    if (stepDirection !== 'vertical' && w <= 576) {
      this.setState({
        stepDirection: 'vertical',
      });
    } else if (stepDirection !== 'horizontal' && w > 576) {
      this.setState({
        stepDirection: 'horizontal',
      });
    }
  }

  handleProCompile = (e, item) => {
    const { dispatch } = this.props;
    const { proname } = this.state;
    dispatch({
      type: 'onelink/proCompile',
      payload: {
        appName: item,
        proname,
      },
    });
    this.setState({
      Drawervis: true,
      curappName: item,
    });
    e.stopPropagation();
  };

  handleDevInfo = (e, item) => {
    e.preventDefault();
    const { dispatch } = this.props;
    const { proname } = this.state;
    dispatch({
      type: 'onelink/devDetailInfo',
      payload: {
        instance: item,
        proname,
      },
    });
    this.setState({
      Modalvis: true,
    });
    this.setState({
      curInstance: item,
    });
  };

  next() {
    const { dispatch } = this.props;

    const { current, filepath, proname } = this.state;
    const next = current + 1;
    switch (next) {
      // 第二步
      case 1:
        dispatch({
          type: 'onelink/compile',
          payload: {
            filepath,
            proname,
          },
        });
        break;
      case 2:
        dispatch({
          type: 'onelink/proInfo',
          payload: {
            ftype: 'fetchDeviceInProject',
            proname,
          },
        });
        break;
      default:
    }
    this.setState({ current: next });
  }

  prev() {
    const { current } = this.state;
    const prev = current - 1;
    this.setState({ current: prev });
  }

  render() {
    const {
      stepDirection,
      current,
      filepath,
      curappName,
      curInstance,
      proname,
      uid,
      Drawervis,
      Modalvis,
    } = this.state;
    const { result, device, loading, proCompres, devDetailInfo } = this.props;
    const getImg = () => {
      const rurl = `${proCompres.imgpath}`;
      const imgurl = `http://demo.tinylink.cn/onelink/${rurl.substring(3)}`;
      return imgurl;
    };
    // 获取设备端tinylink编译信息
    const getProCompInfo = () => {
      let strs = [];
      strs = String(proCompres.compile).split('\n');
      const procompstr = strs.map((item, index) => <li key={`${item + index}`}>{item}</li>);
      return <ol>{procompstr}</ol>;
    };
    // 获取设备端信息
    const devInfo = () => {
      const devicelist = Object.keys(device).map((item, i) => {
        const headDetail = (
          <Row>
            <Col xl={12} lg={12}>
              {item}
            </Col>
            <Col xl={12} lg={12}>
              <Button type="primary" onClick={e => this.handleProCompile.call(this, e, item)}>
                编译信息
              </Button>
            </Col>
          </Row>
        );
        const devitem = (
          <Panel key={i} header={headDetail}>
            <List
              dataSource={device[item]}
              renderItem={value => (
                <List.Item key={value}
                  actions={[
                    <a onClick={e => this.handleDevInfo(e, value)}>详细信息</a>,
                    <a href={`tinylinkclient://api.daixinye.com/onelink/burn?UID=${uid}&projectName=${proname}&appName=${item}&devName=${value}`}>一键烧写</a>,
                  ]}
                >
                  <div>{value}</div>
                </List.Item>
              )}
            />
          </Panel>
        );
        return devitem;
      });

      return <Collapse defaultActiveKey={['0']}>{devicelist}</Collapse>;
    };
    // 获取onelink编译信息
    const getcompileDebug = () => {
      let strs = [];
      strs = String(result.verbose).split('<br>');
      const compstr = strs.map((item, index) => <li key={`${item + index}`}>{item}</li>);
      return result.verbose ? (
        <ol>{compstr}</ol>
      ) : (
        <div className={styles.compResult}>
          <Spin tip="Loading..."/>
        </div>
      );
    };
    const getResult = () => {
      let res = '';
      let title;
      let info;
      let actions;

      if (result.systemState === 1) {
        res = 'success';
        title = '编译成功';
        info = '请按照硬件连接图进行组装硬件，确认连接正确后一键烧写';
      } else if (result.systemState === 0) {
        res = 'error';
        title = '编译失败';
        info = '请修改代码后重新编译';
      }

      return (
        <Result
          type={res}
          title={title}
          description={info}
          extra={getcompileDebug()}
          actions={actions}
          style={{ marginTop: 48, marginBottom: 16 }}
        />
      );
    };

    const onelinkstep = [
      {
        title: '选择文件',
        content: (
          <div>
            <Button onClick={onSelectFile} style={{marginTop: 80}}>选择文件</Button>
            <p>{filepath}</p>
          </div>
        ),
      },
      {
        title: '编译',
        content: (
          <div>
            <Card bordered={false} loading={loading}>
              {getResult()}
            </Card>
          </div>
        ),
      },
      {
        title: '设备端信息',
        content: <div>{devInfo()}</div>,
      },
    ];

    return (
      <PageHeaderWrapper>
        <Card title={`项目名称：${proname}`} style={{ marginBottom: 24 }} bordered={false}>
          <Steps direction={stepDirection} current={current}>
            {onelinkstep.map(item => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>
        </Card>
        <Card
          loading={loading}
          title={onelinkstep[current].title}
          style={{ marginBottom: 24 }}
          bordered={false}
        >
          <div>
            <div className={styles.stepsContent}>{onelinkstep[current].content}</div>
            <div className={styles.stepsAction}>
              {current < onelinkstep.length - 1 && (
                <Button type="primary" onClick={() => this.next()}>
                  下一步
                </Button>
              )}
              {current === onelinkstep.length - 1 && <Button type="primary">Done</Button>}
              {current > 0 && (
                <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
                  上一步
                </Button>
              )}
            </div>
          </div>
        </Card>
        <Drawer width={680} placement="right" onClose={this.onDrawerClose} visible={Drawervis}>
          <List>
            <List.Item extra={<img width={600} alt="hardwareimg" src={getImg()} />}>
              <List.Item.Meta title="硬件连接图" />
            </List.Item>
            <List.Item>
              <List.Item.Meta title="编译结果" description={getProCompInfo()} />
            </List.Item>
          </List>
        </Drawer>
        <Modal
          width={700}
          visible={Modalvis}
          title={curInstance}
          onCancel={this.onModalClose}
          footer={[
            <Button key="back" onClick={this.onModalClose}>
              知道了
            </Button>,
          ]}
        >
          <Card>
            <Meta
              title="Mqtt Information"
              description={
                <ol>
                  <li>{`Data Topic:${devDetailInfo.hash_id}/data`}</li>
                  <li>{`Event Topic:${devDetailInfo.hash_id}/data`}</li>
                  <li>{`Service Topic:${devDetailInfo.hash_id}/service`}</li>
                  <li>{`Username:${uid}`}</li>
                  <li>Service Name:tinylink.cn</li>
                  <li>{`Client Name:${devDetailInfo.hash_id}`}</li>
                  <li>Password:user password</li>
                </ol>
              }
            />
            <Meta title="下载tinylink源代码" description={<a href={`http://api.daixinye.com/onelink/project/file/download?projectName=${proname}&appName=${curappName}&instance=${curInstance}`}><Button>下载</Button></a>} />
          </Card>
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default onelinkPage;
