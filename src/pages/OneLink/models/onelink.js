import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { onelink, onelinkProInfo, onelinkDevInfo, onelinkCppDownload, onelinkProList} from '@/services/webview';
import { ok } from 'assert';


export default {
  namespace: 'onelink',

  state: {
    result: {},
  },

  effects: {
    *compile({ payload }, { call, put }) {
      console.log('=================onelinkResult======================');
      console.log(payload);
      let fname = payload.proname;
      const response = yield call(onelinkProList);
      const res = JSON.parse(response.data);
      console.log(res);
      const prolist = new Array(...res.appList);
      console.log('=============prolist:'+ prolist);
      let ftype;
      let flag = prolist.some(function(item) {
        return item.appName == fname;
      })
      console.log(flag);
      if(flag) {
        ftype = 'update';
      }
      else {
        ftype = 'create';
      }
      payload = {
        proname: payload.proname,
        filepath: payload.filepath,
        type: ftype,
      }
      const compileRes= yield call(onelink, payload);
      console.log('=============compileRes:'+ compileRes);
      if(compileRes.status == 'ok') {
        const ret = JSON.parse(compileRes.data);
        yield put({
            type: 'compinfo',
            payload: {
              ...ret,
            },
          });
      }
     // const res = yield call(test);

    //   const res = yield call(onelinkProList);
    //   console.log(res);
    //   const response = yield call(onelink, payload);
    //   if(response.status == 'ok')
    //   {
    //       const ret = JSON.parse(response.data);
    //         console.log(ret);
    //     yield put({
    //         type: 'compinfo',
    //         payload: {
    //           ...ret,
    //         },
    //       });
    //   }
    },

  },

  reducers: {
    compinfo(state, action) {
      console.log('=============compinfo===================');
        console.log(action.payload);
        console.log(state);
      return {
        ...state,
        result: action.payload,
      };
    },
  },
};
