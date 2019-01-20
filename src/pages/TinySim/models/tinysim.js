import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { tinysimCmd, tinysim } from '@/services/webview';
import { ok } from 'assert';

export default {
    namespace: 'tinysim',
  
    state: {
      cmdResponse: "",
      result: "",
    },
  
    effects: {
      //tinysim文件上传
      *tinysimUpload({ payload }, { call, put }) {
        console.log('============tinysimUpload================');
        console.log(payload);
        const response = yield call(tinysim, payload);
        if(response.status == 'ok') {
          console.log('==========tinysim****=================');
          const ret = JSON.parse(response.data);
          console.log(ret);
          yield put({
            type: 'uploadres',
            payload: ret,
          });
        }
      },
      //tinysim命令调试
      *cmd({ payload }, { call, put }) {
        console.log(payload);  
        const response = yield call(tinysimCmd, payload);
        if(response.status == 'ok') {
          const ret = response.data;
          console.log(ret);
          let str = String(ret);
          //处理某些返回字符串末尾没有回车
          if(str.charAt(str.length - 1) != '\n') {
            str += '\n';
          }
          yield put({
            type: 'save',
            payload: str,
          });
        }
        
      }
    },
  
    reducers: {
      uploadres(state, action) {
        console.log('============uploadres======='+ action.payload);
        return {
          ...state,
          result: action.payload,
        };
      },
      save(state, action) {
        console.log('=====save======'+ action.payload);
        return {
          ...state,
          cmdResponse: state.cmdResponse + action.payload,
        };
      },
    },
  };
  