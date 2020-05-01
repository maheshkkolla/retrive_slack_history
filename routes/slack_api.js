import fetch from 'node-fetch';

const token = process.env.TOKEN;

const parseQuery = (query) => {
  const keys = Object.keys(query);
  return keys.map(key => {
    return `${key}=${query[key]}`;
  }).join("&")
};

const logError = (error) => {
  console.log("Error while reaching slack: ", error);
};

export default {
  request: (url, query) => {
    return fetch(`${url}?token=${token}&${parseQuery(query || {})}`)
        .then((res) => res.json()).catch(logError);
  },
}
