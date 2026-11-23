import axios from 'axios';
import parseRss from './parser.js';

const PROXY_URL = 'https://allorigins.hexlet.app/get';

const getProxiedUrl = (url) => {
  const proxyUrl = new URL(PROXY_URL);
  proxyUrl.searchParams.set('disableCache', 'true');
  proxyUrl.searchParams.set('url', url);
  return proxyUrl.toString();
};

const fetchRss = (url) => axios
  .get(getProxiedUrl(url))
  .then((response) => parseRss(response.data.contents));

export default fetchRss;
