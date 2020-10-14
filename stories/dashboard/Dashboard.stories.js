import React from "react";

import Dashboard from "../../src/components/Dashboard";

import { mockAxios } from "../axiosMock";

import testData from "./data";

export default {
    title: "Dashboard",
};

export const DashboardTest = () => {
    const favoriteUriRegexp = /\/api\/apps\/[^/]+\/[^/]+\/favorite/;
    mockAxios.onGet("/api/dashboard?limit=8").reply(200, testData);
    mockAxios.onPut(favoriteUriRegexp).reply(200);
    mockAxios.onDelete(favoriteUriRegexp).reply(200);

    return <Dashboard />;
};
