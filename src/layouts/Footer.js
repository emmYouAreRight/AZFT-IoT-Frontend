import React, { Fragment } from 'react';
import { Layout, Icon } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';

const { Footer } = Layout;
const FooterView = () => (
  <Footer style={{ padding: 0 }}>
    <GlobalFooter
      links={[
        {
          key: 'TinyLink',
          title: 'TinyLink',
          href: 'http://tinylink.emnets.org',
          blankTarget: true,
        },
        {
          key: 'TinySim',
          title: 'TinySim',
          href: 'http://47.92.240.253/simulator/home/',
          blankTarget: true,
        },
        {
          key: 'OneLink',
          title: 'OneLink',
          href: '',
          blankTarget: true,
        },
      ]}
      copyright={
        <Fragment>
          Web IDE Copyright <Icon type="copyright" /> EmYouAreRight
        </Fragment>
      }
    />
  </Footer>
);
export default FooterView;
