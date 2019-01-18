import React, { Suspense } from 'react';
import { Layout } from 'antd';
import DocumentTitle from 'react-document-title';
import isEqual from 'lodash/isEqual';
import memoizeOne from 'memoize-one';
import { connect } from 'dva';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import pathToRegexp from 'path-to-regexp';
import Media from 'react-media';
import { formatMessage } from 'umi/locale';
import Authorized from '@/utils/Authorized';
import logo from '../assets/logo.svg';
import Footer from './Footer';
import Header from './Header';
import Context from './MenuContext';
import Exception403 from '../pages/Exception/403';
import PageLoading from '@/components/PageLoading';
import SiderMenu from '@/components/SiderMenu';

import styles from './BasicLayout.less';


const { Content } = Layout;

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
    maxWidth: 1599,
  },
  'screen-xxl': {
    minWidth: 1600,
  },
};

class WebviewLayout extends React.PureComponent {
  constructor(props) {
    super(props);
    this.getPageTitle = memoizeOne(this.getPageTitle);
    this.matchParamsPath = memoizeOne(this.matchParamsPath, isEqual);
  }

  componentDidMount() {
    const {
      dispatch,
      route: { routes },
    } = this.props;
    dispatch({
      type: 'setting/getSetting',
    });
    dispatch({
      type: 'webview/getMenuData',
      payload: { routes },
    });
  }

  componentDidUpdate(preProps) {
    // After changing to phone mode,
    // if collapsed is true, you need to click twice to display
    const { collapsed, isMobile } = this.props;
    if (isMobile && !preProps.isMobile && !collapsed) {
      this.handleMenuCollapse(false);
    }
  }

  getContext() {
    const { location, breadcrumbNameMap } = this.props;
    console.log(location);
    console.log(breadcrumbNameMap);
    return {
      location,
      breadcrumbNameMap,
    };
  }

  matchParamsPath = (pathname, breadcrumbNameMap) => {
    const pathKey = Object.keys(breadcrumbNameMap).find(key => pathToRegexp(key).test(pathname));
    return breadcrumbNameMap[pathKey];
  };

  getPageTitle = (pathname, breadcrumbNameMap) => {
    const currRouterData = this.matchParamsPath(pathname, breadcrumbNameMap);

    if (!currRouterData) {
      return 'Web IDE';
    }
    const pageName = formatMessage({
      id: currRouterData.locale || currRouterData.name,
      defaultMessage: currRouterData.name,
    });

    return `${pageName} - Web IDE`;
  };

  getLayoutStyle = () => {
    const { fixSiderbar, isMobile, collapsed, layout } = this.props;
    if (fixSiderbar && layout !== 'topmenu' && !isMobile) {
      return {
        paddingLeft: collapsed ? '80px' : '256px',
      };
    }
    return null;
  };

  handleMenuCollapse = collapsed => {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  };
  render() {
    const {
      navTheme,
      layout: PropsLayout,
      children,
      location: { pathname },
      isMobile,
      menuData,
      breadcrumbNameMap,
      route: { routes },
      fixedHeader,
    } = this.props;

    const isTop = PropsLayout === 'topmenu';
    const contentStyle = !fixedHeader ? { paddingTop: 0 } : {};
    const layout = (
      <Layout>
        <Layout
          style={{
            ...this.getLayoutStyle(),
            minHeight: '100vh',
          }}
        >
          
          <Content className={styles.content} style={contentStyle}>
            {children}
          </Content>
        </Layout>
      </Layout>
    );
    return (
      <React.Fragment>
        <DocumentTitle>
          <ContainerQuery query={query}>
            {params => (
              <Context.Provider value={this.getContext()}>
                <div className={classNames(params)}>{layout}</div>
              </Context.Provider>
            )}
          </ContainerQuery>
        </DocumentTitle>
      </React.Fragment>
    );
  }
}

export default connect(({ setting, webview }) => ({
  layout: setting.layout,
  menuData: webview.menuData,
  breadcrumbNameMap: webview.breadcrumbNameMap,
  ...setting,
}))(props => (
  <Media query="(max-width: 599px)">
    {isMobile => <WebviewLayout {...props} isMobile={isMobile} />}
  </Media>
));
