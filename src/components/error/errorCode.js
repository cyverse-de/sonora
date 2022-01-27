export function getErrorData(error) {
    return error?.response?.data || error;
}

export function getErrorCode(error) {
    return getErrorData(error)?.error_code;
}

export const ERROR_CODES = {
    ERR_DOES_NOT_EXIST: "ERR_DOES_NOT_EXIST",
    ERR_EXISTS: "ERR_EXISTS",
    ERR_FORBIDDEN: "ERR_FORBIDDEN",
    ERR_LIMIT_REACHED: "ERR_LIMIT_REACHED",
    ERR_NOT_FOUND: "ERR_NOT_FOUND",
    ERR_NOT_READABLE: "ERR_NOT_READABLE",
    ERR_PERMISSION_NEEDED: "ERR_PERMISSION_NEEDED",
    ERR_NOT_WRITEABLE: "ERR_NOT_WRITEABLE",
};

export const signInErrorResponse = { response: { status: 401 } };
