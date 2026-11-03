import React from "react";
import GPUConsumption from "components/dashboard/dashboardItem/GPUConsumption";

export default {
    title: "Dashboard/GPUConsumption",
};

const GPUConsumptionTemplate = (args) => {
    return <GPUConsumption {...args} />;
};

export const NoPlan = GPUConsumptionTemplate.bind({});
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

export const EmptyPlan = GPUConsumptionTemplate.bind({});
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
    subscription: {},
};

export const NoQuotas = GPUConsumptionTemplate.bind({});
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
    subscription: {
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

export const EmptyQuotas = GPUConsumptionTemplate.bind({});
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
    subscription: {
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

export const SpecifiedQuotas = GPUConsumptionTemplate.bind({});
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
    subscription: {
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
                quota: 500,
                resource_type: {
                    id: "99e3bc7e-950a-11ec-84a4-406c8f3e9cbb",
                    name: "gpu.hours",
                    description: "",
                },
            },
        ],
    },
};

export const NoQuotasLowUsage = GPUConsumptionTemplate.bind({});
NoQuotasLowUsage.args = {
    data: {
        id: "3ca5f6a3-722f-4135-8ee0-ee20b75bbb40",
        user_id: "626717be-575e-11ea-8038-008cfa5ae621",
        username: "sonora_test@iplantcollaborative.org",
        total: "0.33",
        effective_start: "2022-02-03T00:34:41.88739Z",
        effective_end: "2023-02-03T00:34:41.88739Z",
        last_modified: "2022-02-03T02:38:17.906799Z",
    },
    subscription: {
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

export const SpecifiedQuotasMidUsage = GPUConsumptionTemplate.bind({});
SpecifiedQuotasMidUsage.args = {
    data: {
        id: "3ca5f6a3-722f-4135-8ee0-ee20b75bbb40",
        user_id: "626717be-575e-11ea-8038-008cfa5ae621",
        username: "sonora_test@iplantcollaborative.org",
        total: "100.123",
        effective_start: "2022-02-03T00:34:41.88739Z",
        effective_end: "2023-02-03T00:34:41.88739Z",
        last_modified: "2022-02-03T02:38:17.906799Z",
    },
    subscription: {
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
                quota: 500,
                resource_type: {
                    id: "99e3bc7e-950a-11ec-84a4-406c8f3e9cbb",
                    name: "gpu.hours",
                    description: "",
                },
            },
        ],
    },
};

export const QuotaExceeded = GPUConsumptionTemplate.bind({});
QuotaExceeded.args = {
    data: {
        id: "3ca5f6a3-722f-4135-8ee0-ee20b75bbb40",
        user_id: "626717be-575e-11ea-8038-008cfa5ae621",
        username: "sonora_test@iplantcollaborative.org",
        total: "542.4269529152434",
        effective_start: "2022-02-03T00:34:41.88739Z",
        effective_end: "2023-02-03T00:34:41.88739Z",
        last_modified: "2022-02-03T02:38:17.906799Z",
    },
    subscription: {
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
                quota: 500,
                resource_type: {
                    id: "99e3bc7e-950a-11ec-84a4-406c8f3e9cbb",
                    name: "gpu.hours",
                    description: "",
                },
            },
        ],
    },
};
