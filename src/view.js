import { subscribe } from 'valtio/vanilla';

const renderForm = (state, elements, i18nInstance) => {
    const { input, feedback } = elements;
    const { status, error } = state.form;

    if (status === 'invalid') {
        input.classList.remove('border-transparent', 'focus:border-blue-500');
        input.classList.add('border-red-500', 'focus:border-red-500');
        feedback.classList.remove('text-emerald-400');
        feedback.classList.add('text-red-400');
        feedback.textContent = i18nInstance.t(error);
        return;
    }

    input.classList.remove('border-red-500', 'focus:border-red-500');
    input.classList.add('border-transparent', 'focus:border-blue-500');
};

const renderLoadingProcess = (state, elements, i18nInstance) => {
    const { input, submitButton, feedback } = elements;
    const { status, error } = state.loadingProcess;

    switch (status) {
        case 'loading':
            input.setAttribute('readonly', 'true');
            submitButton.disabled = true;
            submitButton.classList.add('opacity-50', 'cursor-not-allowed');
            feedback.textContent = '';
            break;

        case 'success':
            input.removeAttribute('readonly');
            submitButton.disabled = false;
            submitButton.classList.remove('opacity-50', 'cursor-not-allowed');
            input.value = '';
            input.focus();
            feedback.classList.remove('text-red-400');
            feedback.classList.add('text-emerald-400');
            feedback.textContent = i18nInstance.t('status.success');
            break;

        case 'failed':
            input.removeAttribute('readonly');
            submitButton.disabled = false;
            submitButton.classList.remove('opacity-50', 'cursor-not-allowed');
            feedback.classList.remove('text-emerald-400');
            feedback.classList.add('text-red-400');
            feedback.textContent = i18nInstance.t(error);
            break;

        default:
            break;
    }
};

const renderFeeds = (state, elements, i18nInstance) => {
    const { feedsContainer } = elements;
    if (state.feeds.length === 0) {
        feedsContainer.innerHTML = '';
        return;
    }

    const card = document.createElement('div');
    card.className = 'rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-900/5';

    const heading = document.createElement('h2');
    heading.className = 'mb-4 text-xl font-bold text-gray-900';
    heading.textContent = i18nInstance.t('feeds.title');

    const list = document.createElement('ul');
    list.className = 'divide-y divide-gray-200';

    state.feeds.forEach((feed) => {
        const item = document.createElement('li');
        item.className = 'py-3 first:pt-0 last:pb-0';

        const title = document.createElement('h3');
        title.className = 'text-base font-semibold text-gray-900';
        title.textContent = feed.title;

        const description = document.createElement('p');
        description.className = 'mt-1 text-sm text-gray-600';
        description.textContent = feed.description;

        item.append(title, description);
        list.append(item);
    });

    card.append(heading, list);
    feedsContainer.replaceChildren(card);
};

const renderPosts = (state, elements, i18nInstance) => {
    const { postsContainer } = elements;
    if (state.posts.length === 0) {
        postsContainer.innerHTML = '';
        return;
    }

    const card = document.createElement('div');
    card.className = 'rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-900/5';

    const heading = document.createElement('h2');
    heading.className = 'mb-4 text-xl font-bold text-gray-900';
    heading.textContent = i18nInstance.t('posts.title');

    const list = document.createElement('ul');
    list.className = 'divide-y divide-gray-200';

    state.posts.forEach((post) => {
        const item = document.createElement('li');
        item.className = 'flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0';

        const link = document.createElement('a');
        link.href = post.link;
        link.textContent = post.title;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.dataset.id = post.id;
        link.className = 'font-bold text-blue-600 hover:underline';

        item.append(link);
        list.append(item);
    });

    card.append(heading, list);
    postsContainer.replaceChildren(card);
};

const initView = (state, elements, i18nInstance) => {
    subscribe(state.form, () => {
        renderForm(state, elements, i18nInstance);
    });

    subscribe(state.loadingProcess, () => {
        renderLoadingProcess(state, elements, i18nInstance);
    });

    subscribe(state.feeds, () => {
        renderFeeds(state, elements, i18nInstance);
    });

    subscribe(state.posts, () => {
        renderPosts(state, elements, i18nInstance);
    });
};

export default initView;
