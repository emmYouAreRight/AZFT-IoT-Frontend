export function getUserInfo(str) {
  const userString =
    typeof str === 'undefined' ? sessionStorage.getItem('username') : str;
  let userinfo;
  try {
    userinfo = JSON.parse(userString);
  } catch (e) {
    userinfo = userString;
  }
  if (typeof userinfo === 'string') {
    return [userinfo];
  }
  return userinfo;
}

export function setUserInfo(userinfo) {

  const proUserinfo = typeof userinfo === 'string' ? [userinfo] : userinfo;
  return sessionStorage.setItem('username', JSON.stringify(proUserinfo));
}