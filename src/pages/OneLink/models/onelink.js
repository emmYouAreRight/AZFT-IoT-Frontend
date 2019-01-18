
export default {
    namespace: 'onelink',
  
    state: {
      tinylink: []
    },
  
    effects: {
      
    },
  
    reducers: {
      show(state, { payload }) {
        return {
          ...state,
          ...payload,
        };
      },
    },
  };
  