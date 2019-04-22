import axios from 'axios';
import { notification } from 'antd';

function checkStatus(response) {
  console.log(response);
  if (response.status >= 200 && response.status < 300) {
    const { data: result } = response;
    console.log(result);

    if (result.code === 0) {
      result.status = 'ok'; //eslint-disable-line
      return result;
    }
    console.log('============error================');
    console.log(response);
    const error = new Error(response.statusText);

    error.response = result;
    console.log(error.response);
    error.message = result.message;
    console.log(error.message);
    throw error;
  } else {
    const error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
}

axios.defaults.baseURL = 'http://api.tinylink.cn';
axios.defaults.withCredentials = true;
/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "axios"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options, errorCallback) {
  const defaultOptions = {
    credentials: 'include',
  };
  const newOptions = { ...defaultOptions, ...options };
  if (newOptions.method === 'POST' || newOptions.method === 'PUT') {
    newOptions.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      ...newOptions.headers,
    };
  }

  return axios
    .create()
    .request({
      url,
      method: options && options.method ? options.method : 'get',
      timeout: 30000, // http请求超时时间
      ...newOptions,
    })
    .then(checkStatus)
    .catch(error => {
      if (error.code) {
        notification.error({
          message: error.name,
          description: error.message,
        });
      }
      // http请求超时处理
      if ('stack' in error && 'message' in error) {
        const { message } = error;
        if (message.indexOf('timeout') !== -1) {
          notification.error({
            message: `请求错误: ${url}`,
            description: '很抱歉您的请求已经超时了，请稍后再试！',
          });
        } else if (errorCallback) {
          errorCallback.call(this, error);
        } else {
          notification.error({
            message: `请求错误`,
            description: error.message,
          });
        }
      }
      const result = { success: false };
      return result;
    });
}
