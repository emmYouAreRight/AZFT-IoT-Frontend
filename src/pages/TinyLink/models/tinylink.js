import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { tinylink } from '@/services/webview';



export default {
  namespace: 'tinylink',

  state: {
    result: [],
    btnstate: true,
  },

  effects: {
    *tinylinkResult({ payload }, { call, put }) {
      console.log('=================tinylinkResult======================');
      console.log(payload);
      const response = yield call(tinylink, payload);
      if(response.status == 'ok')
      {
          const ret = JSON.parse(response.data);
            console.log(ret);
        yield put({
            type: 'tinylinkresult',
            payload: {
              ...ret,
              status: 'ok',
            },
          });
      }
    

    }
  },

  reducers: {
    tinylinkresult(state, action) {
      console.log('=============tinylinkresult===================');
        console.log(action.payload);
        console.log(state);
      return {
        ...state,
        result: action.payload,
        btnstate: false,
      };
    },
  },
};

