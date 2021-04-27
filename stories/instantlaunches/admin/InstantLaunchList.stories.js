import React from "react";

import InstantLaunchList from "components/instantlaunches/admin/InstantLaunchList";

import { mockAxios } from "../../axiosMock";

import {
    testGlobalQLs,
    testFullInstantLaunchList,
    testInstantLaunchesDashboard,
} from "./QuickLaunchListData";

export default {
    title: "Instant Launches / admin / Instant Launch List",
};

export const InstantLaunchListTest = () => {
    mockAxios
        .onGet("/api/quicklaunches/defaults/global")
        .reply(200, testGlobalQLs);
    mockAxios
        .onGet("/api/instantlaunches/full")
        .reply(200, testFullInstantLaunchList);
    mockAxios
        .onGet("/api/admin/instantlaunches/metadata/full", {
            params: { attribute: "ui_location", value: "dashboard", unit: "" },
        })
        .reply(200, testInstantLaunchesDashboard);

    return <InstantLaunchList />;
};
