import React, { Component, Fragment } from 'react';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import { connect } from 'dva';
import {
  Button,
  Menu,
  Dropdown,
  Icon,
  Row,
  Col,
  Steps,
  Card,
  Popover,
  Badge,
  Table,
  Tooltip,
  Divider,
} from 'antd';
import classNames from 'classnames';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './onelink.less';

const { Step } = Steps;
const { Description } = DescriptionList;
const ButtonGroup = Button.Group;

const getWindowWidth = () => window.innerWidth || document.documentElement.clientWidth;
const udccompstep = [
    {
        title: '选择文件',
        content: <div>onelink</div>
    },
    {
        title: '编译结果',
        content: ''
    },
    {
        title: '烧录',
        content: ''
    },
]
class OnelinkPage extends Component {
  state = {
    stepDirection: 'horizontal',
    current: 0,
  };

  componentDidMount() {
    const { dispatch } = this.props;

    this.setStepDirection();
    window.addEventListener('resize', this.setStepDirection, { passive: true });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setStepDirection);
    this.setStepDirection.cancel();
  }

  @Bind()
  @Debounce(200)
  setStepDirection() {
    const { 
        stepDirection,
     } = this.state;
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
    const current = this.state.current + 1;
    this.setState({ current });
  }
  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
  }
  render() {
    const { stepDirection, current } = this.state;
    const { loading } = this.props;
    
    return (
      <PageHeaderWrapper>
        <Card title="流程" style={{ marginBottom: 24 }} bordered={false}>
          <Steps direction={stepDirection}  current={current}>
                {udccompstep.map(item => <Step key={item.title} title={item.title} />)}
          </Steps>
        </Card>
        <Card title={udccompstep[current].title} style={{ marginBottom: 24 }} bordered={false}>
        <div>
          <div className={styles.stepsContent}>
              {udccompstep[current].content}
          </div>
          <div className={styles.stepsAction}>
          {
            this.state.current < udccompstep.length - 1
            &&
            <Button type="primary" onClick={() => this.next()}>Next</Button>
          }
          {
            this.state.current === udccompstep.length - 1
            &&
            <Button type="primary" >Done</Button>
          }
          {
            this.state.current > 0
            &&
            <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
              Previous
            </Button>
          }
        </div>
        </div>
        </Card> 
        </PageHeaderWrapper>
    );
  }
}

export default OnelinkPage;
