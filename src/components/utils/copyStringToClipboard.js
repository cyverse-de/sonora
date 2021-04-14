/**
 * @author sriram
 *
 * A function to copy the input string into users clipboard.
 *
 * See https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText
 *
 */
const copyStringToClipboard = (inputString) => {
    return navigator.clipboard.writeText(inputString);
};

export { copyStringToClipboard };
