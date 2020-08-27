/**
 * @author psarando
 *
 * App Launch Form validation functions.
 */

import { validateDiskResourceName } from "../../data/utils";

import constants from "./constants";

/**
 * @param {*} value - The app parameter value to check.
 * @return {boolean} True if `value` is falsey, with the exception that Numbers can be exactly 0, and Arrays should have at least 1 item.
 */
const isEmptyParamValue = (value) =>
    (!value && value !== 0) || (Array.isArray(value) && value.length < 1);

const validateUnixGlob = (pattern, t) => {
    if (pattern && (pattern.startsWith("/") || pattern.indexOf("../") >= 0)) {
        return t("validationUnixGlob");
    }

    return null;
};

const validateText = ({ value, validators }, t) => {
    let errorMsg = null;

    if (validators?.length > 0) {
        validators.forEach((validator) => {
            if (validator.params?.length > 0) {
                let validatorMsg = null;

                switch (validator.type) {
                    case constants.VALIDATOR_TYPE.REGEX:
                        const regexPattern = validator.params[0];
                        try {
                            const regex = new RegExp(regexPattern);
                            if (!regex.test(value)) {
                                validatorMsg = t("validationRegex", 
                                    {values:  regexPattern }
                                );
                            }
                        } catch (invalidRegex) {}
                        break;

                    case constants.VALIDATOR_TYPE.CHARACTER_LIMIT:
                        const limit = validator.params[0];
                        if (value.length > limit) {
                            validatorMsg = t("validationCharLimit", 
                                {values:  limit }
                            );
                        }
                        break;

                    default:
                        break;
                }

                if (validatorMsg) {
                    errorMsg = validatorMsg;
                }
            }
        });
    }

    return errorMsg;
};

const validateAbove = (value, min, t) => {
    if (value <= min) {
        return t("validationAbove", 
            { min }
        );
    }

    return null;
};

const validateBelow = (value, max, t) => {
    if (value >= max) {
        return t("validationBelow", 
            { max },
        );
    }

    return null;
};

const validateRange = (value, params,t) => {
    let [min, max] = params;
    if (min > max) {
        [max, min] = params;
    }

    if (value < min || max < value) {
        return t("validationRange", 
            { min, max },
        );
    }

    return null;
};

const validateInteger = ({ value, validators }, t) => {
    let errorMsg = null;

    if (validators?.length > 0) {
        validators.forEach((validator) => {
            if (validator.params?.length > 0) {
                let validatorMsg = null;

                switch (validator.type) {
                    case constants.VALIDATOR_TYPE.INT_ABOVE:
                        validatorMsg = validateAbove(
                            value,
                            validator.params[0],
                            t
                        );
                        break;

                    case constants.VALIDATOR_TYPE.INT_BELOW:
                        validatorMsg = validateBelow(
                            value,
                            validator.params[0],
                            t
                        );
                        break;

                    case constants.VALIDATOR_TYPE.INT_RANGE:
                        if (validator.params.length >= 2) {
                            validatorMsg = validateRange(
                                value,
                                validator.params,
                                t
                            );
                        }
                        break;

                    default:
                        break;
                }

                if (validatorMsg) {
                    errorMsg = validatorMsg;
                }
            }
        });
    }

    return errorMsg;
};

const validateDouble = ({ value, validators }, t) => {
    let errorMsg = null;

    if (validators?.length > 0) {
        validators.forEach((validator) => {
            if (validator.params?.length > 0) {
                let validatorMsg = null;

                switch (validator.type) {
                    case constants.VALIDATOR_TYPE.DOUBLE_ABOVE:
                        validatorMsg = validateAbove(
                            value,
                            validator.params[0],
                            t
                        );
                        break;

                    case constants.VALIDATOR_TYPE.DOUBLE_BELOW:
                        validatorMsg = validateBelow(
                            value,
                            validator.params[0],
                            t
                        );
                        break;

                    case constants.VALIDATOR_TYPE.DOUBLE_RANGE:
                        if (validator.params.length >= 2) {
                            validatorMsg = validateRange(
                                value,
                                validator.params,
                                t
                            );
                        }
                        break;

                    default:
                        break;
                }

                if (validatorMsg) {
                    errorMsg = validatorMsg;
                }
            }
        });
    }

    return errorMsg;
};

/**
 * The Formik validation function for the App Launch Form.
 *
 * @param {Object} values - The form values to validate.
 * @param {string} values.name
 * @param {string} values.output_dir
 * @param {Object[]} values.groups
 * @param {Object[]} values.groups.parameters
 *
 * @returns {Object} An object in the same shape as `values`, but with
 * validation error messages under the field keys for fields with an error.
 * May also contain custom error fields not found in `values`.
 * If an empty object is returned, then there were no errors.
 */
const validate = (t) => (values) => {
    const errors = {};

    if (!values.name) {
        errors.name = t("required");
    } else {
        const nameError = validateDiskResourceName(values.name, t);
        if (nameError) {
            errors.name = nameError;
        }
    }

    if (!values.output_dir) {
        errors.output_dir = t("required");
    }

    if (values.groups) {
        const groupErrors = [];
        values.groups.forEach((group, index) => {
            const paramErrors = [];

            if (group.parameters) {
                group.parameters.forEach((param, paramIndex) => {
                    let valueError = null;

                    if (param.required && isEmptyParamValue(param.value)) {
                        valueError = t("required");
                    } else {
                        switch (param.type) {
                            case constants.PARAM_TYPE.TEXT:
                                valueError = validateText(param, t);
                                break;

                            case constants.PARAM_TYPE.INTEGER:
                                valueError = validateInteger(param, t);
                                break;

                            case constants.PARAM_TYPE.DOUBLE:
                                valueError = validateDouble(param, t);
                                break;

                            case constants.PARAM_TYPE.FILE_OUTPUT:
                            case constants.PARAM_TYPE.FOLDER_OUTPUT:
                                valueError = validateDiskResourceName(
                                    param.value,
                                    t
                                );
                                break;

                            case constants.PARAM_TYPE.MULTIFILE_OUTPUT:
                                valueError = validateUnixGlob(param.value, t);
                                break;

                            default:
                                break;
                        }
                    }

                    if (valueError) {
                        paramErrors[paramIndex] = {
                            value: valueError,
                        };
                    }
                });

                if (paramErrors.length > 0) {
                    groupErrors[index] = { parameters: paramErrors };
                }
            }
        });

        if (groupErrors.length > 0) {
            errors.groups = groupErrors;
        }
    }

    return errors;
};

export { isEmptyParamValue };
export default validate;
