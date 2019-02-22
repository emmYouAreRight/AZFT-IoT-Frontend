export function getUserInfo(str) {
  const userString =
    typeof str === 'undefined' ? localStorage.getItem('username') : str;
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
  return localStorage.setItem('username', JSON.stringify(proUserinfo));
}

export function setTinyID(tinyid) {

  const proTinyid = typeof tinyid === 'string' ? [tinyid] : tinyid;
  return localStorage.setItem('tinyid', JSON.stringify(proTinyid));
}

export function getTinyID(str) {
  const tinyid =
    typeof str === 'undefined' ? localStorage.getItem('tinyid') : str;
  let usertinyid;
  try {
    usertinyid = JSON.parse(tinyid);
  } catch (e) {
    usertinyid = tinyid;
  }
  if (typeof usertinyid === 'string') {
    return [usertinyid];
  }
  return usertinyid;
}

export function setOneID(oneid) {

  const proOneid = typeof oneid === 'string' ? [oneid] : oneid;
  return localStorage.setItem('oneid', JSON.stringify(proOneid));
}

export function getOneID(str) {
  const oneid =
    typeof str === 'undefined' ? localStorage.getItem('oneid') : str;
  let useroneid;
  try {
    useroneid = JSON.parse(oneid);
  } catch (e) {
    useroneid = oneid;
  }
  if (typeof useroneid === 'string') {
    return [useroneid];
  }
  return useroneid;
}