/**
 * Formatting and init functions for App Launch forms and submissions.
 *
 * @author psarando
 */
import AppParamTypes from "components/models/AppParamTypes";

/**
 * Initializes the submission and form values from the given props.
 *
 * Will initialize a `value` field in each app parameter,
 * populated by the parameter's `defaultValue` or an empty value.
 *
 * Will also initialize each step's resource requirements from any default
 * requirements provided.
 *
 * @param {Object} t i18n translation function
 * @param {Object} appDescription
 * @param {boolean} appDescription.notify
 * @param {string} appDescription.defaultOutputDir
 * @param {Object} appDescription.app
 * @param {string} appDescription.app.id
 * @param {string} appDescription.app.system_id
 * @param {string} appDescription.app.name
 * @param {Object[]} appDescription.app.requirements
 * @param {Object[]} appDescription.app.groups
 *
 * @returns Initial form and submission values.
 */
const initAppLaunchValues = (
    t,
    {
        notify,
        defaultOutputDir,
        app: { id, system_id, name, requirements, groups },
    }
) => {
    const reqInitValues = requirements?.map(
        ({
            step_number,
            default_cpu_cores = 0,
            default_memory = 0,
            default_disk_space = 0,
        }) => ({
            step_number,
            min_cpu_cores: default_cpu_cores,
            min_memory_limit: default_memory,
            min_disk_space: default_disk_space,
        })
    );

    return {
        // The launchSteps array is only required for preserving touched state
        // after any onSubmit errors:
        // https://github.com/formium/formik/issues/445#issuecomment-366952762
        launchSteps: [null, null, null, null],
        debug: false,
        notify,
        output_dir: defaultOutputDir,
        name: formatAnalysisName(t, name),
        description: "",
        app_id: id,
        system_id,
        groups: initGroupValues(groups),
        limits: requirements,
        requirements: reqInitValues || [],
    };
};

/**
 * @param {Object} t i18n translation function
 * @param {string} name - The app name.
 * @returns {string} - Formatted app name as a new analysis name,
 * replacing spaces with underscores `_`.
 */
const formatAnalysisName = (t, name) =>
    name ? t("newAnalysisName", { appName: name }).replace(/ /g, "_") : "";

/**
 * Initializes the submission and form values for the given App groups.
 *
 * Will initialize a `value` field in each app parameter,
 * populated by the parameter's `defaultValue` or an empty value.
 *
 * @param {Object[]} groups
 * @param {Object[]} groups.parameters
 * @param {Object} groups.parameters.param
 * @param {string} groups.parameters.param.type
 * @param {*} groups.parameters.param.defaultValue
 * @param {Object[]} groups.parameters.param.arguments
 *
 * @returns Initial form group values.
 */
const initGroupValues = (groups) =>
    groups?.map((group) => ({
        ...group,
        parameters: group.parameters?.map((param) => {
            const {
                arguments: paramArgs,
                defaultValue,
                type: paramType,
            } = param;

            let value = defaultValue || "";

            if (
                paramType === AppParamTypes.FILE_FOLDER_INPUT ||
                paramType === AppParamTypes.FILE_INPUT ||
                paramType === AppParamTypes.FOLDER_INPUT
            ) {
                value = defaultValue?.path || "";
            }

            if (paramType === AppParamTypes.MULTIFILE_SELECTOR) {
                // A relaunch defaultValue is a {path: [...paths]} object,
                // but the App Editor uses this function for the preview step,
                // and it sets this param's defaultValue to an empty array.
                value =
                    defaultValue?.path?.map((val) => {
                        return { path: val };
                    }) || [];
            }

            if (paramType === AppParamTypes.FLAG) {
                value = defaultValue && defaultValue !== "false";
            }

            if (paramArgs?.length > 0) {
                const defaultArg =
                    paramArgs.find((arg) => defaultValue?.id === arg.id) ||
                    paramArgs.find((arg) => arg.isDefault);

                value = defaultArg || "";
            }

            return {
                ...param,
                value,
            };
        }),
    }));

/**
 * Formats the analysis submission from props and the form values.
 *
 * @param {string} defaultOutputDir
 * @param {Object} formValues
 * @param {boolean} formValues.notify
 * @param {boolean} formValues.debug
 * @param {string} formValues.name
 * @param {string} formValues.description
 * @param {string} formValues.output_dir
 * @param {string} formValues.system_id
 * @param {string} formValues.app_id
 * @param {Object[]} formValues.requirements
 * @param {Object[]} formValues.groups
 *
 * @returns The formatted submission for launching or saving as a saved launch.
 */
const formatSubmission = (
    defaultOutputDir,
    {
        notify,
        debug,
        name,
        description,
        output_dir,
        system_id,
        app_id,
        requirements,
        groups,
    }
) => ({
    notify,
    debug,
    create_output_subdir: output_dir === defaultOutputDir,
    name: name.trim(),
    description,
    output_dir,
    system_id,
    app_id,
    requirements,
    config: groups?.reduce(paramConfigsReducer, {}),
});

/**
 * Appends the given group's parameter values to the given submission config.
 *
 * @param {Object} configs - Mapping of parameter IDs to parameter values.
 * @param {Object} group
 * @param {Object[]} group.parameters
 *
 * @returns The formatted submission config
 * including the given group's parameter IDs to values.
 */
const paramConfigsReducer = (configs, group) => {
    group.parameters.forEach((param) => {
        const { id, type } = param;

        if (type !== AppParamTypes.INFO) {
            let { value } = param;

            switch (type) {
                case AppParamTypes.TEXT_SELECTION:
                case AppParamTypes.INTEGER_SELECTION:
                case AppParamTypes.DOUBLE_SELECTION:
                case AppParamTypes.FILE_INPUT:
                case AppParamTypes.FOLDER_INPUT:
                case AppParamTypes.FILE_FOLDER_INPUT:
                case AppParamTypes.REFERENCE_GENOME:
                case AppParamTypes.REFERENCE_SEQUENCE:
                case AppParamTypes.REFERENCE_ANNOTATION:
                    if (!value) {
                        return;
                    }
                    break;

                case AppParamTypes.FILE_OUTPUT:
                case AppParamTypes.FOLDER_OUTPUT:
                case AppParamTypes.MULTIFILE_OUTPUT:
                    if (value) {
                        value = value.trim();
                    }
                    break;
                case AppParamTypes.MULTIFILE_SELECTOR:
                    if (value) {
                        value = value?.map((resource) => resource?.path);
                    }
                    break;
                default:
                    break;
            }

            configs[id] = value;
        }
    });

    return configs;
};

export { formatSubmission, initAppLaunchValues, initGroupValues };
