/**
 * @author aramsey
 *
 * @param pattern
 * @param options
 * @returns a RegExp with the pattern and options supplied if the pattern is a valid
 * regular expression, or the same but with any regex characters as string literals
 */

function getRegExp(pattern, options) {
    let regex = null;
    try {
        regex = new RegExp(pattern, options);
    } catch (e) {
        regex = new RegExp(pattern.replace(/[^\w\s]/g, "\\$&"), options);
    }
    return regex;
}

export default getRegExp;
