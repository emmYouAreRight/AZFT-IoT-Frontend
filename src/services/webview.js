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
  export async function tinysim(params) {
    console.log('=============service调用tinysim================');
    console.log(params);
    const bodyForm = new FormData();
    bodyForm.set('appcpp', params.filepath);
    bodyForm.set('configjso', params.confpath);
    bodyForm.set('noisetx', '');
    bodyForm.set('topology', '');
    bodyForm.set('executing_time', params.executing_time);
    bodyForm.set('execute_mode', params.execute_mode);
    bodyForm.set('file_field', '1100');
    bodyForm.set('projectName', params.proname);

    return request('/tinysim/uploadfile/withPath', {
      method: 'POST',
      data: bodyForm,
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  
  }


  export async function tinysimCmd(params) {
    console.log('=============service调用tinysimCmd================');
    console.log(params);
    const bodyForm = new FormData();
    bodyForm.set('cmd', params.cmd);
  
    return request('/tinysim/cmd', {
      method: 'POST',
      data: bodyForm,
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  }

  export async function onelink(params) {
    console.log('=============service调用onelink================');
    console.log(params);
    const bodyForm = new FormData();
    bodyForm.set('type', params.type);
    bodyForm.set('filePath', params.filepath);
    bodyForm.set('projectName', params.proname);
    bodyForm.set('projectDec', ' ');
    console.log(bodyForm);
    return request('/onelink/withPath', {
      method: 'POST',
      data: bodyForm,
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  
  }

  
  export async function onelinkProInfo(params) {
    console.log('=============service调用onelinkProInfo================');
    console.log(params);
    const bodyForm = new FormData();
    bodyForm.set('type', params.ftype);
    bodyForm.set('projectName', params.proname);
  
    return request('/onelink/project/info', {
      method: 'POST',
      data: bodyForm,
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  
  }
  export async function onelinkProComp(params) {
    console.log(params);
    const bodyForm = new FormData();
    bodyForm.set('appName', params.appName);
    bodyForm.set('projectName', params.proname);
   
    return request('/onelink/project/compile/info', {
      method: 'POST',
      data: bodyForm,
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  }

  export async function onelinkDevInfo(params) {
    console.log('=============service调用onelinkDevInfo================');
    console.log(params);
    const bodyForm = new FormData();
    bodyForm.set('projectName', params.proname);
    bodyForm.set('instance', params.instance);
  
    return request('/onelink/project/device/info', {
      method: 'POST',
      data: bodyForm,
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  }

  export async function onelinkProList() {
    console.log('=============service调用onelinkProList================');
    return request('/onelink/project/list', {
      method: 'POST',
    })
  
  }
  export async function onelinkDelPro(params) {
    console.log(params);
    const bodyForm = new FormData();
    bodyForm.set('projectName', params.appName);
  
  
    return request('/onelink/project/delete', {
      method: 'POST',
      data: bodyForm,
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  }

  export async function onelinkCppDownload(params) {
    console.log('=============service调用onelinkCppDownload================');
    console.log(params);
    return request(`/onelink/project/file/download?${stringify(params)}`);
  }

  export async function onelinkHtml(params) {
    console.log('=============service调用onelinkHtml================');
    console.log(params);
    const bodyForm = new FormData();
    bodyForm.set('mobileName', params.mobilename);
    bodyForm.set('projectName', params.proname);
  
    return request('/onelink/mobile/getHtml', {
      method: 'POST',
      data: bodyForm,
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  
  }
  export async function test() {
    return request('http://ol.tinylink.cn/onelink/project_module/project_control.php?type=rawData&dataSource=649%2C646');
  }