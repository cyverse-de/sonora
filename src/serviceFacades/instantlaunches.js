import micromatch from "micromatch";

import callApi from "common/callApi";

import { getAppInfo, getSavedLaunch } from "serviceFacades/savedLaunches";
import { submitAnalysis, getAnalysis } from "serviceFacades/analyses";

import launchConstants from "components/models/AppParamTypes";

export const DEFAULTS_MAPPING_QUERY_KEY = "fetchDefaultsMappings";
export const ALL_INSTANT_LAUNCHES_KEY = "allInstantLaunches";
export const DASHBOARD_INSTANT_LAUNCHES_KEY = "dashboardInstantLaunches";
export const LIST_PUBLIC_SAVED_LAUNCHES_KEY = "listPublicSavedLaunches";

export const getDefaultsMapping = () =>
    callApi({
        endpoint: `/api/instantlaunches/mappings/defaults/latest`,
        method: "GET",
    });

export const updateDefaultsMapping = (newMapping) =>
    callApi({
        endpoint: "/api/admin/instantlaunches/mappings/defaults/latest",
        method: "POST",
        body: newMapping,
    });

export const createDefaultsMapping = (newMapping) =>
    callApi({
        endpoint: "/api/admin/instantlaunches/mappings/defaults/latest",
        method: "PUT",
        body: newMapping,
    });

export const addInstantLaunch = (id) => {
    const bodyObj = {
        quick_launch_id: id,
    };

    return callApi({
        endpoint: `/api/admin/instantlaunches`,
        method: "PUT",
        body: bodyObj,
    });
};

export const listInstantLaunches = (id) =>
    callApi({
        endpoint: `/api/instantlaunches`,
        method: "GET",
    });

export const deleteInstantLaunch = (id) =>
    callApi({
        endpoint: `/api/admin/instantlaunches/${id}`,
        method: "DELETE",
    });

export const listFullInstantLaunches = (id) =>
    callApi({
        endpoint: `/api/instantlaunches/full`,
        method: "GET",
    });

export const getInstantLaunchMetadata = (id) =>
    callApi({
        endpoint: `/api/admin/instantlaunches/${id}/metadata`,
        method: "GET",
    });

/**
 * Add or modify the AVUs associated with an instant launch.
 *
 * @param {string} id - The UUID fo the instant launch.
 * @param {Object} metadata - Contains the metadata for the instant launch.
 * @param {Object[]} metadata.avus - The list of AVUS. Each AVU should have an attr, value, and unit property.
 */
export const upsertInstantLaunchMetadata = (id, metadata) => {
    const bodyObj = {
        avus: [metadata],
    };
    return callApi({
        endpoint: `/api/admin/instantlaunches/${id}/metadata`,
        method: "POST",
        body: bodyObj,
    });
};

export const resetInstantLaunchMetadata = (id, avuList) => {
    const bodyObj = {
        avus: avuList,
    };
    return callApi({
        endpoint: `/api/admin/instantlaunches/${id}/metadata`,
        method: "PUT",
        body: bodyObj,
    });
};

export const listInstantLaunchesByMetadata = (queryKey, queryValue) =>
    callApi({
        endpoint: `/api/admin/instantlaunches/metadata/full`,
        method: "GET",
        params: { attribute: queryKey, value: queryValue, unit: "" },
    });

export const getPublicSavedLaunches = () =>
    callApi({
        endpoint: "/api/instantlaunches/quicklaunches/public",
        method: "GET",
    });

const inputParamTypes = [
    launchConstants.FILE_INPUT,
    launchConstants.FOLDER_INPUT,
    launchConstants.MULTIFILE_SELECTOR,
];

/**
 * Determine whether an instant launch can be included in the dashboard. Basically
 * means that the default saved launch for it can't include any unset required inputs.
 *
 * @param {Object} instantlaunch - An instant launch, as returned by the full instant launches listing.
 * @param {String} instantlaunch.quick_launch_id - The UUID for the default saved launch.
 * @returns {Boolean} - True if can be included, false otherwise.
 */
export const validateForDashboard = async ({ quick_launch_id, submission }) => {
    return await getAppInfo(null, { launchId: quick_launch_id }).then((app) => {
        // Get all of the input parameters in the app that are required.
        const requiredAppInputs = app.groups
            .map((group) => group.parameters || [])
            .flat()
            .filter(
                (param) =>
                    inputParamTypes.includes(param.type) && param.required
            );

        // Get listing of the input parameters from the app info that
        // aren't set in the QL submission
        const unsetInputParams = requiredAppInputs.filter((appParam) => {
            return (
                !submission.config.hasOwnProperty(appParam.id) ||
                (Array.isArray(submission.config[appParam.id]) &&
                    submission.config[appParam.id].length === 0)
            );
        });

        // Only allow the instant launch in the dashboard if it has no required
        // inputs unset.
        return unsetInputParams.length === 0;
    });
};

/**
 * Adds the instant launch to the list of instant launches
 * in the dashboard if it isn't already there.
 *
 * @param {Object} il - An instant launch object.
 * @param {string} il.id - The UUID for the instant launch object.
 */
export const addToDashboardHandler = async (il, t) =>
    await validateForDashboard(il)
        .then((isValid) => {
            if (!isValid) {
                throw new Error(t("cannotAddILToDashboard"));
            }
        })
        .then(() =>
            upsertInstantLaunchMetadata(il.id, {
                attr: "ui_location",
                value: "dashboard",
                unit: "",
            })
        );

