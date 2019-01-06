import request from '@/utils/request';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  console.log(localStorage);
  
}

export async function userLogin(params) {
  console.log(params);
  const bodyForm = new FormData();
  bodyForm.set('username', params.userName);
  bodyForm.set('password', params.password);
  console.log(bodyForm.username);

  return request('/user/login', {
    method: 'POST',
    data: bodyForm,
    headers: { 'Content-Type': 'multipart/form-data' }
  })

}

export async function userRegister(params) {
  console.log(params);

  const bodyForm = {
    full_name: params.full_name,
    username: params.username,
    pass1: params.pass1,
    pass2: params.pass2,
    birthday: params.birthday.format('YYYY-MM-DD'),
    gender: params.gender,
    education: params.education,
    job: params.job,
    iOT_familiar: params.iOT_familiar,
    embeded_familiar: params.embeded_familiar,
    lan_familiar: params.lan_familiar,
    type: 'register',
    submit: 'Register'
  }
  console.log(bodyForm);

  return request('/user/register', {
    method: 'POST',
    data: JSON.stringify(bodyForm),
  })
}

export async function userLogout() {
  console.log('调用logout');
  return request('/user/logout');
}
