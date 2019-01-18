
export default {
  namespace: 'tinylink',

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
