import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { tinylink } from '@/services/webview';


export default {
  namespace: 'result',

  state: {
    result: [],
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
              ret,
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
        result: action.payload.ret,
      };
    },
  },
};
