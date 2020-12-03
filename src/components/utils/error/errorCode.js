export function getErrorData(error) {
    return error?.response?.data;
}

export function getErrorCode(error) {
    return getErrorData(error)?.error_code;
}

export const ERROR_CODES = {
    ERR_EXISTS: "ERR_EXISTS",
    ERR_NOT_FOUND: "ERR_NOT_FOUND",
};
