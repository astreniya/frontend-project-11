import * as yup from 'yup';

yup.setLocale({
    string: {
        url: 'Ссылка должна быть валидным URL',
    },
    mixed: {
        required: 'Не должно быть пустым',
        notOneOf: 'RSS уже существует',
    },
});

const validateUrl = (url, existingUrls) => {
    const schema = yup
        .string()
        .trim()
        .required()
        .url()
        .notOneOf(existingUrls);

    return schema.validate(url);
};

export default validateUrl;
