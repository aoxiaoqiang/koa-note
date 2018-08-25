// https://github.com/request/request-promise
const requestPromise = require('request-promise');
const baseUrl = 'https://music.163.com'

const defaultHeaders = {
  "Referer": baseUrl,
  "Origin": baseUrl,
  "Host": "music.163.com",
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3380.0 Safari/537.36",
}

// 推荐列表
const discover = () => {
  const options = {
    uri: `${baseUrl}/discover`,
    headers: defaultHeaders
  }
  return requestPromise(options);
}

// 播放列表
const playlist = (id) => {
  const options = {
    uri: `${baseUrl}/playlist?id=${id}`,
    headers: defaultHeaders
  }
  return requestPromise(options);
}

// 歌曲详情
const song = (id) => {
  const options = {
    uri: `${baseUrl}/song?id=${id}`,
    headers: defaultHeaders
  }
  return requestPromise(options);
}

module.exports = {
  discover,
  playlist,
  song
};