/**
 * Removes an instant launch from the dashboard.
 *
 * @param {string} id - The UUID of the instant launch that should be removed from the dashboard.
 */
export const removeFromDashboardHandler = async (id) => {
    const ilMeta = await getInstantLaunchMetadata(id);

    if (!ilMeta.avus) {
        throw new Error("no avus in response");
    }

    const dashCount = ilMeta.avus.filter(
        ({ attr, value }) => attr === "ui_location" && value === "dashboard"
    ).length;

    if (dashCount > 0) {
        const filtered = ilMeta.avus.filter(
            ({ attr, value }) => attr !== "ui_location" && value !== "dashboard"
        );
        return await resetInstantLaunchMetadata(id, filtered);
    }

    return new Promise((resolve, reject) => resolve(ilMeta));
};

/**
 * Deletes an instant launch.
 * @param {*} id - The UUID of the instant launch to be deleted.
 */
export const deleteInstantLaunchHandler = async (id) => {
    return await removeFromDashboardHandler(id).then((_) =>
        deleteInstantLaunch(id)
    );
};

/**
 * Event handler for the button that performs the instant launch.
 *
 * @param {Object} instantLaunch - The instant launch object returned by defaultInstantLaunch().
 * @param {Object} resource - An array of resources to use as inputs to the instantly launched app.
 */
export const instantlyLaunch = async ({
    instantLaunch,
    resource,
    output_dir,
}) => {
    let savedLaunchId; // The saved launch ID, used to get app information.
    let savedLaunchPromise; // The promise used to get saved launch information.

    // The format of the instantLaunch object passed in by the data window is a bit different
    // than the format passed in by the dashboard, so a bit of normalization needs to take
    // place.
    if (instantLaunch.hasOwnProperty("default")) {
        // The data window logic.
        // The saved launch ID is buried in the "default" map of the object passed in
        // from the data window.
        savedLaunchId = instantLaunch.default["quick_launch_id"];

        // We'll need to get the saved launch info from the API since it contains the
        // submission, which isn't provided from the data window.
        savedLaunchPromise = getSavedLaunch(savedLaunchId).catch((e) =>
            console.log(e)
        );
    } else {
        // The dashboard logic.
        // The saved launch ID is a top-level property of the object passed in.
        savedLaunchId = instantLaunch.quick_launch_id;

        // Wrap the instant launch object in a promise so we don't have to branch logic
        // farther down.
        savedLaunchPromise = new Promise((resolve, reject) => {
            resolve(instantLaunch);
        });
    }

    // Contains the Promises that resolve to the data needed to perform a job submission.
    const promiseList = [
        savedLaunchPromise,
        getAppInfo(null, { launchId: savedLaunchId }).catch((e) =>
            console.log(e)
        ),
    ];

    return await Promise.all(promiseList)
        .then((values) => {
            const [ql, app] = values;
            const submission = ql.submission;

            const appInputs = app.groups
                .map((group) => group.parameters || [])
                .flat()
                .filter((param) => inputParamTypes.includes(param.type));

            // Get listing of the input parameters from the app info that
            // aren't set in the QL submission
            const unsetInputParams = appInputs.filter((appParam) => {
                return (
                    !submission.config.hasOwnProperty(appParam.id) ||
                    (Array.isArray(submission.config[appParam.id]) &&
                        submission.config[appParam.id].length === 0)
                );
            });

            // For each unset input parameter, match it up with an appropriate
            // resource that was passed in to the function. File resources should
            // go with FileInput params or MultiFileSelectors, while folder resources
            // should go with FolderInput params.
            if (resource && unsetInputParams.length > 0) {
                for (const unsetParam of unsetInputParams) {
                    if (resource.type === "file") {
                        if (unsetParam.type === launchConstants.FILE_INPUT) {
                            submission.config[unsetParam.id] = resource.path;
                            break;
                        }

                        if (
                            unsetParam.type ===
                            launchConstants.MULTIFILE_SELECTOR
                        ) {
                            submission.config[unsetParam.id] = [resource.path];
                            break;
                        }
                    }

                    if (resource.type === "folder") {
                        if (unsetParam.type === launchConstants.FOLDER_INPUT) {
                            submission.config[unsetParam.id] = resource.path;
                            break;
                        }
                    }
                }
            }

            return submission;
        })
        .then((submission) => {
            submission.output_dir = output_dir;
            return submission;
        })
        .then((submission) => submitAnalysis(submission)) // submit the analysis
        .then((analysisResp) => getAnalysis(analysisResp.id));
};

/**
 * Returns an Array tuple containing the instant launch object and the name of the
 * first pattern that the resource matched.
 *
 * @param {Object} defaults - The return value of serviceFacades/instantlaunches/getDefaultsMapping.
 * @param {Object} resource - Object representing a potential input. Needs at least label and infoType fields.
 */
export const defaultInstantLaunch = (defaults = {}, resource) => {
    const mappings = Object.entries(defaults);

    var instantLaunch;
    var patternName;

    for (const [matcherName, matcher] of mappings) {
        switch (matcher.kind) {
            case "glob":
                if (micromatch.isMatch(resource.label, matcher.pattern)) {
                    instantLaunch = matcher;
                    patternName = matcherName;
                }
                break;

            case "infoType":
                if (matcher.pattern === resource.infoType) {
                    instantLaunch = matcher;
                    patternName = matcherName;
                }
                break;

            default:
                break;
        }
    }

    return [instantLaunch, patternName];
};
