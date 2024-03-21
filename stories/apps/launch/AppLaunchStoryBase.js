import React from "react";
import { mockAxios } from "../../axiosMock";

import AppLaunchWizard from "../../../src/components/apps/launch/AppLaunchWizard";

import {
    ANALYSIS_OUTPUT_DIR,
    STARTING_PATH,
    createSavedLaunch,
    submitAnalysis,
} from "./constants";

import { appDetails, appDocumentation, savedLaunches } from "../AppMocks";

import { initMockAxiosFileFolderSelector } from "../../data/DataMocks";

const AppLaunchStoryBase = (props) => {
    initMockAxiosFileFolderSelector();
    const { app } = props;
    mockAxios
        .onGet(`/api/apps/${app?.system_id}/${app?.id}/details`)
        .reply(200, appDetails);
    mockAxios
        .onGet(
            `/api/apps/${app?.system_id}/${app?.id}/versions/${app?.version_id}/details`
        )
        .reply(200, appDetails);

    mockAxios
        .onGet(`/api/apps/${app?.system_id}/${app?.id}/documentation`)
        .reply(200, appDocumentation);
    mockAxios
        .onGet(
            `/api/apps/${app?.system_id}/${app?.id}/versions/${app?.version_id}/documentation`
        )
        .reply(200, appDocumentation);

    mockAxios
        .onGet(`/api/quicklaunches/apps/${app?.system_id}`)
        .reply(200, savedLaunches);

    return (
        <AppLaunchWizard
            notify={false}
            defaultOutputDir={ANALYSIS_OUTPUT_DIR}
            startingPath={STARTING_PATH}
            createSavedLaunch={createSavedLaunch}
            submitAnalysis={submitAnalysis}
            {...props}
        />
    );
};

export default AppLaunchStoryBase;
