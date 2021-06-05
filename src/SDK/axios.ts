import axios, { AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import { Tip } from 'beeshell';
import qs from 'qs';

const instance = axios.create({
  timeout: 6000,
  baseURL: 'http://localhost:8080',
});

instance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    config.headers = Object.assign(
      config.method === 'get'
        ? {
            Accept: 'application/json',
            'Content-Type': 'application/json; charset=UTF-8',
          }
        : {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          },
      config.headers,
    );
    if (config.method === 'post') {
      const contentType: string = config.headers['Content-Type'];
      if (contentType) {
        if (contentType.includes('multipart')) {
        } else if (contentType.includes('json')) {
          config.data = JSON.stringify(config.data);
        } else {
          config.data = qs.stringify(config.data);
        }
      }
    }
    return Promise.resolve(config);
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.headers['content-type'] === 'application/octet-stream') {
      response.config.responseType = 'blob';
      return response;
    }
    const { code } = response.data || {};
    if (code > 0 && code !== 200) {
      Tip.show(response.data.message || '请求失败,请稍候重试...', 2000);
      return Promise.resolve({});
    } else {
      if ((response.config as any).message) {
        Tip.show((response.config as any).message, 2000);
      }
      return Promise.resolve(response.data?.data || response.data?.result);
    }
  },
  (error: AxiosError) => {
    console.log(error);
    if (error.response) {
      Tip.show(error.response.data.message);
      return Promise.reject(error.response.data);
    } else if (
      error.code === 'ECONNABORTED' &&
      error.message.indexOf('timeout') !== -1
    ) {
      return Promise.reject({ message: '请求超时' });
    } else {
      return Promise.reject({});
    }
  },
);

export default instance;
