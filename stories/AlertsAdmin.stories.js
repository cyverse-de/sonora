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
    mockAxios.onPost("/api/admin/alerts").reply((config) => {
        const {
            "alert-text": alert,
            "start-date": start_date,
            "end-date": end_date,
        } = JSON.parse(config.data);
        mockAllAlerts.alerts.push({ alert, start_date, end_date });
        return [201, {}];
    });
    mockAxios.onDelete("/api/admin/alerts").reply((config) => {
        const d = JSON.parse(config.data);
        const deleteIndex = mockAllAlerts.alerts.findIndex(
            (alert) =>
                alert.alert === d["alert-text"] &&
                alert.end_date === d["end-date"]
        );
        if (deleteIndex !== -1) {
            mockAllAlerts.alerts.splice(deleteIndex, 1);
        }
        return deleteIndex !== -1 ? [200, {}] : [500, {}];
    });
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
