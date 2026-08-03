/**
 * Formatting and init functions for App Launch forms and submissions.
 *
 * @author psarando
 */
import AppParamTypes from "components/models/AppParamTypes";
import { formatDuration as formatDurationStr } from "date-fns";

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
 * @param {boolean} appDescription.notifyPeriodic
 * @param {integer} appDescription.periodicPeriod
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
        notifyPeriodic,
        periodicPeriod,
        defaultSelectedMaxCpus,
        defaultMaxCpuCores = defaultSelectedMaxCpus,
        defaultOutputDir,
        app: {
            id,
            version_id,
            system_id,
            name,
            requirements,
            groups,
            mount_data_store,
            time_limit_seconds,
        },
    }
) => {
    // If no default_max_cpu_cores is returned from the API,
    // then use the default from configs (if it's less than the actual max)
    // so the max is not automatically submitted by the services.
    const reqInitValues = requirements?.map(
        ({
            step_number,
            max_cpu_cores,
            default_max_cpu_cores = max_cpu_cores < defaultMaxCpuCores
                ? max_cpu_cores
                : defaultMaxCpuCores,
            default_cpu_cores = 0,
            default_memory = 0,
            default_disk_space = 0,
            default_gpus = 0,
            gpu_models,
            default_gpu_models = gpu_models || [],
        }) => ({
            step_number,
            max_cpu_cores: default_max_cpu_cores,
            min_cpu_cores: default_cpu_cores,
            min_memory_limit: default_memory,
            min_disk_space: default_disk_space,
            max_gpus: default_gpus,
            gpu_models: default_gpu_models,
        })
    );

    return {
        // The launchSteps array is only required for preserving touched state
        // after any onSubmit errors:
        // https://github.com/formium/formik/issues/445#issuecomment-366952762
        launchSteps: [null, null, null, null],
        debug: false,
        notify,
        notifyPeriodic,
        periodicPeriod,
        output_dir: defaultOutputDir,
        name: formatAnalysisName(t, name),
        description: "",
        app_id: id,
        app_version_id: version_id,
        system_id,
        mount_data_store: mount_data_store ?? true,
        initialTimeLimitSeconds: time_limit_seconds || "",
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
                    (defaultValue &&
                        paramArgs.find((arg) => defaultValue.id === arg.id)) ||
                    // param arg IDs can change between jobs
                    (defaultValue &&
                        paramArgs.find(
                            (arg) => defaultValue.value === arg.value
                        )) ||
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
 * @param {boolean} formValues.notifyPeriodic
 * @param {integer} formValues.periodicPeriod
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
        notifyPeriodic,
        periodicPeriod,
        debug,
        name,
        description,
        output_dir,
        system_id,
        app_id,
        app_version_id,
        mount_data_store,
        initialTimeLimitSeconds,
        requirements,
        groups,
    }
) => {
    const formattedRequirements = requirements.map((req) => ({
        ...req,
        min_cpu_cores: req.max_cpu_cores,
        min_gpus: req.max_gpus,
        gpu_models: req.gpu_models || [],
    }));

    return {
        notify,
        notify_periodic: notifyPeriodic,
        periodic_period: periodicPeriod,
        debug,
        create_output_subdir: output_dir === defaultOutputDir,
        name: name.trim(),
        description,
        output_dir,
        system_id,
        app_id,
        app_version_id,
        mount_data_store,
        ...(initialTimeLimitSeconds && {
            time_limit_seconds: initialTimeLimitSeconds,
        }),
        requirements: formattedRequirements,
        config: groups?.reduce(paramConfigsReducer, {}),
    };
};

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

const SECONDS_PER_MINUTE = 60;
const SECONDS_PER_HOUR = 60 * SECONDS_PER_MINUTE;
const SECONDS_PER_DAY = 24 * SECONDS_PER_HOUR;

// Candidate initial duration limits in seconds, from shortest to longest.
// buildDurationLimitList filters these to values that fit within the app's
// max time limit and appends the exact max if it is not already present.
const DURATION_LIMIT_LADDER = [
    1 * SECONDS_PER_HOUR,
    2 * SECONDS_PER_HOUR,
    4 * SECONDS_PER_HOUR,
    8 * SECONDS_PER_HOUR,
    12 * SECONDS_PER_HOUR,
    1 * SECONDS_PER_DAY,
    2 * SECONDS_PER_DAY,
    3 * SECONDS_PER_DAY,
    4 * SECONDS_PER_DAY,
    7 * SECONDS_PER_DAY,
    14 * SECONDS_PER_DAY,
    30 * SECONDS_PER_DAY,
    60 * SECONDS_PER_DAY,
    90 * SECONDS_PER_DAY,
    180 * SECONDS_PER_DAY,
    365 * SECONDS_PER_DAY,
];

/**
 * Builds the list of initial duration options (in seconds) for an analysis,
 * based on the app's max time limit.
 *
 * Returns the ladder of candidate durations that fit within the max time
 * limit, with the exact max time limit appended if it is not already included.
 *
 * @param {number} maxSeconds - The app's max time limit in seconds.
 * @returns {number[]} - Initial duration options in seconds.
 */
const buildDurationLimitList = (maxSeconds) => {
    const limits = DURATION_LIMIT_LADDER.filter((value) => value <= maxSeconds);
    const last = limits[limits.length - 1];
    if (limits.length === 0 || last < maxSeconds) {
        limits.push(maxSeconds);
    }
    return limits;
};

/**
 * Formats a duration given in seconds as a human-readable string.
 *
 * @param {number} seconds - The duration in seconds.
 * @returns {string} - The formatted duration (e.g. "12 hours", "3 days").
 */
const formatDuration = (seconds) => {
    if (!seconds) {
        return "";
    }
    const days = Math.floor(seconds / SECONDS_PER_DAY);
    seconds %= SECONDS_PER_DAY;
    const hours = Math.floor(seconds / SECONDS_PER_HOUR);
    seconds %= SECONDS_PER_HOUR;
    const minutes = Math.floor(seconds / SECONDS_PER_MINUTE);
    return formatDurationStr({ days, hours, minutes });
};

export {
    buildDurationLimitList,
    formatDuration,
    formatSubmission,
    initAppLaunchValues,
    initGroupValues,
};
