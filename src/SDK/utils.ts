export const getImg = (uri: string) => {
  if (!uri) {
    return require('../images/empty.png');
  } else {
    return { uri };
  }
};

export const getImgUrl = (url: string) => {
  const res = url.slice(8).replace(/\\/g, '/');
  return `http://192.168.31.232:8080${res}`;
};
