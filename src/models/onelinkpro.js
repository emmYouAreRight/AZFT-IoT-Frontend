import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { onelinkDelPro, onelinkProInfo, onelinkDevInfo, onelinkCppDownload, onelinkProList} from '@/services/webview';
import { ok } from 'assert';


export default {
  namespace: 'onelinkpro',

  state: {
    prolist: [],
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
      console.log('=============compinfo===================');
        console.log(action.payload);
        console.log(state);
      return {
        ...state,
        prolist: action.payload,
      };   
    },
  },
}
