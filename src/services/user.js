import request from '@/utils/request';
import { notification } from 'antd';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  // console.log(sessionStorage);
}

export async function userLogin(params) {
  const bodyForm = new FormData();
  bodyForm.set('username', params.userName);
  bodyForm.set('password', params.password);

  return request(
    '/user/login',
    {
      method: 'POST',
      data: bodyForm,
      headers: { 'Content-Type': 'multipart/form-data' },
    },
    () => {
      notification.error({
        message: '登录失败',
        description: `请检查你的账号和密码是否正确`,
      });
    }
  );
}

export async function userRegister(params) {

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
    submit: 'Register',
  };

  return request('/user/register', {
    method: 'POST',
    data: JSON.stringify(bodyForm),
  });
}

export async function userLogout() {
  return request('/user/logout');
}
