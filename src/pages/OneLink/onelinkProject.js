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
  Select
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
}))
@Form.create()
class OnelinkProList extends PureComponent {

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'onelinkpro/getProlist',
      payload: {
      },
    });
  };


  handleOpen = item => {
    

  }

  handleDelete = item => {
    const { dispatch } = this.props;
    console.log(item);
    dispatch({
      type: 'onelinkpro/delete',
      payload: item,
    });

  }


  render() {
    const {
      projectlist,
      loading,
    } = this.props;
    console.log(projectlist);
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
                  <Card hoverable className={styles.card} actions={[
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
      </PageHeaderWrapper>
    );
  }
}

export default OnelinkProList;
