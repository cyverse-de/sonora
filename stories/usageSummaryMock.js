import constants from "../src/constants";

export const usageSummaryResponse = {
    cpu_usage: {
        id: "daafc764-42bf-425d-83c6-dbdfed410e26",
        user_id: "2ec78d4e-0dc3-11e8-a42f-008cfa5ae621",
        username: "ipcdev@iplantcollaborative.org",
        total: "1919.5484124900004782",
        effective_start: "2022-03-01T08:38:11.717336Z",
        effective_end: "2023-03-01T08:38:11.717336Z",
        last_modified: "2022-08-16T15:29:50.757566Z",
    },
    data_usage: {
        id: "580cbce3-c94f-4f7e-90de-f073d9088b89",
        user_id: "2ec78d4e-0dc3-11e8-a42f-008cfa5ae621",
        username: "ipcdev@iplantcollaborative.org",
        total: 12612182209,
        time: "2022-08-16T15:33:38.352429-07:00",
        last_modified: "2022-08-16T15:33:38.348854-07:00",
    },
    subscription: {
        id: "3ae507e4-07d5-11ed-b0ae-008cfa5ae621",
        effective_start_date: "2022-07-19T19:39:51.58586-07:00",
        effective_end_date: "2023-07-19T19:39:51.58586-07:00",
        plan: {
            id: "cdf7ac7a-98dc-11ec-bbe3-406c8f3e9cbb",
            name: "Pro",
            description: "Professional plan",
        },
        quotas: [
            {
                id: "3ae561c6-07d5-11ed-b0ae-008cfa5ae621",
                quota: 2000,
                resource_type: {
                    id: "99e3bc7e-950a-11ec-84a4-406c8f3e9cbb",
                    name: "cpu.hours",
                    description: "",
                },
            },
            {
                id: "3ae56e78-07d5-11ed-b0ae-008cfa5ae621",
                quota: 3298534883328,
                resource_type: {
                    id: "99e3f91e-950a-11ec-84a4-406c8f3e9cbb",
                    name: "data.size",
                    description: "",
                },
            },
        ],
        users: {
            id: "",
            username: "",
        },
    },
    errors: [],
};

export const usageSummaryComputeLimitExceededResponse = {
    ...usageSummaryResponse,
    cpu_usage: {
        ...usageSummaryResponse.cpu_usage,
        total: "2919.5484124900004782",
    },
};

export const usageSummaryStorageLimitExceededResponse = {
    ...usageSummaryResponse,
    data_usage: {
        ...usageSummaryResponse.data_usage,
        total: 1261218220900000,
    },
};

export const usageSummaryDiskUsage50percentResponse = {
    ...usageSummaryResponse,
    data_usage: { ...usageSummaryResponse.data_usage, total: 1649267441664 },
};

export const usageSummaryDiskUsage75percentResponse = {
    ...usageSummaryResponse,
    data_usage: { ...usageSummaryResponse.data_usage, total: 2473901162497 },
};

export const usageSummaryDiskUsage100percentResponse = {
    ...usageSummaryResponse,
    data_usage: { ...usageSummaryResponse.data_usage, total: 3298534883328 },
};

export const usageSummaryBasicSubscriptionResponse = {
    ...usageSummaryResponse,
    subscription: {
        ...usageSummaryResponse.subscription,
        plan: {
            ...usageSummaryResponse.subscription.plan,
            name: constants.PLAN_NAME_BASIC,
            description: "Basic plan",
        },
    },
};

export const usageSummaryBasicSubscriptionAddonsResponse = {
    ...usageSummaryBasicSubscriptionResponse,
    subscription: {
        ...usageSummaryBasicSubscriptionResponse.subscription,
        addons: [
            {
                addon: {
                    amount: 2000,
                    resource_type: {
                        name: constants.CPU_HOURS_RESOURCE_NAME,
                    },
                },
            },
            {
                addon: {
                    amount: 1099511627776,
                    resource_type: {
                        name: constants.DATA_STORAGE_RESOURCE_NAME,
                    },
                },
            },
        ],
    },
};
