export function getErrorCode(error) {
    return error?.response?.data?.error_code;
}

export const ERROR_CODES = {
    ERR_EXISTS: "ERR_EXISTS",
};
