export const availableAddons = {
    addons: [
        {
            uuid: "0f1762a8-9230-4c56-a3b3-42f24c1ec511",
            name: "10,000 cpu",
            description: "10,000 compute units for one year.",
            default_amount: 10000,
            default_paid: true,
            resource_type: {
                uuid: "99e3bc7e-950a-11ec-84a4-406c8f3e9cbb",
                name: "cpu.hours",
                unit: "cpu hours",
            },
        },
        {
            uuid: "c21dd61f-aa41-40ad-8005-859679ceed9c",
            name: "1 TB",
            description: "1 TB of data storage for one year.",
            default_amount: 1099511627776,
            default_paid: true,
            resource_type: {
                uuid: "99e3f91e-950a-11ec-84a4-406c8f3e9cbb",
                name: "data.size",
                unit: "bytes",
            },
        },
    ],
};

export const emptyAddons = {
    addons: [],
};

export const resourceTypes = {
    result: [
        {
            id: "99e3bc7e-950a-11ec-84a4-406c8f3e9cbb",
            name: "cpu.hours",
            unit: "cpu hours",
        },
        {
            id: "99e3f91e-950a-11ec-84a4-406c8f3e9cbb",
            name: "data.size",
            unit: "bytes",
        },
    ],
};

export const selectedSubscriptionAddons = [
    {
        uuid: "91a1b448-6d8c-468d-8ef4-b202c9716805",
        addon: {
            uuid: "c21dd61f-aa41-40ad-8005-859679ceed9c",
            name: "1 TB",
            description: "1 TB of data storage for one year.",
            default_amount: 1099511627776,
            default_paid: true,
            resource_type: {
                uuid: "99e3f91e-950a-11ec-84a4-406c8f3e9cbb",
                name: "data.size",
                unit: "bytes",
            },
        },
        subscription: {
            paid: true,
            usages: [],
            uuid: "6126481a-bde6-11ed-bfee-62d47aced14b",
            plan: {
                uuid: "c6d39580-98dc-11ec-bbe3-406c8f3e9cbb",
                name: "Regular",
                description: "Regular plan",
                plan_quota_defaults: [],
            },
            quotas: [],
            effective_end_date: "2024-03-08T19:21:08.836180Z",
            effective_start_date: "2023-03-08T19:21:08.836180Z",
            user: {
                uuid: "b93a40d4-80c3-11ed-afc3-62d47aced14b",
                username: "sboleyn",
            },
        },
        amount: 1099511627776,
        paid: true,
    },
];

export const subscriptionID = "6126481a-bde6-11ed-bfee-62d47aced14b";
