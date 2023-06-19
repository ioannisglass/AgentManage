const isEmpty = require("is-empty");

const authReducer = (state = {}, action) => {
  switch (action.type) {
    case 'SET_NEWS':
      return {
        ... state,
        news: action.payload
      }
    case 'SET_CURRENT_USER':
      return {
        ...state,
        isAuthenticated: !isEmpty(action.json),
        user: action.json,
      };
    case 'SET_CURRENT_USER_ACT_KEY_INFO':
      return {
        ...state,
        actkey: action.payload
      };
    case 'SET_CURRENT_USER_DEVICE_INFO':
      return {
        ...state,
        device: action.payload
      };
    case 'SET_CURRENT_USER_FAILED':
      return {
        ...state,
        loginError: action.error,
      };
    default:
      return state;
  }
};
export default authReducer;
