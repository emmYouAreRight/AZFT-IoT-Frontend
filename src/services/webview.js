import request from '@/utils/request';

export async function tinylink(params) {
    console.log('=============service调用tinylink================');
    console.log(params);
    const bodyForm = new FormData();
    bodyForm.set('filePath', params.filepath);
    bodyForm.set('projectName', params.proname);

  
    return request('/tinylink/withPath', {
      method: 'POST',
      data: bodyForm,
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  
  }