import React from "react";

import Dashboard from "../../src/components/dashboard";

import { mockAxios } from "../axiosMock";

import { appDetails, listingById } from "./appDetails";
import testData from "./data";

export default {
    title: "Dashboard",
};

export const DashboardTest = () => {
    const favoriteUriRegexp = /\/api\/apps\/[^/]+\/[^/]+\/favorite/;
    mockAxios
        .onGet(/\/api\/apps\/[^/]+\/[^/]+\/details/)
        .reply(200, appDetails);
    mockAxios
        .onGet(/\/api\/apps\/[^/]+\/[^/]+\/listing/)
        .reply(200, listingById);
    mockAxios.onGet("/api/dashboard?limit=8").reply(200, testData);
    mockAxios.onPut(favoriteUriRegexp).reply(200);
    mockAxios.onDelete(favoriteUriRegexp).reply(200);

    return <Dashboard />;
};
