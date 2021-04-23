import {
    upsertInstantLaunchMetadata,
    getInstantLaunchMetadata,
    resetInstantLaunchMetadata,
    deleteInstantLaunch,
} from "serviceFacades/instantlaunches";

import { getAppInfo, getQuickLaunch } from "serviceFacades/quickLaunches";
import { submitAnalysis, getAnalysis } from "serviceFacades/analyses";

import launchConstants from "components/models/AppParamTypes";

const inputParamTypes = [
    launchConstants.FILE_INPUT,
    launchConstants.FOLDER_INPUT,
    launchConstants.MULTIFILE_SELECTOR,
];

/**
 * Determine whether an instant launch can be included in the dashboard. Basically
 * means that the default quick launch for it can't include any unset required inputs.
 *
 * @param {Object} instantlaunch - An instant launch, as returned by the full instant launches listing.
 * @param {String} instantlaunch.quick_launch_id - The UUID for the default quick launch.
 * @returns {Boolean} - True if can be included, false otherwise.
 */
export const validateForDashboard = async ({ quick_launch_id, submission }) => {
    return await getAppInfo(null, { qId: quick_launch_id }).then((app) => {
        // Get all of the input parmeters in the app that are required.
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
export const instantlyLaunch = async (instantLaunch, resource) => {
    let qID; // The quick launch ID, used to get app information.
    let qlp; // The promise used to get quick launch information.

    // The format of the instantLaunch object passed in by the data window is a bit different
    // than the format passed in by the dashboard, so a bit of normalization needs to take
    // place.
    if (instantLaunch.hasOwnProperty("default")) {
        // The data window logic.
        // The quick launch ID is buried in the "default" map of the object passed in
        // from the data window.
        qID = instantLaunch.default["quick_launch_id"];

        // We'll need to get the quick launch info from the API since it contains the
        // submission, which isn't provided from the data window.
        qlp = getQuickLaunch(qID).catch((e) => console.log(e));
    } else {
        // The dashboard logic.
        // The quick launch ID is a top-level property of the object passed in.
        qID = instantLaunch.quick_launch_id;

        // Wrap the instant launch object in a promise so we don't have to branch logic
        // farther down.
        qlp = new Promise((resolve, reject) => {
            resolve(instantLaunch);
        });
    }

    // Contains the Promises that resolve to the data needed to perform a job submission.
    const promiseList = [
        qlp,
        getAppInfo(null, { qId: qID }).catch((e) => console.log(e)),
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
        .then((submission) => submitAnalysis(submission)) // submit the analysis
        .then((analysisResp) => getAnalysis(analysisResp.id));
};
