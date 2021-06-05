import { atom } from 'recoil';

export const userInfoState = atom({
  key: 'userInfo',
  default: {
    gender: 'man',
    age: '25',
    location: '重庆',
  },
});
