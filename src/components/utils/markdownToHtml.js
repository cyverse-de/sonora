/**
 * @author ianmcorvidae, psarando
 */

/**
 * This promise will take raw markdown as a string,
 * sanitize any HTML tags already included in the raw string,
 * then resolve the final HTML rendered from the sanitized markdown.
 *
 * @param {string} rawMarkdown The raw markdown to sanitize and render as HTML.
 * @returns {Promise} A Promise whose fulfillment value is the sanitized,
 *                    raw HTML string.
 */
const markdownToHtml = async (rawMarkdown) => {
    const showdown = (await import("showdown")).default;
    const sanitizeHtml = (await import("sanitize-html")).default;

    const converter = new showdown.Converter({ openLinksInNewWindow: true });
    converter.setFlavor("github");

    return converter.makeHtml(sanitizeHtml(rawMarkdown));
};

export default markdownToHtml;
