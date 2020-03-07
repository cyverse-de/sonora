/**
 * @author psarando
 *
 * App Launch Form validation functions.
 */
import { getMessage } from "@cyverse-de/ui-lib";

import constants from "./constants";

const validateAbove = (value, min) => {
    if (value <= min) {
        return getMessage("validationAbove", {
            values: { min },
        });
    }

    return null;
};

const validateBelow = (value, max) => {
    if (value >= max) {
        return getMessage("validationBelow", {
            values: { max },
        });
    }

    return null;
};

const validateRange = (value, params) => {
    let [min, max] = params;
    if (min > max) {
        [max, min] = params;
    }

    if (value < min || max < value) {
        return getMessage("validationRange", {
            values: { min, max },
        });
    }

    return null;
};

const validateInteger = ({ value, validators }) => {
    let errorMsg = null;

    if (validators && validators.length > 0) {
        validators.forEach((validator) => {
            if (validator.params && validator.params.length > 0) {
                let validatorMsg = null;

                switch (validator.type) {
                    case constants.VALIDATOR_TYPE.INT_ABOVE:
                        validatorMsg = validateAbove(
                            value,
                            validator.params[0]
                        );
                        break;

                    case constants.VALIDATOR_TYPE.INT_BELOW:
                        validatorMsg = validateBelow(
                            value,
                            validator.params[0]
                        );
                        break;

                    case constants.VALIDATOR_TYPE.INT_RANGE:
                        if (validator.params.length >= 2) {
                            validatorMsg = validateRange(
                                value,
                                validator.params
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

const validateDouble = ({ value, validators }) => {
    let errorMsg = null;

    if (validators && validators.length > 0) {
        validators.forEach((validator) => {
            if (validator.params && validator.params.length > 0) {
                let validatorMsg = null;

                switch (validator.type) {
                    case constants.VALIDATOR_TYPE.DOUBLE_ABOVE:
                        validatorMsg = validateAbove(
                            value,
                            validator.params[0]
                        );
                        break;

                    case constants.VALIDATOR_TYPE.DOUBLE_BELOW:
                        validatorMsg = validateBelow(
                            value,
                            validator.params[0]
                        );
                        break;

                    case constants.VALIDATOR_TYPE.DOUBLE_RANGE:
                        if (validator.params.length >= 2) {
                            validatorMsg = validateRange(
                                value,
                                validator.params
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
const validate = (values) => {
    const errors = {};
    const stepErrors = [];

    if (!values.name) {
        errors.name = getMessage("required");
        stepErrors[0] = true;
    }
    if (!values.output_dir) {
        errors.output_dir = getMessage("required");
        stepErrors[0] = true;
    }

    if (values.groups) {
        const groupErrors = [];
        values.groups.forEach((group, index) => {
            const paramErrors = [];

            if (group.parameters) {
                group.parameters.forEach((param, paramIndex) => {
                    let valueError = null;

                    if (param.required && !param.value && param.value !== 0) {
                        valueError = getMessage("required");
                    } else {
                        switch (param.type) {
                            case constants.PARAM_TYPE.INTEGER:
                                valueError = validateInteger(param);
                                break;
                            case constants.PARAM_TYPE.DOUBLE:
                                valueError = validateDouble(param);
                                break;
                            default:
                                break;
                        }
                    }

                    if (valueError) {
                        paramErrors[paramIndex] = {
                            value: valueError,
                        };
                        stepErrors[1] = true;
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

    if (stepErrors.length > 0) {
        errors.steps = stepErrors;
    }

    return errors;
};

export default validate;
