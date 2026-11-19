const parseRss = (xmlString) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlString, 'application/xml');

    const parseError = doc.querySelector('parsererror');
    if (parseError) {
        const error = new Error(parseError.textContent);
        error.isParsingError = true;
        throw error;
    }

    const channel = doc.querySelector('channel');
    if (!channel) {
        const error = new Error('Invalid RSS structure');
        error.isParsingError = true;
        throw error;
    }

    const feedTitle = channel.querySelector('title')?.textContent ?? '';
    const feedDescription = channel.querySelector('description')?.textContent ?? '';

    const itemElements = Array.from(channel.querySelectorAll('item'));
    const posts = itemElements.map((item) => ({
        title: item.querySelector('title')?.textContent ?? '',
        link: item.querySelector('link')?.textContent ?? '',
        description: item.querySelector('description')?.textContent ?? '',
    }));

    return {
        feed: {
            title: feedTitle,
            description: feedDescription,
        },
        posts,
    };
};

export default parseRss;
