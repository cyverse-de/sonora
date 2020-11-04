import React from "react";
import { mockAxios } from "../../axiosMock";

import AppLaunchWizard from "../../../src/components/apps/launch/AppLaunchWizard";

import {
    ANALYSIS_OUTPUT_DIR,
    STARTING_PATH,
    initMockAxiosFileFolderSelector,
    saveQuickLaunch,
    submitAnalysis,
} from "./constants";

import {
    appDetails,
    listingById,
    appDocumentation,
    quickLaunches,
} from "../AppMocks";

export default (props) => {
    initMockAxiosFileFolderSelector();
    const { app } = props;
    mockAxios
        .onGet(`/api/apps/${app?.system_id}/${app?.id}/details`)
        .reply(200, appDetails);

    mockAxios
        .onGet(`/api/apps/${app?.system_id}/${app?.id}/listing`)
        .reply(200, listingById);

    mockAxios
        .onGet(`/api/apps/${app?.system_id}/${app?.id}/documentation`)
        .reply(200, appDocumentation);

    mockAxios
        .onGet(`/api/quicklaunches/apps/${app?.system_id}`)
        .reply(200, quickLaunches);
    return (
        <AppLaunchWizard
            notify={false}
            defaultOutputDir={ANALYSIS_OUTPUT_DIR}
            startingPath={STARTING_PATH}
            saveQuickLaunch={saveQuickLaunch}
            submitAnalysis={submitAnalysis}
            {...props}
        />
    );
};
