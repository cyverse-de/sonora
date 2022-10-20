/**
 * Formatting and init functions for App Edit forms.
 *
 * @author psarando
 */
import { DataSources } from "./params/FileOutputPropertyFields";

import AppParamTypes from "components/models/AppParamTypes";

const FILE_INFO_TYPE_DEFAULT = "File";
const FILE_PARAMETER_FORMAT_DEFAULT = "Unspecified";

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
 * Also adds globally unique `key` fields to each group and parameter,
 * so React does not mix up DOM elements when groups are rearranged in the form.
 *
 * @param {Object} app
 * @param {Object[]} app.groups
 * @param {Object[]} app.groups.parameters
 *
 * @returns Initial form values.
 */
const initAppValues = (app) => {
    const { groups, version, version_id } = app || {};

    const initializedGroups = groups?.map(({ name, ...group }, groupIndex) => ({
        ...group,
        key: group.id || `group${groupIndex}`,
        parameters: group.parameters?.map((param, paramIndex) => {
            const { defaultValue, name: paramName, type: paramType } = param;

            // shouldn't be necessary, except maybe in storybook
            const paramFallbackKey = `group${groupIndex}.param${paramIndex}`;

            const formattedParam = {
                ...param,
                key: param.id || paramFallbackKey,
            };

            switch (paramType) {
                case AppParamTypes.INTEGER:
                    formattedParam.defaultValue =
                        defaultValue || defaultValue === 0
                            ? Number.parseInt(defaultValue)
                            : "";
                    break;

                case AppParamTypes.DOUBLE:
                    formattedParam.defaultValue =
                        defaultValue || defaultValue === 0
                            ? Number.parseFloat(defaultValue)
                            : "";
                    break;

                case AppParamTypes.FLAG:
                    formattedParam.name = initFlagName(paramName);
                    formattedParam.defaultValue =
                        defaultValue && defaultValue !== "false";
                    break;

                case AppParamTypes.FILE_INPUT:
                case AppParamTypes.FOLDER_INPUT:
                    formattedParam.defaultValue = defaultValue?.path || "";
                    break;

                case AppParamTypes.MULTIFILE_SELECTOR:
                    formattedParam.defaultValue = defaultValue?.path || [];
                    break;

                default:
                    let defaultArg;
                    if (formattedParam.arguments?.length > 0) {
                        formattedParam.arguments = formattedParam.arguments.map(
                            (arg, argIndex) => ({
                                ...arg,
                                key:
                                    arg.id || `${paramFallbackKey}.${argIndex}`,
                            })
                        );

                        defaultArg =
                            formattedParam.arguments.find(
                                (arg) => arg.id && arg.id === defaultValue?.id
                            ) ||
                            formattedParam.arguments.find(
                                (arg) => arg.isDefault
                            );
                    }

                    formattedParam.defaultValue =
                        defaultArg || defaultValue || "";
                    break;
            }

            return formattedParam;
        }),
    }));

    return {
        ...app,

        groups: initializedGroups,

        // If the version_id is empty, then keep the version label empty as well,
        // to force the user to enter a new version label.
        version: version_id ? version : "",

        // The editorSteps array is only required for preserving touched state
        // after any onSubmit errors:
        // https://github.com/formium/formik/issues/445#issuecomment-366952762
        editorSteps: [null, null, null, null, null],
    };
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
const formatSubmission = ({ editorSteps, versions, ...app }) => {
    const { groups, tools } = app;

    const formattedGroups = groups?.map(
        ({ id, label, isVisible, parameters }) => ({
            id,
            label,
            isVisible,
            parameters: parameters?.map((formParam) => {
                const {
                    id,
                    type: paramType,
                    arguments: paramArgs,
                    name,
                    defaultValue,
                    label,
                    description,
                    order,
                    isVisible,
                    required,
                    omit_if_blank,
                    validators,
                    file_parameters,
                } = formParam;

                const param = {
                    id,
                    type: paramType,
                    name,
                    label,
                    description,
                    order,
                    isVisible,
                };

                switch (paramType) {
                    case AppParamTypes.INFO:
                        // Info params don't need any other properties.
                        return param;

                    case AppParamTypes.TEXT:
                        return {
                            ...param,
                            required,
                            omit_if_blank,
                            validators,
                            defaultValue: defaultValue || null,
                        };

                    case AppParamTypes.INTEGER:
                    case AppParamTypes.DOUBLE:
                        return {
                            ...param,
                            required,
                            omit_if_blank,
                            validators,
                            defaultValue:
                                defaultValue || defaultValue === 0
                                    ? defaultValue
                                    : null,
                        };

                    case AppParamTypes.FLAG:
                        return {
                            ...param,
                            name: formatFlagName(name),
                            defaultValue:
                                defaultValue && defaultValue !== "false",
                        };

                    case AppParamTypes.TEXT_SELECTION:
                    case AppParamTypes.INTEGER_SELECTION:
                    case AppParamTypes.DOUBLE_SELECTION:
                        return {
                            ...param,
                            required,
                            omit_if_blank,
                            arguments: formatSelectionArgs(
                                paramArgs,
                                defaultValue
                            ),
                            defaultValue: defaultValue
                                ? formatSelectionDefaultValue(defaultValue)
                                : null,
                        };

                    case AppParamTypes.FILE_INPUT:
                    case AppParamTypes.FOLDER_INPUT:
                        return {
                            ...param,
                            required,
                            omit_if_blank,
                            file_parameters,
                            defaultValue: defaultValue
                                ? { path: defaultValue }
                                : null,
                        };

                    case AppParamTypes.FILE_OUTPUT:
                    case AppParamTypes.FOLDER_OUTPUT:
                    case AppParamTypes.MULTIFILE_OUTPUT:
                        return {
                            ...param,
                            required,
                            omit_if_blank,
                            file_parameters,
                            defaultValue: defaultValue || null,
                        };

                    case AppParamTypes.MULTIFILE_SELECTOR:
                        return {
                            ...param,
                            required,
                            omit_if_blank,
                            file_parameters,
                            // default values not yet supported
                            defaultValue: null,
                        };

                    default:
                        return {
                            ...param,
                            required,
                            omit_if_blank,
                            defaultValue: defaultValue || null,
                        };
                }
            }),
        })
    );

    const [tool] = tools;
    const { id, name, version, type } = tool || {};

    return {
        ...app,
        groups: formattedGroups,
        tools: tool ? [{ id, name, version, type }] : [],
    };
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
    return paramArgs?.map(({ key, ...paramArg }) => ({
        ...paramArg,
        isDefault: key === defaultValue?.key,
    }));
};

const formatSelectionDefaultValue = ({ key, ...defaultValue }) => {
    return { ...defaultValue, isDefault: true };
};

const getNewParam = (paramType, label, key) => {
    const newParam = {
        key,
        type: paramType,
        name: "",
        label,
        description: "",
        order: 0,
        isVisible: true,
    };

    switch (paramType) {
        case AppParamTypes.INFO:
            // Info params don't need any other properties.
            break;

        case AppParamTypes.FLAG:
            newParam.defaultValue = false;
            newParam.name = {
                checked: {
                    option: "",
                    value: "",
                },
                unchecked: {
                    option: "",
                    value: "",
                },
            };
            break;

        case AppParamTypes.TEXT_SELECTION:
            newParam.arguments = [];
            newParam.defaultValue = "";
            newParam.required = false;
            newParam.omit_if_blank = false;
            break;

        case AppParamTypes.FILE_INPUT:
        case AppParamTypes.FILE_OUTPUT:
        case AppParamTypes.FOLDER_INPUT:
        case AppParamTypes.FOLDER_OUTPUT:
        case AppParamTypes.MULTIFILE_OUTPUT:
            newParam.defaultValue = "";
            newParam.required = false;
            newParam.omit_if_blank = false;
            newParam.file_parameters = {
                data_source: DataSources.FILE,
                file_info_type: FILE_INFO_TYPE_DEFAULT,
                format: FILE_PARAMETER_FORMAT_DEFAULT,
                is_implicit: false,
            };
            break;

        case AppParamTypes.MULTIFILE_SELECTOR:
            newParam.defaultValue = [];
            newParam.required = false;
            newParam.omit_if_blank = false;
            newParam.file_parameters = {
                data_source: DataSources.FILE,
                file_info_type: FILE_INFO_TYPE_DEFAULT,
                format: FILE_PARAMETER_FORMAT_DEFAULT,
                is_implicit: false,
                repeat_option_flag: false,
            };
            break;

        default:
            newParam.defaultValue = "";
            newParam.required = false;
            newParam.omit_if_blank = false;
            break;
    }

    return newParam;
};

export { formatSubmission, getNewParam, initAppValues };
