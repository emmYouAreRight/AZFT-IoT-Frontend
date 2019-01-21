import request from '@/utils/request';
import { notification } from 'antd';

export async function getProject() {
  return request('/project/get_list', {}, () => {
    notification.error({
      message: '无法获取项目列表',
      description: '请重新登录',
    });
  });
}

export async function createProject(params) {
  const bodyForm = new FormData();
  bodyForm.set('Pname', params.Pname);
  bodyForm.set('appName', params.appName);
  bodyForm.set('description', params.description || '');

  return request('/project/create_project', {
    method: 'POST',
    data: bodyForm,
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

export async function deleteProject(params) {
  const bodyForm = new FormData();
  bodyForm.set('PID', params.pid);

  return request('/project/delete_project', {
    method: 'POST',
    data: bodyForm,
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

export async function createDocer(params) {
  const bodyForm = {
    projectName: params.pname,
  };
  return request('/docker/create', {
    method: 'POST',
    data: JSON.stringify(bodyForm),
  });
}
