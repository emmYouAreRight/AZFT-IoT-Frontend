import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { findDOMNode } from 'react-dom';
import { Card, Button, Icon, List, Input, Modal, Form } from 'antd';

import Ellipsis from '@/components/Ellipsis';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Result from '@/components/Result';
import styles from './CardList.less';

const FormItem = Form.Item;
const { TextArea } = Input;

@connect(({ list, loading }) => ({
  list,
  loading: loading.models.list,
}))
@Form.create()
class CardList extends PureComponent {
  state = { visible: false, done: false };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'list/fetch',
      payload: {},
    });
  }

  showModal = () => {
    this.setState({
      visible: true,
      current: undefined,
    });
  };

  handleDone = () => {
    setTimeout(() => this.addBtn.blur(), 0);
    this.setState({
      done: false,
      visible: false,
    });
  };

  handleCancel = () => {
    setTimeout(() => this.addBtn.blur(), 0);
    this.setState({
      visible: false,
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { current } = this.state;
    const id = current ? current.id : '';

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState({
        done: true,
      });
      dispatch({
        type: 'list/submit',
        payload: { id, ...fieldsValue },
      });
    });
  };

  handleOpen = item => {
    const { dispatch } = this.props;
    dispatch({
      type: 'list/openProject',
      payload: item,
    });
  };

  handleDelete = item => {
    const { dispatch } = this.props;
    dispatch({
      type: 'list/delete',
      payload: item,
    });
  };

  deleteItem = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'list/submit',
      payload: { id },
    });
  };

  render() {
    const {
      list: { list },
      loading,
    } = this.props;

    const {
      form: { getFieldDecorator },
    } = this.props;

    const { visible, done = {} } = this.state;

    const content = (
      <div className={styles.pageHeaderContent}>
        <p>Web IDE工作空间，使用Theia进行物联网应用开发，可以连接TinyLink，TinySim，OneLink，UDC</p>
        <div className={styles.contentLink}>
          <a href="http://api.daixinye.com/onelink/download/webide_burn">下载一键烧写驱动</a>
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

    const modalFooter = done
      ? { footer: null, onCancel: this.handleDone }
      : { okText: '保存', onOk: this.handleSubmit, onCancel: this.handleCancel };

    const getModalContent = () => {
      if (done) {
        return (
          <Result
            type="success"
            title="操作成功"
            description="项目创建成功"
            actions={
              <Button type="primary" onClick={this.handleDone}>
                知道了
              </Button>
            }
            className={styles.formResult}
          />
        );
      }
      return (
        <Form onSubmit={this.handleSubmit}>
          <FormItem label="项目名称" {...this.formLayout}>
            {getFieldDecorator('Pname', {
              rules: [{ required: true, message: '请输入项目名称' }],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem label="应用名称" {...this.formLayout}>
            {getFieldDecorator('appName', {
              rules: [{ required: true, message: '请输入应用名称' }],
            })(<Input placeholder="请输入应用名称" />)}
          </FormItem>
          <FormItem {...this.formLayout} label="项目描述">
            {getFieldDecorator('description')(<TextArea rows={4} placeholder="请输入项目描述" />)}
          </FormItem>
        </Form>
      );
    };

    return (
      <PageHeaderWrapper title="工作空间管理" content={content} extraContent={extraContent}>
        <div className={styles.cardList}>
          <List
            rowKey="id"
            loading={loading}
            grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
            dataSource={['', ...list]}
            renderItem={item =>
              item ? (
                <List.Item key={item.id}>
                  <Card
                    className={styles.card}
                    actions={[
                      <a onClick={this.handleOpen.bind(this, item)}>开启</a>,
                      <a onClick={this.handleDelete.bind(this, item)}>删除</a>,
                    ]}
                  >
                    <Card.Meta
                      title={<a>{item.pname}</a>}
                      description={
                        <Ellipsis className={styles.item} lines={3}>
                          {item.appName}
                          <br />
                          {item.description || '暂无描述'}
                        </Ellipsis>
                      }
                    />
                  </Card>
                </List.Item>
              ) : (
                <List.Item>
                  <Button
                    type="dashed"
                    className={styles.newButton}
                    onClick={this.showModal}
                    ref={component => {
                      /* eslint-disable */
                      this.addBtn = findDOMNode(component);
                      /* eslint-enable */
                    }}
                  >
                    <Icon type="plus" /> 新增工作空间
                  </Button>
                </List.Item>
              )
            }
          />
        </div>
        <Modal
          title={done ? null : `添加工作空间`}
          className={styles.standardListForm}
          width={640}
          bodyStyle={done ? { padding: '72px 0' } : { padding: '28px 0 0' }}
          destroyOnClose
          visible={visible}
          {...modalFooter}
        >
          {getModalContent()}
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default CardList;
