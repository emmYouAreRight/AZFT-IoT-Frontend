import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { findDOMNode } from 'react-dom';
import { Card, Button, Icon, List,
  Row,
  Col,
  Radio,
  Input,
  Progress,
  Dropdown,
  Menu,
  Avatar,
  Modal,
  Form,
  DatePicker,
  Select,
  Divider,
  Switch
} from 'antd';

import Ellipsis from '@/components/Ellipsis';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Result from '@/components/Result';
import styles from './onelinkProject.less';

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const SelectOption = Select.Option;
const { Search, TextArea } = Input;

@connect(({ onelinkpro, loading }) => ({
  projectlist: onelinkpro.prolist,
  loading: loading.models.onelinkpro,
  mobileInfo: onelinkpro.mobileInfo,
  policyInfo: onelinkpro.policyInfo,
  htmlContent: onelinkpro.htmlContent,
}))
@Form.create()
class OnelinkProList extends PureComponent {
  state = {
    visible: false,
    proName: '',
    mobileVisible: false,
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'onelinkpro/getProlist',
      payload: {
      },
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  mobileModalClose = () => {
    this.setState({
      mobileVisible: false,
    });
  };

  handleOpen = item => {
    const { dispatch } = this.props;
    console.log(item);
    dispatch({
      type: 'onelinkpro/getMobileInfo',
      payload: {
        ftype: 'fetchMobileInProject',
        proname: item.appName,
      },
    });
    dispatch({
      type: 'onelinkpro/getPolicyInfo',
      payload: {
        ftype: 'fetchPolicyInProject',
        proname: item.appName,
      },
    });
    this.setState({
      proName: item.appName,
      visible: true,  
    });
  }

  handleDelete = item => {
    const { dispatch } = this.props;
    console.log(item);
    dispatch({
      type: 'onelinkpro/delete',
      payload: item,
    });

  }

  handleClick = item => {

    const { dispatch } = this.props;
    const { proName } = this.state;
    console.log('=============handleClick================');
    console.log(item);
    dispatch({
      type: 'onelinkpro/getHtml',
      payload: {
        mobilename: item.mobileName,
        proname: proName,
      },
    });

    this.setState({
      mobileVisible: true,  
    });
  };

  render() {
    const {
      projectlist,
      loading,
      mobileInfo,
      policyInfo,
      htmlContent
    } = this.props;
    const { visible, proName } = this.state;
    console.log("============htmlContent==================");
    console.log(htmlContent);
    const content = (
      <div className={styles.pageHeaderContent}>
        <p>
          OneLink项目列表，开启项目可以进行查看手机端界面和云端策略
        </p>
        <div className={styles.contentLink}>
          
        </div>
      </div>
    );

    const extraContent = (
      <div className={styles.extraImg}>
        <img
          alt="这是一个标题"
          src="https://gw.alipayobjects.com/zos/rmsportal/RzwpdLnhmvDJToTdfDPe.png"
        />
      </div>
    );

    const Info = ({ title, value, bordered }) => (
      <div className={styles.headerInfo}>
        <span>{title}</span>
        <p>{value}</p>
        {bordered && <em />}
      </div>
    );
    
    const getModalContent = (
      <div>
        <div>
          <h2>Mobile</h2>
          <List
            dataSource={mobileInfo}
            renderItem={item => (
              <List.Item key={item.mobileName}>
                <a target="controlPanel" onClick={this.handleClick.bind(this, item)}>{item.mobileName}</a>
              </List.Item>
            )}
          />
        </div>
        <Divider />
        <div>
          <h2>Policy</h2>
          <List
            dataSource={policyInfo}
            renderItem={item => (
              <List.Item key={item.name}>
                <List.Item.Meta
                title={item.name}
                description={<Switch checkedChildren="Start" unCheckedChildren="Stop" defaultChecked />}
                />
              </List.Item>
            )}
          />
        </div>
      </div>
    );
    return (
      <PageHeaderWrapper title="OneLink项目管理" content={content} extraContent={extraContent}>
        <div className={styles.cardList}>
          <List
            rowKey="id"
            loading={loading}
            grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
            dataSource={[...projectlist]}
            renderItem={item =>
                (
                <List.Item key={item.appID}>
                  <Card className={styles.card} actions={[
                  <a onClick={this.handleOpen.bind(this, item)}>开启</a>, 
                  <a onClick={this.handleDelete.bind(this, item)}>删除</a>]
                  }>
                    <Card.Meta
                      avatar={<img alt="" className={styles.cardAvatar} src= {require('@/assets/iconppp.jpg')} />}
                      title={<a>{item.appName}</a>}
                      description={
                        <Ellipsis className={styles.item} lines={3}>
                          {item.descript}
                        </Ellipsis>
                      }
                    />
                  </Card>
                </List.Item>
              ) }
          />
        </div>
        <Modal
          title={this.state.proName}
          visible={this.state.visible}
          onCancel={this.handleCancel}
        >
          {getModalContent}
        </Modal>
        <Modal
          visible={this.state.mobileVisible}
          onCancel={this.mobileModalClose}
          footer={[
            <Button key="back" onClick={this.mobileModalClose}>
              知道了
            </Button>,
          ]}
        >
          <iframe name="controlPanel" srcdoc={`${htmlContent}`}></iframe>
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default OnelinkProList;
