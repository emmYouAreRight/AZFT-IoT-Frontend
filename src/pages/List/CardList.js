import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button, Icon, List } from 'antd';

import Ellipsis from '@/components/Ellipsis';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './CardList.less';

@connect(({ list, loading }) => ({
  list,
  loading: loading.models.list,
}))
class CardList extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'list/fetch',
      payload: {
      },
    });
  }

  render() {
    const {
      list: { list },
      loading,
    } = this.props;

    const content = (
      <div className={styles.pageHeaderContent}>
        <p>
          Web IDE工作空间，使用Theia进行物联网应用开发，可以连接TinyLink，TinySim，OneLink，UDC
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
                  <Card hoverable className={styles.card} actions={[<a>开启</a>, <a>删除</a>]}>
                    <Card.Meta
                      title={<a>{item.appName}</a>}
                      description={
                        <Ellipsis className={styles.item} lines={3}>
                          {item.pname}<br />
                          {item.pid}
                          {item.description}
                        </Ellipsis>
                      }
                    />
                  </Card>
                </List.Item>
              ) : (
                <List.Item>
                  <Button type="dashed" className={styles.newButton}>
                    <Icon type="plus" /> 新增工作空间
                  </Button>
                </List.Item>
              )
            }
          />
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default CardList;
