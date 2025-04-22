import React from "react";
import AlertsEditor from "../src/components/alerts/admin/AlertsAdmin";
import { mockAxios } from "./axiosMock";

//import testConfig from "./configMock";

const emptyAlerts = { alerts: [] };
const nonEmptyAlerts = {
    alerts: [
        {
            end_date: "2024-01-01T00:00:00Z",
            alert: "This is an alert in the past.",
        },
        {
            end_date: "2100-01-01T00:00:00Z",
            alert: "This is a testing alert far in the future.",
        },
    ],
};

const alertsAdminTestTemplate = (args) => {
    const { mockAllAlerts } = args;
    //mockAxios.onGet("/api/...").reply(200, mockDataSpec)
    mockAxios.onGet("/api/alerts/all").reply(200, mockAllAlerts);
    return <AlertsEditor />;
};

export const NormalView = alertsAdminTestTemplate.bind({});
NormalView.args = {
    mockAllAlerts: emptyAlerts,
};

export const HasAlertsView = alertsAdminTestTemplate.bind({});
HasAlertsView.args = {
    mockAllAlerts: nonEmptyAlerts,
};

export default {
    title: "Alerts / Alerts Editor",
    component: AlertsEditor,
    parameters: {
        // This is the max delay allowed.
        chromatic: { delay: 15000 },
    },
};
