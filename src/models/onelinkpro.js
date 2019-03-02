import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { onelinkDelPro, onelinkProInfo, onelinkHtml, onelinkProList} from '@/services/webview';
import { ok } from 'assert';


export default {
  namespace: 'onelinkpro',

  state: {
    prolist: [],
    mobileInfo: [],
    policyInfo: [],
    htmlContent: '',
  },

  effects: {
    *getProlist(_, { call, put }) {
      
      const response = yield call(onelinkProList);
      const res = JSON.parse(response.data);
      console.log(res);
      const prolist = new Array(...res.appList);
      console.log('=============prolist:');
      console.log(prolist);
      yield put({
        type: 'saveproList',
        payload: Array.isArray(prolist) ? prolist : [],
      });
      
    },
    *getMobileInfo({ payload }, { call, put }) {
      console.log(payload);
      const response = yield call(onelinkProInfo, payload);
      console.log(response);
      if(response.status == 'ok') {
        const res = JSON.parse(response.data).mobileList;
        console.log("==========mobileList=============");
        console.log(res);
        yield put({
            type: 'saveMobile',
            payload: Array.isArray(res) ? res : [],
          });
      }
    },
    *getPolicyInfo({ payload }, { call, put }) {
      console.log(payload);
      const response = yield call(onelinkProInfo, payload);
      console.log(response);
      if(response.status == 'ok') {
        const res = JSON.parse(response.data).policyList;
        console.log("==========policyList=============");
        console.log(res);
        yield put({
            type: 'savePolicy',
            payload: Array.isArray(res) ? res : [],
          });
      }
    },
    *getHtml({ payload }, { call, put }) {
      console.log(payload);
      const response = yield call(onelinkHtml, payload);
      console.log(response);
      if(response.status == 'ok') {
        const res = response.data;
        console.log("==========getHtml=============");
        console.log(res);
        yield put({
            type: 'saveHtml',
            payload: res,
          });
      }
    },
    *delete({ payload }, { call, put }) {
      
      const response = yield call(onelinkDelPro, payload); 
      console.log('delete函数的response');
      console.log(response);
      if(response.status == 'ok') {
        const ret = yield call(onelinkProList);
        const res = JSON.parse(ret.data);
      console.log(res);
      const prolist = new Array(...res.appList);
        yield put({
          type: 'saveproList',
          payload: Array.isArray(prolist) ? prolist : [],
        });
      }
    },


  },

  reducers: {
    saveproList(state, action) {
      return {
        ...state,
        prolist: action.payload,
      };   
    },
    saveMobile(state, action) {
      return {
        ...state,
        mobileInfo: action.payload,
      };   
    },
    savePolicy(state, action) {
      return {
        ...state,
        policyInfo: action.payload,
      };   
    },
    saveHtml(state, action) {
      return {
        ...state,
        htmlContent: action.payload,
      };   
    },
  },
}
