import React, { Component, Fragment } from 'react';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import Result from '@/components/Result';
import { connect } from 'dva';
import { Spin, Button, Steps, Card, List, Collapse } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './onelink.less';

const { Step } = Steps;
const Panel = Collapse.Panel;

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
  device: onelink.device,
  loading: loading.models.result,

}))
class onelinkPage extends Component {
  state = {
    stepDirection: 'horizontal',
    current: 0,
    filepath: '/home/project/Case3.cpp',
    proname: 'mytest',
  };

  componentDidMount() {
    this.setStepDirection();
    window.addEventListener('resize', this.setStepDirection, { passive: true });
    // 获取参数
    // window.addEventListener('message', e => {
    //   const { path } = e.data.data;
    //   this.setState({
    //     filepath: path,
    //   });
    // });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setStepDirection);
    this.setStepDirection.cancel();
  }

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
        console.log('======dispatch======');
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
    const { stepDirection, current, filepath } = this.state;
    const {
      result,
      device,
      loading,
    } = this.props;

    // const rurl = `${result.hardwareConnectionImg}`;
    // const imgurl = `http://47.97.217.32/tinylink/${rurl.substring(3)}`;
    // const getfunctionList = () => {
    //   let strs = [];
    //   strs = String(result.functionList).split('\r\n');
    //   const funcstr = strs.map(item => <li>{item}</li>);
    //   return <ol>{funcstr}</ol>;
    // };
    const devInfo = () => {
      
      const devicelist = Object.keys(device).map(item => {
        const devitem = device[item].map(value => (
          <div>
            <span>{value}</span>
            <Button>Info</Button>
            <Button>Burn</Button>
          </div>
        ))
        return (<List.Item>
          <List.Item.Meta
            title = {
            <div>
              <span>{item}</span>
              <Button>Info</Button>
            </div>}
            description = {devitem}
          >
          </List.Item.Meta>
        </List.Item>)
      });

      return (<List>{devicelist}</List>)

    };
    const getcompileDebug = () => {
      let strs = [];
      strs = String(result.verbose).split('<br>');
      const compstr = strs.map(item => <li>{item}</li>);
      return result.verbose? (<ol>{compstr}</ol>) : (<div><Spin /></div>);
    };
    const getResult = () => {
      let res = '';
      let title;
      let info;
      let resextra;
      let actions;

      if (result.systemState == '1') {
        res = 'success';
        title = '编译成功';
        info = '请按照硬件连接图进行组装硬件，确认连接正确后一键烧写';
      } 
      else if(result.systemState == '0') {
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
            <Button onClick={onSelectFile}>选择文件</Button>
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
        content: (
          <div>
            {devInfo()}
          </div>
        ),
      },
    ];

    return (
      <PageHeaderWrapper>
        <Card title="流程" style={{ marginBottom: 24 }} bordered={false}>
          <Steps direction={stepDirection} current={current}>
            {onelinkstep.map(item => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>
        </Card>
        <Card loading={loading} title={onelinkstep[current].title} style={{ marginBottom: 24 }} bordered={false}>
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
      </PageHeaderWrapper>
    );
  }
}

export default onelinkPage;
