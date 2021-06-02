import axios from './index';

export interface IAd {
  _id: string;
  ads_name: string;
  code_type: string;
  creative_config: {
    img_type: 'vertical' | 'horizontal';
    img: string;
    desc: string; // 广告描述
    brand_title: string; // 品牌标题
    location_url: string; // 落地页
  };
  advertiser_id: string;
}

export const getAd = (
  type: string,
  directionalConfig?: any,
): Promise<IAd[]> => {
  console.log(directionalConfig);
  return axios.get('/sdk/ad', {
    params: { type, directionalConfig: JSON.stringify(directionalConfig) },
  });
};

export const sendShowEvent = (ads_id: string, code_id: string) =>
  axios.get('/sdk/ad/event', {
    params: {
      ads_id,
      code_id,
      type: 'show',
    },
  });
export const sendClickEvent = (ads_id: string, code_id: string) =>
  axios.get('/sdk/ad/event', {
    params: {
      ads_id,
      code_id,
      type: 'click',
    },
  });

export const sendCustomEvent = (
  app_id: string,
  event: string,
  type: 'show' | 'click',
) =>
  axios.get('/sdk/custom/event', {
    params: {
      app_id,
      event,
      type,
    },
  });
