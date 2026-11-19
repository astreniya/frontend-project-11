import i18next from 'i18next';
import { proxy } from 'valtio/vanilla';
import resources from './locales/index.js';
import validateUrl from './validator.js';
import initView from './view.js';

const app = () => {
    const i18nInstance = i18next.createInstance();

    return i18nInstance
        .init({
            lng: 'ru',
            debug: false,
            resources,
        })
        .then(() => {
            const state = proxy({
                feeds: [],
                form: {
                    status: 'filling', // 'filling' | 'valid' | 'invalid'
                    error: null,
                },
            });

            const elements = {
                form: document.querySelector('form'),
                input: document.querySelector('#url-input'),
                feedback: document.querySelector('#feedback'),
            };

            initView(state, elements, i18nInstance);

            elements.form.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const url = formData.get('url').trim();
                const existingUrls = state.feeds.map((feed) => feed.url);

                state.form.status = 'filling';

                validateUrl(url, existingUrls)
                    .then((validUrl) => {
                        state.feeds.push({ url: validUrl });
                        state.form.error = null;
                        state.form.status = 'valid';
                    })
                    .catch((err) => {
                        state.form.error = err.message;
                        state.form.status = 'invalid';
                    });
            });
        });
};

export default app;
