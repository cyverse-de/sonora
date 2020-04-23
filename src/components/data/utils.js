/**
 * @author sriram
 *
 */
import { getMessage } from "@cyverse-de/ui-lib";

import constants from "../../constants";
import DataConstants from "./constants";

/**
 * Encode given path
 *
 * @param {string} path - path selected by user
 * @returns {string} encoded path
 */
function getEncodedPath(path) {
    const encodedPath = path
        .split(constants.PATH_SEPARATOR)
        .map((item) => encodeURIComponent(item))
        .join(constants.PATH_SEPARATOR);
    return encodedPath;
}

const validateDiskResourceName = (name) => {
    if (name === "") {
        return getMessage("validationEmptyDiskResourceName");
    }
    if (name === "." || name === "..") {
        return getMessage("validationDiskResourceName");
    }

    const illegalChars = name?.match(DataConstants.NAME_INVALID_CHARS_REGEX);

    if (illegalChars) {
        const charList = [...new Set(illegalChars)]
            .map((c) => {
                if (c === "\n") return "\\n";
                if (c === "\t") return "\\t";
                return c;
            })
            .join("");

        return getMessage("validationInvalidCharacters", {
            values: { charList },
        });
    }

    return null;
};

export { getEncodedPath, validateDiskResourceName };
