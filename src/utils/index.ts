export const getRandomAdOrderNum = () => {
  return Math.round(Math.random() * 3 + 1);
};

export const getImgUrl = (url: string) => {
  const res = url.slice(8);
  return `http://192.168.31.232:8080${res}`;
};

export const getImg = (uri: string) => {
  if (!uri) {
    return require('../images/empty.png');
  } else {
    return { uri };
  }
};
