export const setNews = () => ({
  type: 'SET_NEWS',
});

export const loginUser = (userData) => ({
  type: 'LOGIN_USER',
  userData
});

export const logOutUser = () => ({
  type: 'LOGOUT_USER',
});

export const setCurrentUser = (json) => ({
  type: 'SET_CURRENT_USER',
  json
});

export const setCurrentUserActKeyInfo = (payload) => ({
  type: 'SET_CURRENT_USER_ACT_KEY_INFO',
  payload: payload
})


export const setCurrentUserMsgInfo = (payload) => ({
  type: 'SET_CURRENT_USER_FAILED',
  error: payload
})

export const setCurrentUserDeviceInfo = (payload) => ({
  type: 'SET_CURRENT_USER_DEVICE_INFO',
  payload: payload
})