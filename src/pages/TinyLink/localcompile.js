import React, { Component, Fragment } from 'react';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import Result from '@/components/Result';
import { connect } from 'dva';
import { Button, Steps, Card, List, Spin } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './localcompile.less';
import { getTinyID, getUserInfo } from '@/utils/userInfo';

const { Step } = Steps;

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

@connect(({ tinylink }) => ({
  result: tinylink.result,
  btnstate: tinylink.btnstate,
}))
class Localcomp extends Component {
  state = {
    stepDirection: 'horizontal',
    current: 0,
    filepath: '/home/project/test.cpp',
    proname: 'example',
    uid: '',
  };

  componentDidMount() {
    this.setStepDirection();
    window.addEventListener('resize', this.setStepDirection, { passive: true });
    // 获取参数
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
        this.setState({ btnstate: true });
        dispatch({
          type: 'tinylink/tinylinkResult',
          payload: {
            filepath,
            proname,
          },
        });
        break;
      default:
    }
    this.setState({ 
      current: next,
    });
  }

  prev() {
    const { current } = this.state;
    const prev = current - 1;
    this.setState({ current: prev });
  }

  render() {
    const { stepDirection, current, filepath, proname, uid } = this.state;
    const {
      result,
      btnstate,
    } = this.props;

    const rurl = `${result.hardwareConnectionImg}`;
    const imgurl = `http://tinylink.cn:12352/tinylink/${rurl.substring(3)}`;
    const getfunctionList = () => {
      let strs = [];
      strs = String(result.functionList).split('\r\n');
      const funcstr = strs.map((item,i) => <li key={i}>{item}</li>);
      return <ol>{funcstr}</ol>;
    };

    const getcompileDebug = () => {
      let strs = [];
      strs = String(result.compileDebug).split('\n');
      const compstr = strs.map((item, index) => <li key={index}>{item}</li>);
      return  (<ol>{compstr}</ol>);

    };
    const getResult = () => {
      let res = '';
      let title;
      let info;
      let resextra;
      let actions;

      if (result.systemState === '1') {
        res = 'success';
        title = '编译成功';
        info = '请按照硬件连接图进行组装硬件，确认连接正确后一键烧写';
        resextra = (
          <Fragment>
            <List>
              <List.Item>
                <List.Item.Meta title="功能列表" description={getfunctionList()} />
              </List.Item>
              <List.Item extra={<img width={870} alt="hardwareimg" src={imgurl} />}>
                <List.Item.Meta title="硬件连接图" />
              </List.Item>
              <List.Item>
                <List.Item.Meta title="编译结果" description={getcompileDebug()} />
              </List.Item>
            </List>
          </Fragment>
        );
      } 
      else if(result.systemState === '0'){
        res = 'error';
        title = '编译失败';
        info = '请修改代码后重新编译';
        resextra = (
          <Fragment>
            <List>
              <List.Item>
                <List.Item.Meta title="详细信息" description={result.verbose} />
              </List.Item>
            </List>
          </Fragment>
        );
      }
      return result.systemState? (
        <Result
          type={res}
          title={title}
          description={info}
          extra={resextra}
          actions={actions}
          style={{ marginTop: 48, marginBottom: 16 }}
        />
      ) : (
        <div className={styles.compResult}>
          <Spin tip="Loading..."/>
        </div>
      );
    };

    const localcompstep = [
      {
        title: '选择文件',
        content: (
          <div>
            <Button style={{marginTop: 80}} onClick={onSelectFile}>选择文件</Button>
            <p>{filepath}</p>
          </div>
        ),
      },
      {
        title: '编译',
        content: (
          <div>
            <Card bordered={false} style={{minHeight: 200}}>
              {getResult()}
            </Card>
          </div>
        ),
      },
      {
        title: '烧写',
        content: (
          <div>
            <div>
              <a href={`http://api.tinylink.cn/tinylink/downloadHex`}><Button type="primary" style={{marginTop: 45}}>下载代码</Button></a>
            </div>
            <div style={{marginTop: 45}}>
            <a href={`tinylinkclient://api.tinylink.cn/tinylink/burn?&UID=${uid}`}><Button type="primary" >一键烧写</Button></a>
            </div>
          </div>
          
        ),
      },
    ];

    return (
      <PageHeaderWrapper>
        <Card title={`项目名称：${proname}`} style={{ marginBottom: 24 }} bordered={false}>
          <Steps direction={stepDirection} current={current}>
            {localcompstep.map(item => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>
        </Card>
        <Card title={localcompstep[current].title} style={{ marginBottom: 24 }} bordered={false}>
          <div>
            <div className={styles.stepsContent}>{localcompstep[current].content}</div>
            <div className={styles.stepsAction}>
              {current < localcompstep.length - 1 && (
                <Button type="primary" onClick={() => this.next()} disabled={current === 1 ? btnstate : false}>
                  下一步
                </Button>
              )}
              {current === localcompstep.length - 1 && <Button type="primary">Done</Button>}
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

export default Localcomp;
