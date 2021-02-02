import React from "react";

import micromatch from "micromatch";

import { IconButton } from "@material-ui/core";

import { Launch as LaunchIcon } from "@material-ui/icons";

import launchConstants from "components/apps/launch/constants";

import { getAppInfo, getQuickLaunch } from "serviceFacades/quickLaunches";
import { submitAnalysis } from "serviceFacades/analyses";

const inputParamTypes = [
    launchConstants.PARAM_TYPE.FILE_INPUT,
    launchConstants.PARAM_TYPE.FOLDER_INPUT,
];

/**
 * Returns an Array tuple containing the instant launch object and the name of the
 * first pattern that the resource matched.
 *
 * @param {Object} defaults - The return value of serviceFacads/instantlaunches/getDefaultsMapping.
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

/**
 * Event handler for the button that performs the instant launch.
 *
 * @param {Object} instantLaunch - The instant launch object returned by defaultInstantLaunch().
 * @param {Object} resource - An array of resources to use as inputs to the instantly launched app.
 */
const instantlyLaunch = async (instantLaunch, resource) => {
    const qID = instantLaunch.default["quick_launch_id"];
    const quickLaunch = getQuickLaunch(qID)
        .then((quickLaunch) => quickLaunch)
        .catch((e) => console.error(e));

    const appInfo = getAppInfo(null, {
        qId: qID,
    })
        .then((app) => app)
        .catch((e) => console.error(e));

    return await Promise.all([quickLaunch, appInfo])
        .then((values) => {
            const [ql, app] = values;
            const submission = ql.submission;
            const appParams = app.groups.find((g) => g.label === "Parameters")
                .parameters;
            const appInputs = appParams.filter((param) =>
                inputParamTypes.includes(param.type)
            );

            // Get listing of the input parameters from the app info that
            // aren't set in the QL submission
            const unsetInputParams = appInputs.filter(
                (appParam) => !submission.config.hasOwnProperty(appParam.id)
            );

            // For each unset input parameter, match it up with an appropriate
            // resource that was passed in to the function. File resources should
            // go with FileInput params or MultiFileSelectors, while folder resources
            // should go with FolderInput params.
            if (unsetInputParams.length > 0) {
                const unsetParam = unsetInputParams[0];

                if (
                    (resource.type === "file" &&
                        unsetParam.type ===
                            launchConstants.PARAM_TYPE.FILE_INPUT) ||
                    (resource.type === "folder" &&
                        unsetParam.type ===
                            launchConstants.PARAM_TYPE.FOLDER_INPUT)
                ) {
                    submission.config[unsetInputParams[0].id] = resource.path;
                } else if (
                    resource.type === "file" &&
                    unsetParam.type ===
                        launchConstants.PARAM_TYPE.MULTIFILE_SELECTOR
                ) {
                    submission.config[unsetInputParams[0].id] = [resource.path];
                }
            }

            return submission;
        })
        .then((submission) => submitAnalysis(submission)) // submit the analysis
        .catch((e) => console.error(e));
};

/**
 *
 * @param {Object} props
 * @param {Object} props.instantLaunch - The instant launch to use.
 * @param {Object} props.resource - The resource to use as an input to the instant launch.
 */
const InstantLaunchButton = ({ instantLaunch, resource }) => {
    return (
        <IconButton
            variant="contained"
            onClick={async () => {
                const submission = await instantlyLaunch(instantLaunch, [
                    resource,
                ]);
                console.log(JSON.stringify(submission, null, 2));
            }}
        >
            <LaunchIcon />
        </IconButton>
    );
};

export default InstantLaunchButton;
