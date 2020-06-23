export function testAction(action) {
  return {
    type: 'TEST_ACTION',
    payload: action,
  };
}

export function setUserInfo(userInfo) {
  return {
    type: 'SET_USER_INFO',
    payload: userInfo,
  };
}
