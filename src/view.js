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

    if (status === 'valid') {
        feedback.textContent = '';
        input.value = '';
        input.focus();
    }
};

const initView = (state, elements, i18nInstance) => {
    subscribe(state.form, () => {
        renderForm(state, elements, i18nInstance);
    });
};

export default initView;
