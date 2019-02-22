import React, { Component } from 'react';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import { connect } from 'dva';
import { Button, Steps, Select, Card, Input, Row, Col, Tooltip, Form } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './tinysim.less';

const { Step } = Steps;
const { TextArea } = Input;
const FormItem = Form.Item;
const { Option } = Select;

const getWindowWidth = () => window.innerWidth || document.documentElement.clientWidth;

@connect(({ tinysim }) => ({
  cmdRes: tinysim.cmdResponse,
  logres: tinysim.result,
}))
@Form.create()
class TinySimPage extends Component {
  state = {
    stepDirection: 'horizontal',
    current: 0,
    filepath: '/home/project/LED_Blink.cpp',
    confpath: '/home/project/led.json',
    proname: 'mytest',
    historycmd: '',
    logContent: [], // 应用日志输出信息

    filePickTarget: '', // 用于指定选择文件后赋值的变量名
    curCmd: '', // 输入的命令
  };

  componentDidMount() {
    this.setStepDirection();
    window.addEventListener('resize', this.setStepDirection, { passive: true });

    // 获取参数
    window.addEventListener('message', e => {
      const { path } = e.data.data;
      const { filePickTarget } = this.state;
      const state = {};
      state[filePickTarget] = path;
      this.setState(state);
    });
    // 连接websocket
    const ws = new WebSocket('ws://47.92.240.253:8080');
    ws.onopen = () => {
      const { logContent } = this.state;
      logContent.push('system: 已连接 websocket 服务器');
      this.setState({
        logContent,
      });
      ws.send('Hello Server!'); // 给服务端发送数据
    };
    ws.onmessage = msg => {
      // msg.data 接收服务端传递过来的数据
      const { logContent } = this.state;
      logContent.push(msg.data);
      if (logContent.length > 15) {
        logContent.shift();
      }
      this.setState({ logContent });
    };

    ws.onclose = () => {
      const { logContent } = this.state;
      logContent.push('system: 已关闭与 websocket 服务器的连接');
      this.setState({
        logContent,
      });
    };

    ws.onerror = () => {
      const { logContent } = this.state;
      logContent.push('system: 与 websocket 服务器的连接发生了错误');
      this.setState({
        logContent,
      });
    };

    const params = {};
    window.location.search
      .slice(1)
      .split('&')
      .forEach(value => {
        const [k, v] = value.split('=');
        params[k] = v;
      });
    const { projectname } = params;
    this.setState({
      proname: projectname,
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setStepDirection);
    this.setStepDirection.cancel();
  }

  onSelectFile(filePickTarget) {
    this.setState({
      filePickTarget,
    });
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

  // 处理文件上传
  handleSubmit = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { filepath, proname, confpath } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'tinysim/tinysimUpload',
        payload: {
          ...fieldsValue,
          filepath,
          confpath,
          proname,
        },
      });
    });
  };

  handleCmd = () => {
    const { dispatch } = this.props;
    const { historycmd, curCmd } = this.state;
    let str = curCmd;
    let hcmd = historycmd;
    const myData = new Date();
    str = `${myData.toLocaleString()}   ${str}`;
    hcmd += `${str}\n`;
    this.setState({ historycmd: hcmd }); // 记录历史命令
    // 传入当前调试命令
    dispatch({
      type: 'tinysim/cmd',
      payload: {
        cmd: curCmd,
      },
    });
    this.setState({
      curCmd: '',
    });
  };

  next() {
    const { current } = this.state;
    const next = current + 1;
    this.setState({ current: next });
  }

  prev() {
    const { current } = this.state;
    const prev = current - 1;
    this.setState({ current: prev });
  }

  handleCmdInputChange(value) {
    this.setState({
      curCmd: value,
    });
  }

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    const {
      stepDirection,
      current,
      filepath,
      confpath,
      logContent,
      historycmd,
      proname,
      curCmd,
    } = this.state;
    const { form, cmdRes } = this.props;
    const { getFieldDecorator } = form;
    const titleCont = (
      <Row gutter={48}>
        <Col span={12}>
          <span>应用日志</span>
        </Col>
        <Col span={12}>
          <a href="http://api.daixinye.com/tinysim/download_log">
            <Button type="primary">下载日志</Button>
          </a>
        </Col>
      </Row>
    );

    const localcompstep = [
      {
        title: '选择文件',
        content: (
          <div>
            <Button style={{marginTop: 36}} onClick={() => this.onSelectFile('filepath')}>选择代码文件</Button>
            <p>{filepath}</p>
            <Button onClick={() => this.onSelectFile('confpath')}>选择配置文件</Button>
            <p>{confpath}</p>
            <Form onSubmit={this.handleSubmit}>
              <FormItem label="执行模式" {...formItemLayout}>
                {getFieldDecorator('execute_mode', {
                  initialValue: 'VIRTUAL',
                })(
                  <Select>
                    <Option value="VIRTUAL">VIRTUAL</Option>
                    <Option value="REAL">REAL</Option>
                  </Select>
                )}
              </FormItem>
              <FormItem label="执行时间" {...formItemLayout}>
                {getFieldDecorator('executing_time', {
                  initialValue: '1000',
                })(<Input />)}
              </FormItem>
              <FormItem>
                <Button type="primary" htmlType="submit">
                  提交文件
                </Button>
              </FormItem>
            </Form>
            <Card style={{ marginBottom: 24 }} bordered={false} title={titleCont}>
              <TextArea rows={8} value={logContent.join('\n')} readOnly />
            </Card>
          </div>
        ),
      },
      {
        title: '模拟调试',
        content: (
          <div className={styles.tinysim}>
            <Row gutter={24} type="flex" align="top">
              <Col xl={16} lg={16} md={16} sm={24} xs={24}>
                <Card style={{ marginBottom: 24 }} bordered={false} title="调试">
                  <Input
                    onPressEnter={() => this.handleCmd()}
                    onChange={event => this.handleCmdInputChange(event.target.value)}
                    size="large"
                    value={curCmd}
                    placeholder="请输入调试命令"
                  />
                  <TextArea value={cmdRes} rows={19} readOnly />
                </Card>
              </Col>
              <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                <Card style={{ marginBottom: 24 }} bordered={false} title="调试命令">
                  <Tooltip title="state">
                    <p>state</p>
                  </Tooltip>
                  <Tooltip title="delay">
                    <p>delay</p>
                  </Tooltip>
                  <Tooltip title="power">
                    <p>power</p>
                  </Tooltip>
                  <Tooltip title="quit">
                    <p>quit</p>
                  </Tooltip>
                  <Tooltip title="clear">
                    <p>clear</p>
                  </Tooltip>
                </Card>
                <Card title="历史命令" style={{ marginBottom: 24 }} bordered={false}>
                  <TextArea readOnly rows={6} value={historycmd} />
                </Card>
              </Col>
            </Row>
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
                <Button type="primary" onClick={() => this.next()}>
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

export default TinySimPage;
