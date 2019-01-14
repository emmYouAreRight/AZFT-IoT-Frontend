// use sessionStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority(str) {
  // return sessionStorage.getItem('webide-authority') || ['admin', 'user'];
  const authorityString =
    typeof str === 'undefined' ? sessionStorage.getItem('webide-authority') : str;
  // authorityString could be admin, "admin", ["admin"]
  let authority;
  try {
    authority = JSON.parse(authorityString);
  } catch (e) {
    authority = authorityString;
  }
  if (typeof authority === 'string') {
    return [authority];
  }
  return authority;
}

export function setAuthority(authority) {
  console.log(authority);
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  return sessionStorage.setItem('webide-authority', JSON.stringify(proAuthority));
}
