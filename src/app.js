import { proxy } from 'valtio/vanilla';
import validateUrl from './validator.js';
import initView from './view.js';

const app = () => {
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

    initView(state, elements);

    elements.form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const url = formData.get('url').trim();
        const existingUrls = state.feeds.map((feed) => feed.url);

        // Сбрасываем статус перед новой проверкой, чтобы сработал подписчик даже при повторной одинаковой ошибке
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
};

export default app;
