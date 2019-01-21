import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { onelink, onelinkProInfo, onelinkDevInfo, onelinkProComp, onelinkCppDownload, onelinkProList} from '@/services/webview';
import { ok } from 'assert';


export default {
  namespace: 'onelink',

  state: {
    result: {},
    device: {},
    proCompres: {},
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
    },
    *proInfo({ payload }, { call, put }) {
      console.log('================proInfo======================');
      console.log(payload);
      const response = yield call(onelinkProInfo, payload);
      console.log(response);
      if(response.status == 'ok') {
        const res = JSON.parse(response.data).deviceList;
        console.log(res);
        yield put({
            type: 'saveDevice',
            payload: {
              res,
            },
          });
      }
    },
    *proCompile({ payload }, { call, put }) {
      console.log('================proCompile======================');
      console.log(payload);
      const response = yield call(onelinkProComp, payload);
      console.log(response);
      if(response.status == 'ok') {
        const res = JSON.parse(response.data);
        console.log(res);
        yield put({
            type: 'svaeProComp',
            payload: {
              ...res,
            },
          });
      }
    }

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
    saveDevice(state, action) {
      console.log('============saveDevice==============');
      console.log(action.payload);
      return {
        ...state,
        device: action.payload.res,
      };
    },
    svaeProComp(state, action) {
      console.log('============svaeProComp==============');
      console.log(action.payload);
      return {
        ...state,
        proCompres: action.payload,
      };
    },
  },
};
