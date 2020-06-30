const initialState = {
  userInfo: null,
  token: null,
};

function mainReducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_USER_INFO':
      return {
        ...state,
        userInfo: action.payload,
      };
    case 'SET_ACCESS_TOKEN':
      localStorage.setItem('token', action.payload.value);
      return {
        ...state,
        token: action.payload.value,
      };
    default:
      return state;
  }
}

export default mainReducer;
