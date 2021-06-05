import axios from './index';

export interface INewsRes {
  url: string;
  thumbnail_pic_s: string;
  title: string;
  date: string;
}

export interface IVideoNewsRes {
  big_pic: string;
  // big_pic_m: string;
  // collection_count: number; //  点赞数
  // comment_num: number; // 评论数
  // format_published_at: string; // 时间
  h_pic: string; // 封面
  // has_collection: boolean;
  // has_praise: boolean;
  id: number | string;
  // praise_count: number;
  published_at: string;
  share_url: string;
  title: string; // 标题
  // video_fileid: string;
  // video_sign: string;
  // video_time: string;
  // view_count: string;
}

export const getNewsList = (): Promise<INewsRes[]> =>
  axios.get('/demo/news/list');

export const getVideoNewsList = (): Promise<IVideoNewsRes[]> =>
  axios.get('/demo/video_news/list');
