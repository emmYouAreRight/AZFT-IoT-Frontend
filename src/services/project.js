import request from '@/utils/request';

export async function getProject() {
  console.log('调用getProject()');
  return request('/project/get_list');
}


export async function createProject(params) {
  console.log(params);
  const bodyForm = new FormData();
  bodyForm.set('Pname', params.Pname);
  bodyForm.set('appName', params.appName);
  bodyForm.set('description', params.description);
  console.log(bodyForm.username);

  return request('/project/create_project', {
    method: 'POST',
    data: bodyForm,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}