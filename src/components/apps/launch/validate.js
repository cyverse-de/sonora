/**
 * @author psarando
 *
 * App Launch Form validation functions.
 */
import { getMessage } from "@cyverse-de/ui-lib";

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
                    if (!param.value && param.required) {
                        paramErrors[paramIndex] = {
                            value: getMessage("required"),
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
