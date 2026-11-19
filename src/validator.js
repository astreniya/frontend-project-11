import * as yup from 'yup';

yup.setLocale({
    string: {
        url: 'errors.validation.url',
    },
    mixed: {
        required: 'errors.validation.required',
        notOneOf: 'errors.validation.notOneOf',
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