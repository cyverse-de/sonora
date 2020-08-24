import React from "react";

import Dashboard from "../../src/components/Dashboard";

import { mockAxios } from "../axiosMock";

import testData from "./data";

export default {
    title: "Dashboard",
};

export const DashboardTest = () => {
    mockAxios.onGet("/api/dashboard?limit=8").reply(200, testData);

    return <Dashboard />;
};
