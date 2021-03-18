/**
 * Formatting and init functions for App Edit forms.
 *
 * @author psarando
 */
import AppParamTypes from "components/models/AppParamTypes";

/**
 * @typedef {object} FlagNameModelOptVal
 * @property {string} option
 * @property {string} value
 */

/**
 * @typedef {object} FlagNameModel
 * @property {FlagNameModelOptVal} checked
 * @property {FlagNameModelOptVal} unchecked
 */

/**
 * Initializes the form values from the given App.
 *
 * Removes the optional `name` field from groups,
 * initializes each text parameter's `defaultValue` to an empty string,
 * and each flag's `name` field to a custom object for this form.
 *
 * @param {Object} app
 * @param {Object[]} app.groups
 * @param {Object[]} app.groups.parameters
 *
 * @returns Initial form values.
 */
const initAppValues = (app) => {
    const { groups } = app;

    const initializedGroups = groups?.map(({ name, ...group }) => ({
        ...group,
        parameters: group.parameters?.map((param) => {
            const {
                name,
                defaultValue,
                type: paramType,
                arguments: paramArgs,
            } = param;

            switch (paramType) {
                case AppParamTypes.INTEGER:
                    return {
                        ...param,
                        defaultValue:
                            defaultValue || defaultValue === 0
                                ? Number.parseInt(defaultValue)
                                : "",
                    };

                case AppParamTypes.DOUBLE:
                    return {
                        ...param,
                        defaultValue:
                            defaultValue || defaultValue === 0
                                ? Number.parseFloat(defaultValue)
                                : "",
                    };

                case AppParamTypes.FLAG:
                    return {
                        ...param,
                        name: initFlagName(name),
                        defaultValue: defaultValue && defaultValue !== "false",
                    };

                case AppParamTypes.FILE_INPUT:
                case AppParamTypes.FOLDER_INPUT:
                    return {
                        ...param,
                        defaultValue: defaultValue?.path || "",
                    };

                case AppParamTypes.MULTIFILE_SELECTOR:
                    return {
                        ...param,
                        defaultValue: defaultValue?.path || [],
                    };

                default:
                    let defaultArg;
                    if (paramArgs?.length > 0) {
                        defaultArg =
                            paramArgs.find(
                                (arg) => defaultValue?.id === arg.id
                            ) || paramArgs.find((arg) => arg.isDefault);
                    }

                    return {
                        ...param,
                        defaultValue: defaultArg || defaultValue || "",
                    };
            }
        }),
    }));

    return { ...app, groups: initializedGroups };
};

/**
 * Parses `Flag` param `name` strings into a custom object for this form.
 *
 * @param {string} name
 *
 * @returns {FlagNameModel} An object for use in the flag property editor form.
 */
const initFlagName = (name) => {
    const [checked, unchecked] = name?.split(", ") || [];

    const [checkedOpt, ...checkedVal] = checked?.split(" ") || [];
    const [uncheckedOpt, ...uncheckedVal] = unchecked?.split(" ") || [];

    return {
        checked: {
            option: checkedOpt || "",
            value: checkedVal.join(" "),
        },
        unchecked: {
            option: uncheckedOpt || "",
            value: uncheckedVal.join(" "),
        },
    };
};

/**
 * Formats the form values for submission to the service.
 *
 * @param {Object} app
 * @param {Object[]} app.groups
 * @param {Object[]} app.groups.parameters
 *
 * @returns The App formatted for submission to the service.
 */
const formatSubmission = (app) => {
    const { groups } = app;

    const formattedGroups = groups?.map((group) => ({
        ...group,
        parameters: group.parameters?.map((param) => {
            const {
                name,
                defaultValue,
                type: paramType,
                arguments: paramArgs,
            } = param;

            switch (paramType) {
                case AppParamTypes.TEXT:
                case AppParamTypes.MULTILINE_TEXT:
                case AppParamTypes.REFERENCE_ANNOTATION:
                case AppParamTypes.REFERENCE_GENOME:
                case AppParamTypes.REFERENCE_SEQUENCE:
                    return {
                        ...param,
                        defaultValue: defaultValue || null,
                    };

                case AppParamTypes.INTEGER:
                case AppParamTypes.DOUBLE:
                    return {
                        ...param,
                        defaultValue:
                            defaultValue || defaultValue === 0
                                ? defaultValue
                                : null,
                    };

                case AppParamTypes.FLAG:
                    return {
                        ...param,
                        name: formatFlagName(name),
                        defaultValue: defaultValue && defaultValue !== "false",
                    };

                case AppParamTypes.TEXT_SELECTION:
                case AppParamTypes.INTEGER_SELECTION:
                case AppParamTypes.DOUBLE_SELECTION:
                    return {
                        ...param,
                        arguments: formatSelectionArgs(paramArgs, defaultValue),
                        defaultValue: defaultValue
                            ? { ...defaultValue, isDefault: true }
                            : null,
                    };

                case AppParamTypes.FILE_INPUT:
                case AppParamTypes.FOLDER_INPUT:
                    return {
                        ...param,
                        defaultValue: defaultValue
                            ? { path: defaultValue }
                            : null,
                    };

                case AppParamTypes.MULTIFILE_SELECTOR:
                    // default values not yet supported
                    return {
                        ...param,
                        defaultValue: null,
                    };

                default:
                    return param;
            }
        }),
    }));

    return { ...app, groups: formattedGroups };
};

/**
 * Formats this form's custom `Flag` param `name` model
 * into a string expected by the service.
 *
 * @param {FlagNameModel} name
 *
 * @returns A string in the form
 *          "checked.option checked.value, unchecked.option unchecked.value"
 */
const formatFlagName = (name) => {
    const {
        checked: { option: checkedOpt, value: checkedVal },
        unchecked: { option: uncheckedOpt, value: uncheckedVal },
    } = name;

    return [
        [checkedOpt, checkedVal].join(" ").trim(),
        [uncheckedOpt, uncheckedVal].join(" ").trim(),
    ].join(", ");
};

const formatSelectionArgs = (paramArgs, defaultValue) => {
    return paramArgs?.map((paramArg) => ({
        ...paramArg,
        isDefault:
            paramArg.id === defaultValue?.id ||
            (paramArg.display === defaultValue?.display &&
                paramArg.name === defaultValue?.name &&
                paramArg.value === defaultValue?.value),
    }));
};

export { formatSubmission, initAppValues };
