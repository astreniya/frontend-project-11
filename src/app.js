import axios from 'axios';
import i18next from 'i18next';
import { proxy } from 'valtio/vanilla';
import resources from './locales/index.js';
import parseRss from './parser.js';
import validateUrl from './validator.js';
import initView from './view.js';

const PROXY_URL = 'https://allorigins.hexlet.app/get';
const UPDATE_INTERVAL = 5000;

const getProxiedUrl = (url) => {
    const proxyUrl = new URL(PROXY_URL);
    proxyUrl.searchParams.set('disableCache', 'true');
    proxyUrl.searchParams.set('url', url);
    return proxyUrl.toString();
};

const fetchRss = (url) => axios
    .get(getProxiedUrl(url))
    .then((response) => parseRss(response.data.contents));

const getErrorCode = (error) => {
    if (error.isParsingError) {
        return 'errors.invalidRss';
    }
    if (axios.isAxiosError(error)) {
        return 'errors.network';
    }
    return error.message;
};

const createIdGenerator = () => {
    let id = 0;
    return () => {
        id += 1;
        return String(id);
    };
};

const watchFeeds = (state, generateId) => {
    const promises = state.feeds.map((feed) => fetchRss(feed.url)
        .then(({ posts }) => {
            const existingLinks = new Set(
                state.posts
                    .filter((post) => post.feedId === feed.id)
                    .map((post) => post.link),
            );

            const newPosts = posts
                .filter((post) => !existingLinks.has(post.link))
                .map((post) => ({
                    id: generateId(),
                    feedId: feed.id,
                    title: post.title,
                    link: post.link,
                    description: post.description,
                }));

            if (newPosts.length > 0) {
                state.posts.unshift(...newPosts);
            }
        })
        .catch(() => {}));

    Promise.allSettled(promises).finally(() => {
        setTimeout(() => watchFeeds(state, generateId), UPDATE_INTERVAL);
    });
};

const app = () => {
    const i18nInstance = i18next.createInstance();
    const generateId = createIdGenerator();

    return i18nInstance
        .init({
            lng: 'ru',
            debug: false,
            resources,
        })
        .then(() => {
            const state = proxy({
                feeds: [],
                posts: [],
                form: {
                    status: 'filling',
                    error: null,
                },
                loadingProcess: {
                    status: 'idle',
                    error: null,
                },
            });

            const elements = {
                form: document.querySelector('form'),
                input: document.querySelector('#url-input'),
                submitButton: document.querySelector('button[type="submit"]'),
                feedback: document.querySelector('#feedback'),
                feedsContainer: document.querySelector('#feeds'),
                postsContainer: document.querySelector('#posts'),
            };

            initView(state, elements, i18nInstance);
            setTimeout(() => watchFeeds(state, generateId), UPDATE_INTERVAL);

            elements.form.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const url = formData.get('url').trim();
                const existingUrls = state.feeds.map((feed) => feed.url);

                state.form.status = 'filling';
                state.form.error = null;

                validateUrl(url, existingUrls)
                    .then((validUrl) => {
                        state.form.status = 'valid';
                        state.loadingProcess.status = 'loading';
                        state.loadingProcess.error = null;

                        return fetchRss(validUrl).then(({ feed, posts }) => {
                            const feedId = generateId();

                            const normalizedFeed = {
                                id: feedId,
                                url: validUrl,
                                title: feed.title,
                                description: feed.description,
                            };

                            const normalizedPosts = posts.map((post) => ({
                                id: generateId(),
                                feedId,
                                title: post.title,
                                link: post.link,
                                description: post.description,
                            }));

                            state.feeds.unshift(normalizedFeed);
                            state.posts.unshift(...normalizedPosts);
                            state.loadingProcess.status = 'success';
                        });
                    })
                    .catch((err) => {
                        if (err.name === 'ValidationError') {
                            state.form.error = err.message;
                            state.form.status = 'invalid';
                        } else {
                            state.loadingProcess.error = getErrorCode(err);
                            state.loadingProcess.status = 'failed';
                        }
                    });
            });
        });
};

export default app;
