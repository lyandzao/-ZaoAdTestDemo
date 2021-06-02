import { atom } from 'recoil';

export const userInfoState = atom({
  key: 'userInfo',
  default: {
    gender: 'man',
    age: '22',
    location: '重庆',
  },
});
