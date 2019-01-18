
export default {
    namespace: 'tinysim',
  
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
  