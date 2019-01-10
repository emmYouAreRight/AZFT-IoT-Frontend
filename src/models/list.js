import { queryFakeList, removeFakeList, addFakeList, updateFakeList } from '@/services/api';
import { getProject, createDocer, createProject, deleteProject } from '@/services/project'

export default {
  namespace: 'list',

  state: {
    list: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getProject, payload);
      yield put({
        type: 'queryList',
        payload: Array.isArray(response.data) ? response.data : [],
      });
    },
    
    *submit({ payload }, { call, put }) {
      
      const response = yield call(createProject, payload); 
      console.log('submit函数的response');
      console.log(response);
      if(response.status == 'ok') {
        const ret = yield call(getProject);
        yield put({
          type: 'queryList',
          payload: Array.isArray(ret.data) ? ret.data : [],
        });
      }
  
    },
    *delete({ payload }, { call, put }) {
      
      const response = yield call(deleteProject, payload); 
      console.log('delete函数的response');
      console.log(response);
      if(response.status == 'ok') {
        const ret = yield call(getProject);
        yield put({
          type: 'queryList',
          payload: Array.isArray(ret.data) ? ret.data : [],
        });
      }
    },
    *openProject({ payload }, { call }) {
      const response = yield call(createDocer, payload);
      console.log('openProject函数的response');
      console.log(response);
      if(response.status == 'ok') {

        console.log('open url');
        theirUrl = response.data.url
        window.open(theirUrl);
      }
      
    }
  },

  reducers: {
    queryList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    appendList(state, action) {
      return {
        ...state,
        list: state.list.concat(action.payload),
      };
    },
  },
};
