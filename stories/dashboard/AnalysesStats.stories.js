import React from "react";
import { mockAxios } from "../axiosMock";
import AnalysesStats from "components/dashboard/dashboardItem/AnalysesStats";

export default {
    title: "Dashboard/AnalysesStats",
};

export const AnalysesStatsTest = () => {
    mockAxios.onGet("/api/analyses/stats").reply(200, {
        "status-count": [
            {
                count: 32,
                status: "Canceled",
            },
            {
                count: 703,
                status: "Completed",
            },
            {
                count: 296,
                status: "Failed",
            },
            {
                count: 150,
                status: "Submitted",
            },
            {
                count: 100,
                status: "Running",
            },
        ],
    });
    return <AnalysesStats />;
};
