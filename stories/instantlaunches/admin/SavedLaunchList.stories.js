import React from "react";

import SavedLaunchList from "components/instantlaunches/admin/SavedLaunchList";

import { mockAxios } from "../../axiosMock";

import {
    testData,
    testGlobalQLs,
    testInstantLaunches,
} from "./SavedLaunchListData";

export default {
    title: "Instant Launches / admin / Saved Launch List",
};

export const SavedLaunchListTest = () => {
    mockAxios
        .onGet("/api/quicklaunches/defaults/global")
        .reply(200, testGlobalQLs);
    mockAxios
        .onGet("/api/instantlaunches/full")
        .reply(200, testInstantLaunches);
    mockAxios.onPost("/api/quicklaunches/defaults/global").reply(200, {});
    mockAxios
        .onGet("/api/instantlaunches/quicklaunches/public")
        .reply(200, testData);

    mockAxios.onPut("/api/instantlaunches").reply(200, {});

    return <SavedLaunchList />;
};
