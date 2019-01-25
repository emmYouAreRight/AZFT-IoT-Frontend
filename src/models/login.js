import { routerRedux } from 'dva/router';
import { stringify } from 'qs';

import { userLogin, userLogout } from '@/services/user';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';
import { setUserInfo , setTinyID } from '@/utils/userInfo'

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      console.log(payload);
      const response = yield call(userLogin, payload);
      if (response.status === 'ok') {
        const res = response.data;
        yield put({
          type: 'changeLoginStatus',
          payload: {
            ...res,
            currentAuthority: 'admin'
          },
        });
        // Login successfully
        reloadAuthorized();
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        console.log(params);
        let { redirect } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
              console.log(redirect);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }
        yield put(routerRedux.replace(redirect || '/'));
      }
    },
      
      

    *logout(_, { call, put }) {
      yield call(userLogout);
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          currentAuthority: 'guest',
        },
      });
      reloadAuthorized();
      yield put(
        routerRedux.push({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        })
      );
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setUserInfo(payload.uid);
      setTinyID(payload.tinyID);
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};
