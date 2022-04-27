import React from "react";
import CPUConsumption from "components/dashboard/dashboardItem/CPUConsumption";

export default {
    title: "Dashboard/CPUConsumption",
};

const CPUConsumptionTemplate = (args) => {
    return <CPUConsumption {...args} />;
};

export const NoPlan = CPUConsumptionTemplate.bind({});
NoPlan.args = {
    data: {
        id: "3ca5f6a3-722f-4135-8ee0-ee20b75bbb40",
        user_id: "626717be-575e-11ea-8038-008cfa5ae621",
        username: "sonora_test@iplantcollaborative.org",
        total: "16.4269529152434",
        effective_start: "2022-02-03T00:34:41.88739Z",
        effective_end: "2023-02-03T00:34:41.88739Z",
        last_modified: "2022-02-03T02:38:17.906799Z",
    },
};

export const EmptyPlan = CPUConsumptionTemplate.bind({});
EmptyPlan.args = {
    data: {
        id: "3ca5f6a3-722f-4135-8ee0-ee20b75bbb40",
        user_id: "626717be-575e-11ea-8038-008cfa5ae621",
        username: "sonora_test@iplantcollaborative.org",
        total: "16.4269529152434",
        effective_start: "2022-02-03T00:34:41.88739Z",
        effective_end: "2023-02-03T00:34:41.88739Z",
        last_modified: "2022-02-03T02:38:17.906799Z",
    },
    userPlan: {},
};

export const NoQuotas = CPUConsumptionTemplate.bind({});
NoQuotas.args = {
    data: {
        id: "3ca5f6a3-722f-4135-8ee0-ee20b75bbb40",
        user_id: "626717be-575e-11ea-8038-008cfa5ae621",
        username: "sonora_test@iplantcollaborative.org",
        total: "16.4269529152434",
        effective_start: "2022-02-03T00:34:41.88739Z",
        effective_end: "2023-02-03T00:34:41.88739Z",
        last_modified: "2022-02-03T02:38:17.906799Z",
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

export const EmptyQuotas = CPUConsumptionTemplate.bind({});
EmptyQuotas.args = {
    data: {
        id: "3ca5f6a3-722f-4135-8ee0-ee20b75bbb40",
        user_id: "626717be-575e-11ea-8038-008cfa5ae621",
        username: "sonora_test@iplantcollaborative.org",
        total: "16.4269529152434",
        effective_start: "2022-02-03T00:34:41.88739Z",
        effective_end: "2023-02-03T00:34:41.88739Z",
        last_modified: "2022-02-03T02:38:17.906799Z",
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

export const SpecifiedQuotas = CPUConsumptionTemplate.bind({});
SpecifiedQuotas.args = {
    data: {
        id: "3ca5f6a3-722f-4135-8ee0-ee20b75bbb40",
        user_id: "626717be-575e-11ea-8038-008cfa5ae621",
        username: "sonora_test@iplantcollaborative.org",
        total: "16.4269529152434",
        effective_start: "2022-02-03T00:34:41.88739Z",
        effective_end: "2023-02-03T00:34:41.88739Z",
        last_modified: "2022-02-03T02:38:17.906799Z",
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

export const QuotaExceeded = CPUConsumptionTemplate.bind({});
QuotaExceeded.args = {
    data: {
        id: "3ca5f6a3-722f-4135-8ee0-ee20b75bbb40",
        user_id: "626717be-575e-11ea-8038-008cfa5ae621",
        username: "sonora_test@iplantcollaborative.org",
        total: "2168.4269529152434",
        effective_start: "2022-02-03T00:34:41.88739Z",
        effective_end: "2023-02-03T00:34:41.88739Z",
        last_modified: "2022-02-03T02:38:17.906799Z",
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
