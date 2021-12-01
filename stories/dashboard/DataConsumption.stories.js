import React from "react";
import { mockAxios } from "../axiosMock";
import DataConsumption from "components/dashboard/dashboardItem/DataConsumption";

export default {
    title: "Dashboard/DataConsumption",
};

export const DataConsumptionTest = () => {
    mockAxios.onGet("/api/resource-usage/data/current").reply(200, {
        id: "123456789",
        user_id: "sriram",
        username: "sriram@iplantcollaborative.org",
        total: 161061273600,
        time: "2021-11-19T16:39:57-07:00",
        last_modified: "2021-11-19T16:39:57-07:00",
    });
    return <DataConsumption />;
};
