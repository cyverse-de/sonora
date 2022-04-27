import React from "react";
import DataConsumption from "components/dashboard/dashboardItem/DataConsumption";

export default {
    title: "Dashboard/DataConsumption",
};

const DataConsumptionTemplate = (args) => {
    return <DataConsumption {...args} />;
};

export const NoPlan = DataConsumptionTemplate.bind({});
NoPlan.args = {
    data: {
        id: "123456789",
        user_id: "sriram",
        username: "sriram@iplantcollaborative.org",
        total: 161061273600,
        time: "2021-11-19T16:39:57-07:00",
        last_modified: "2021-11-19T16:39:57-07:00",
    },
};

export const EmptyPlan = DataConsumptionTemplate.bind({});
EmptyPlan.args = {
    data: {
        id: "123456789",
        user_id: "sriram",
        username: "sriram@iplantcollaborative.org",
        total: 161061273600,
        time: "2021-11-19T16:39:57-07:00",
        last_modified: "2021-11-19T16:39:57-07:00",
    },
    userPlan: {},
};

export const NoQuotas = DataConsumptionTemplate.bind({});
NoQuotas.args = {
    data: {
        id: "123456789",
        user_id: "sriram",
        username: "sriram@iplantcollaborative.org",
        total: 161061273600,
        time: "2021-11-19T16:39:57-07:00",
        last_modified: "2021-11-19T16:39:57-07:00",
    },
    userPlan: {
        id: "4cbf9500-c5af-11ec-8513-008cfa5ae621",
        effective_start_date: "2022-04-26T15:22:03.921406-07:00",
        effective_end_date: "2023-04-26T15:22:03.921406-07:00",
        users: {
            id: "",
            username: "",
        },
        plan: {
            id: "cdf7ac7a-98dc-11ec-bbe3-406c8f3e9cbb",
            name: "Pro",
            description: "Professional plan",
        },
    },
};

export const EmptyQuotas = DataConsumptionTemplate.bind({});
EmptyQuotas.args = {
    data: {
        id: "123456789",
        user_id: "sriram",
        username: "sriram@iplantcollaborative.org",
        total: 161061273600,
        time: "2021-11-19T16:39:57-07:00",
        last_modified: "2021-11-19T16:39:57-07:00",
    },
    userPlan: {
        id: "4cbf9500-c5af-11ec-8513-008cfa5ae621",
        effective_start_date: "2022-04-26T15:22:03.921406-07:00",
        effective_end_date: "2023-04-26T15:22:03.921406-07:00",
        users: {
            id: "",
            username: "",
        },
        plan: {
            id: "cdf7ac7a-98dc-11ec-bbe3-406c8f3e9cbb",
            name: "Pro",
            description: "Professional plan",
        },
        quotas: [],
    },
};

export const SpecifiedQuotas = DataConsumptionTemplate.bind({});
SpecifiedQuotas.args = {
    data: {
        id: "123456789",
        user_id: "sriram",
        username: "sriram@iplantcollaborative.org",
        total: 161061273600,
        time: "2021-11-19T16:39:57-07:00",
        last_modified: "2021-11-19T16:39:57-07:00",
    },
    userPlan: {
        id: "4cbf9500-c5af-11ec-8513-008cfa5ae621",
        effective_start_date: "2022-04-26T15:22:03.921406-07:00",
        effective_end_date: "2023-04-26T15:22:03.921406-07:00",
        users: {
            id: "",
            username: "",
        },
        plan: {
            id: "cdf7ac7a-98dc-11ec-bbe3-406c8f3e9cbb",
            name: "Pro",
            description: "Professional plan",
        },
        quotas: [
            {
                id: "4cbfc2be-c5af-11ec-8513-008cfa5ae621",
                quota: 2000,
                resource_type: {
                    id: "99e3bc7e-950a-11ec-84a4-406c8f3e9cbb",
                    name: "cpu.hours",
                    description: "",
                },
            },
            {
                id: "4cbfc516-c5af-11ec-8513-008cfa5ae621",
                quota: 3000000000000,
                resource_type: {
                    id: "99e3f91e-950a-11ec-84a4-406c8f3e9cbb",
                    name: "data.size",
                    description: "",
                },
            },
        ],
    },
};
