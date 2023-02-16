export const emptyListing = {
    result: {
        subscriptions: [],
        total: 0,
    },
};

export const erroredListing = {
    error_code: "ERR_SOMETHING_BAD_HAPPENED",
    reason: "something bad happened",
};

export const invalidSortField = {
    error_code: "ERR_INVALID_QUERY_PARAM",
    reason: "invalid sort field",
};

export const listing = {
    result: {
        subscriptions: [
            {
                id: "c5b2dc54-a34b-11ed-a78d-62d47aced14b",
                effective_start_date: "2023-02-02T15:48:55.304072-07:00",
                effective_end_date: "2024-02-02T15:48:55.304072-07:00",
                user: {
                    id: "0d1c4cc4-467c-11ed-9aa7-62d47aced14b",
                    username: "00powellemmag",
                },
                plan: {
                    id: "99e47c22-950a-11ec-84a4-406c8f3e9cbb",
                    name: "Basic",
                    description: "Basic plan",
                    plan_quota_defaults: [
                        {
                            id: "46febbba-9511-11ec-8844-406c8f3e9cbb",
                            quota_value: 20,
                            resource_type: {
                                id: "99e3bc7e-950a-11ec-84a4-406c8f3e9cbb",
                                name: "cpu.hours",
                                unit: "cpu hours",
                            },
                        },
                        {
                            id: "60b3d5ae-9511-11ec-8844-406c8f3e9cbb",
                            quota_value: 5368709120,
                            resource_type: {
                                id: "99e3f91e-950a-11ec-84a4-406c8f3e9cbb",
                                name: "data.size",
                                unit: "bytes",
                            },
                        },
                    ],
                },
                quotas: [
                    {
                        id: "c5b4d87e-a34b-11ed-a78d-62d47aced14b",
                        quota: 53687,
                        resource_type: {
                            id: "99e3f91e-950a-11ec-84a4-406c8f3e9cbb",
                            name: "data.size",
                            unit: "bytes",
                        },
                        last_modified_at: "2023-02-02T15:49:16.811069-07:00",
                    },
                    {
                        id: "c5b377a4-a34b-11ed-a78d-62d47aced14b",
                        quota: 25,
                        resource_type: {
                            id: "99e3bc7e-950a-11ec-84a4-406c8f3e9cbb",
                            name: "cpu.hours",
                            unit: "cpu hours",
                        },
                        last_modified_at: "2023-02-02T15:49:17.048279-07:00",
                    },
                ],
                usages: [],
            },
            {
                id: "0d290446-467c-11ed-9aa7-62d47aced14b",
                effective_start_date: "2022-10-07T13:10:12.901725-07:00",
                effective_end_date: "2023-10-07T13:10:12.901725-07:00",
                user: {
                    id: "0d256e30-467c-11ed-9aa7-62d47aced14b",
                    username: "013633241",
                },
                plan: {
                    id: "99e47c22-950a-11ec-84a4-406c8f3e9cbb",
                    name: "Basic",
                    description: "Basic plan",
                    plan_quota_defaults: [
                        {
                            id: "46febbba-9511-11ec-8844-406c8f3e9cbb",
                            quota_value: 20,
                            resource_type: {
                                id: "99e3bc7e-950a-11ec-84a4-406c8f3e9cbb",
                                name: "cpu.hours",
                                unit: "cpu hours",
                            },
                        },
                        {
                            id: "60b3d5ae-9511-11ec-8844-406c8f3e9cbb",
                            quota_value: 5368709120,
                            resource_type: {
                                id: "99e3f91e-950a-11ec-84a4-406c8f3e9cbb",
                                name: "data.size",
                                unit: "bytes",
                            },
                        },
                    ],
                },
                quotas: [
                    {
                        id: "0d2977f0-467c-11ed-9aa7-62d47aced14b",
                        quota: 25,
                        resource_type: {
                            id: "99e3bc7e-950a-11ec-84a4-406c8f3e9cbb",
                            name: "cpu.hours",
                            unit: "cpu hours",
                        },
                        last_modified_at: "2023-02-01T18:16:13.525944-07:00",
                    },
                    {
                        id: "0d297d40-467c-11ed-9aa7-62d47aced14b",
                        quota: 50,
                        resource_type: {
                            id: "99e3f91e-950a-11ec-84a4-406c8f3e9cbb",
                            name: "data.size",
                            unit: "bytes",
                        },
                        last_modified_at: "2023-02-01T18:16:13.501916-07:00",
                    },
                ],
                usages: [],
            },
            {
                id: "fb615400-9e98-11ed-9ae1-62d47aced14b",
                effective_start_date: "2023-01-27T16:19:00.800882-07:00",
                effective_end_date: "2024-01-27T16:19:00.800882-07:00",
                user: {
                    id: "0d2d0316-467c-11ed-9aa7-62d47aced14b",
                    username: "017324435",
                },
                plan: {
                    id: "99e47c22-950a-11ec-84a4-406c8f3e9cbb",
                    name: "Basic",
                    description: "Basic plan",
                    plan_quota_defaults: [
                        {
                            id: "46febbba-9511-11ec-8844-406c8f3e9cbb",
                            quota_value: 20,
                            resource_type: {
                                id: "99e3bc7e-950a-11ec-84a4-406c8f3e9cbb",
                                name: "cpu.hours",
                                unit: "cpu hours",
                            },
                        },
                        {
                            id: "60b3d5ae-9511-11ec-8844-406c8f3e9cbb",
                            quota_value: 5368709120,
                            resource_type: {
                                id: "99e3f91e-950a-11ec-84a4-406c8f3e9cbb",
                                name: "data.size",
                                unit: "bytes",
                            },
                        },
                    ],
                },
                quotas: [
                    {
                        id: "fb672592-9e98-11ed-9ae1-62d47aced14b",
                        quota: 25,
                        resource_type: {
                            id: "99e3f91e-950a-11ec-84a4-406c8f3e9cbb",
                            name: "data.size",
                            unit: "bytes",
                        },
                        last_modified_at: "2023-02-01T19:00:40.14811-07:00",
                    },
                    {
                        id: "fb649174-9e98-11ed-9ae1-62d47aced14b",
                        quota: 15,
                        resource_type: {
                            id: "99e3bc7e-950a-11ec-84a4-406c8f3e9cbb",
                            name: "cpu.hours",
                            unit: "cpu hours",
                        },
                        last_modified_at: "2023-02-01T19:00:39.938104-07:00",
                    },
                ],
                usages: [],
            },
            {
                id: "0d37fc12-467c-11ed-9aa7-62d47aced14b",
                effective_start_date: "2022-10-07T13:10:13.000018-07:00",
                effective_end_date: "2023-10-07T13:10:13.000018-07:00",
                user: {
                    id: "0d34a2e2-467c-11ed-9aa7-62d47aced14b",
                    username: "018076498",
                },
                plan: {
                    id: "99e47c22-950a-11ec-84a4-406c8f3e9cbb",
                    name: "Basic",
                    description: "Basic plan",
                    plan_quota_defaults: [
                        {
                            id: "46febbba-9511-11ec-8844-406c8f3e9cbb",
                            quota_value: 20,
                            resource_type: {
                                id: "99e3bc7e-950a-11ec-84a4-406c8f3e9cbb",
                                name: "cpu.hours",
                                unit: "cpu hours",
                            },
                        },
                        {
                            id: "60b3d5ae-9511-11ec-8844-406c8f3e9cbb",
                            quota_value: 5368709120,
                            resource_type: {
                                id: "99e3f91e-950a-11ec-84a4-406c8f3e9cbb",
                                name: "data.size",
                                unit: "bytes",
                            },
                        },
                    ],
                },
                quotas: [
                    {
                        id: "0d386008-467c-11ed-9aa7-62d47aced14b",
                        quota: 20,
                        resource_type: {
                            id: "99e3bc7e-950a-11ec-84a4-406c8f3e9cbb",
                            name: "cpu.hours",
                            unit: "cpu hours",
                        },
                        last_modified_at: "2022-10-07T13:10:12.465227-07:00",
                    },
                    {
                        id: "0d386760-467c-11ed-9aa7-62d47aced14b",
                        quota: 5368709120,
                        resource_type: {
                            id: "99e3f91e-950a-11ec-84a4-406c8f3e9cbb",
                            name: "data.size",
                            unit: "bytes",
                        },
                        last_modified_at: "2022-10-07T13:10:12.465227-07:00",
                    },
                ],
                usages: [],
            },
            {
                id: "79704ff8-a34a-11ed-bdfa-62d47aced14b",
                effective_start_date: "2023-02-02T15:39:37.864023-07:00",
                effective_end_date: "2024-02-02T15:39:37.864023-07:00",
                user: {
                    id: "0d3ba696-467c-11ed-9aa7-62d47aced14b",
                    username: "0sarah",
                },
                plan: {
                    id: "c6d39580-98dc-11ec-bbe3-406c8f3e9cbb",
                    name: "Regular",
                    description: "Regular plan",
                    plan_quota_defaults: [
                        {
                            id: "e286b526-6e50-4395-99b0-431f76cb4dd9",
                            quota_value: 100,
                            resource_type: {
                                id: "99e3bc7e-950a-11ec-84a4-406c8f3e9cbb",
                                name: "cpu.hours",
                                unit: "cpu hours",
                            },
                        },
                        {
                            id: "0ebd2c19-7c1d-4418-a02f-df5f6d782901",
                            quota_value: 53687091200,
                            resource_type: {
                                id: "99e3f91e-950a-11ec-84a4-406c8f3e9cbb",
                                name: "data.size",
                                unit: "bytes",
                            },
                        },
                    ],
                },
                quotas: [
                    {
                        id: "7970fda4-a34a-11ed-bdfa-62d47aced14b",
                        quota: 100,
                        resource_type: {
                            id: "99e3bc7e-950a-11ec-84a4-406c8f3e9cbb",
                            name: "cpu.hours",
                            unit: "cpu hours",
                        },
                        last_modified_at: "2023-02-02T15:39:37.845546-07:00",
                    },
                    {
                        id: "79749a04-a34a-11ed-bdfa-62d47aced14b",
                        quota: 53687091200,
                        resource_type: {
                            id: "99e3f91e-950a-11ec-84a4-406c8f3e9cbb",
                            name: "data.size",
                            unit: "bytes",
                        },
                        last_modified_at: "2023-02-02T15:39:37.845546-07:00",
                    },
                ],
                usages: [],
            },
            {
                id: "590df562-5b4c-11ed-927c-62d47aced14b",
                effective_start_date: "2022-11-03T00:51:38.806735-07:00",
                effective_end_date: "2023-11-03T00:51:38.806735-07:00",
                user: {
                    id: "58fdd86c-5b4c-11ed-927c-62d47aced14b",
                    username: "10018616",
                },
                plan: {
                    id: "99e47c22-950a-11ec-84a4-406c8f3e9cbb",
                    name: "Basic",
                    description: "Basic plan",
                    plan_quota_defaults: [
                        {
                            id: "46febbba-9511-11ec-8844-406c8f3e9cbb",
                            quota_value: 20,
                            resource_type: {
                                id: "99e3bc7e-950a-11ec-84a4-406c8f3e9cbb",
                                name: "cpu.hours",
                                unit: "cpu hours",
                            },
                        },
                        {
                            id: "60b3d5ae-9511-11ec-8844-406c8f3e9cbb",
                            quota_value: 5368709120,
                            resource_type: {
                                id: "99e3f91e-950a-11ec-84a4-406c8f3e9cbb",
                                name: "data.size",
                                unit: "bytes",
                            },
                        },
                    ],
                },
                quotas: [
                    {
                        id: "590e4cb0-5b4c-11ed-927c-62d47aced14b",
                        quota: 20,
                        resource_type: {
                            id: "99e3bc7e-950a-11ec-84a4-406c8f3e9cbb",
                            name: "cpu.hours",
                            unit: "cpu hours",
                        },
                        last_modified_at: "2022-11-03T00:51:38.657238-07:00",
                    },
                    {
                        id: "590faa10-5b4c-11ed-927c-62d47aced14b",
                        quota: 5368709120,
                        resource_type: {
                            id: "99e3f91e-950a-11ec-84a4-406c8f3e9cbb",
                            name: "data.size",
                            unit: "bytes",
                        },
                        last_modified_at: "2022-11-03T00:51:38.657238-07:00",
                    },
                ],
                usages: [
                    {
                        id: "592683d4-5b4c-11ed-927c-62d47aced14b",
                        usage: 0,
                        resource_type: {
                            id: "99e3f91e-950a-11ec-84a4-406c8f3e9cbb",
                            name: "data.size",
                            unit: "bytes",
                        },
                        last_modified_at: "2022-11-03T00:51:38.657238-07:00",
                    },
                ],
            },
            {
                id: "848fe3f0-a334-11ed-b9cb-62d47aced14b",
                effective_start_date: "2023-02-02T13:02:27.598105-07:00",
                effective_end_date: "2024-02-02T13:02:27.598105-07:00",
                user: {
                    id: "0d42de20-467c-11ed-9aa7-62d47aced14b",
                    username: "10adavis",
                },
                plan: {
                    id: "99e47c22-950a-11ec-84a4-406c8f3e9cbb",
                    name: "Basic",
                    description: "Basic plan",
                    plan_quota_defaults: [
                        {
                            id: "46febbba-9511-11ec-8844-406c8f3e9cbb",
                            quota_value: 20,
                            resource_type: {
                                id: "99e3bc7e-950a-11ec-84a4-406c8f3e9cbb",
                                name: "cpu.hours",
                                unit: "cpu hours",
                            },
                        },
                        {
                            id: "60b3d5ae-9511-11ec-8844-406c8f3e9cbb",
                            quota_value: 5368709120,
                            resource_type: {
                                id: "99e3f91e-950a-11ec-84a4-406c8f3e9cbb",
                                name: "data.size",
                                unit: "bytes",
                            },
                        },
                    ],
                },
                quotas: [
                    {
                        id: "84907298-a334-11ed-b9cb-62d47aced14b",
                        quota: 20,
                        resource_type: {
                            id: "99e3bc7e-950a-11ec-84a4-406c8f3e9cbb",
                            name: "cpu.hours",
                            unit: "cpu hours",
                        },
                        last_modified_at: "2023-02-02T13:02:27.582514-07:00",
                    },
                    {
                        id: "8493d0e6-a334-11ed-b9cb-62d47aced14b",
                        quota: 5368709120,
                        resource_type: {
                            id: "99e3f91e-950a-11ec-84a4-406c8f3e9cbb",
                            name: "data.size",
                            unit: "bytes",
                        },
                        last_modified_at: "2023-02-02T13:02:27.582514-07:00",
                    },
                ],
                usages: [],
            },
            {
                id: "dd42d0f6-9cff-11ed-8c7c-62d47aced14b",
                effective_start_date: "2023-01-25T15:30:26.107418-07:00",
                effective_end_date: "2024-01-25T15:30:26.107418-07:00",
                user: {
                    id: "0d4a2a18-467c-11ed-9aa7-62d47aced14b",
                    username: "11135stone",
                },
                plan: {
                    id: "99e47c22-950a-11ec-84a4-406c8f3e9cbb",
                    name: "Basic",
                    description: "Basic plan",
                    plan_quota_defaults: [
                        {
                            id: "46febbba-9511-11ec-8844-406c8f3e9cbb",
                            quota_value: 20,
                            resource_type: {
                                id: "99e3bc7e-950a-11ec-84a4-406c8f3e9cbb",
                                name: "cpu.hours",
                                unit: "cpu hours",
                            },
                        },
                        {
                            id: "60b3d5ae-9511-11ec-8844-406c8f3e9cbb",
                            quota_value: 5368709120,
                            resource_type: {
                                id: "99e3f91e-950a-11ec-84a4-406c8f3e9cbb",
                                name: "data.size",
                                unit: "bytes",
                            },
                        },
                    ],
                },
                quotas: [
                    {
                        id: "dd44edaa-9cff-11ed-8c7c-62d47aced14b",
                        quota: 20,
                        resource_type: {
                            id: "99e3bc7e-950a-11ec-84a4-406c8f3e9cbb",
                            name: "cpu.hours",
                            unit: "cpu hours",
                        },
                        last_modified_at: "2023-01-25T15:30:26.0936-07:00",
                    },
                    {
                        id: "dd47c3e0-9cff-11ed-8c7c-62d47aced14b",
                        quota: 5368709120,
                        resource_type: {
                            id: "99e3f91e-950a-11ec-84a4-406c8f3e9cbb",
                            name: "data.size",
                            unit: "bytes",
                        },
                        last_modified_at: "2023-01-25T15:30:26.0936-07:00",
                    },
                ],
                usages: [],
            },
            {
                id: "0d53ed96-467c-11ed-9aa7-62d47aced14b",
                effective_start_date: "2022-10-07T13:10:13.18313-07:00",
                effective_end_date: "2023-10-07T13:10:13.18313-07:00",
                user: {
                    id: "0d50d2aa-467c-11ed-9aa7-62d47aced14b",
                    username: "111573697",
                },
                plan: {
                    id: "99e47c22-950a-11ec-84a4-406c8f3e9cbb",
                    name: "Basic",
                    description: "Basic plan",
                    plan_quota_defaults: [
                        {
                            id: "46febbba-9511-11ec-8844-406c8f3e9cbb",
                            quota_value: 20,
                            resource_type: {
                                id: "99e3bc7e-950a-11ec-84a4-406c8f3e9cbb",
                                name: "cpu.hours",
                                unit: "cpu hours",
                            },
                        },
                        {
                            id: "60b3d5ae-9511-11ec-8844-406c8f3e9cbb",
                            quota_value: 5368709120,
                            resource_type: {
                                id: "99e3f91e-950a-11ec-84a4-406c8f3e9cbb",
                                name: "data.size",
                                unit: "bytes",
                            },
                        },
                    ],
                },
                quotas: [
                    {
                        id: "0d544296-467c-11ed-9aa7-62d47aced14b",
                        quota: 20,
                        resource_type: {
                            id: "99e3bc7e-950a-11ec-84a4-406c8f3e9cbb",
                            name: "cpu.hours",
                            unit: "cpu hours",
                        },
                        last_modified_at: "2022-10-07T13:10:12.465227-07:00",
                    },
                    {
                        id: "0d544796-467c-11ed-9aa7-62d47aced14b",
                        quota: 5368709120,
                        resource_type: {
                            id: "99e3f91e-950a-11ec-84a4-406c8f3e9cbb",
                            name: "data.size",
                            unit: "bytes",
                        },
                        last_modified_at: "2022-10-07T13:10:12.465227-07:00",
                    },
                ],
                usages: [],
            },
            {
                id: "0d5ab2c0-467c-11ed-9aa7-62d47aced14b",
                effective_start_date: "2022-10-07T13:10:13.227313-07:00",
                effective_end_date: "2023-10-07T13:10:13.227313-07:00",
                user: {
                    id: "0d576264-467c-11ed-9aa7-62d47aced14b",
                    username: "120897",
                },
                plan: {
                    id: "99e47c22-950a-11ec-84a4-406c8f3e9cbb",
                    name: "Basic",
                    description: "Basic plan",
                    plan_quota_defaults: [
                        {
                            id: "46febbba-9511-11ec-8844-406c8f3e9cbb",
                            quota_value: 20,
                            resource_type: {
                                id: "99e3bc7e-950a-11ec-84a4-406c8f3e9cbb",
                                name: "cpu.hours",
                                unit: "cpu hours",
                            },
                        },
                        {
                            id: "60b3d5ae-9511-11ec-8844-406c8f3e9cbb",
                            quota_value: 5368709120,
                            resource_type: {
                                id: "99e3f91e-950a-11ec-84a4-406c8f3e9cbb",
                                name: "data.size",
                                unit: "bytes",
                            },
                        },
                    ],
                },
                quotas: [
                    {
                        id: "0d5b1242-467c-11ed-9aa7-62d47aced14b",
                        quota: 20,
                        resource_type: {
                            id: "99e3bc7e-950a-11ec-84a4-406c8f3e9cbb",
                            name: "cpu.hours",
                            unit: "cpu hours",
                        },
                        last_modified_at: "2022-10-07T13:10:12.465227-07:00",
                    },
                    {
                        id: "0d5b1864-467c-11ed-9aa7-62d47aced14b",
                        quota: 5368709120,
                        resource_type: {
                            id: "99e3f91e-950a-11ec-84a4-406c8f3e9cbb",
                            name: "data.size",
                            unit: "bytes",
                        },
                        last_modified_at: "2022-10-07T13:10:12.465227-07:00",
                    },
                ],
                usages: [],
            },
        ],
        total: 34820,
    },
    status: "OK",
};

export const planTypes = {
    result: [
        {
            id: "99e47c22-950a-11ec-84a4-406c8f3e9cbb",
            name: "Basic",
            description: "Basic plan",
            plan_quota_defaults: [
                {
                    id: "46febbba-9511-11ec-8844-406c8f3e9cbb",
                    quota_value: 20,
                    resource_type: {
                        id: "99e3bc7e-950a-11ec-84a4-406c8f3e9cbb",
                        name: "cpu.hours",
                        unit: "cpu hours",
                    },
                },
                {
                    id: "60b3d5ae-9511-11ec-8844-406c8f3e9cbb",
                    quota_value: 5368709120,
                    resource_type: {
                        id: "99e3f91e-950a-11ec-84a4-406c8f3e9cbb",
                        name: "data.size",
                        unit: "bytes",
                    },
                },
            ],
        },
        {
            id: "c6d39580-98dc-11ec-bbe3-406c8f3e9cbb",
            name: "Regular",
            description: "Regular plan",
            plan_quota_defaults: [
                {
                    id: "e286b526-6e50-4395-99b0-431f76cb4dd9",
                    quota_value: 100,
                    resource_type: {
                        id: "99e3bc7e-950a-11ec-84a4-406c8f3e9cbb",
                        name: "cpu.hours",
                        unit: "cpu hours",
                    },
                },
                {
                    id: "0ebd2c19-7c1d-4418-a02f-df5f6d782901",
                    quota_value: 53687091200,
                    resource_type: {
                        id: "99e3f91e-950a-11ec-84a4-406c8f3e9cbb",
                        name: "data.size",
                        unit: "bytes",
                    },
                },
            ],
        },
        {
            id: "cdf7ac7a-98dc-11ec-bbe3-406c8f3e9cbb",
            name: "Pro",
            description: "Professional plan",
            plan_quota_defaults: [
                {
                    id: "7efddabe-47d6-401c-b857-d08361397fcf",
                    quota_value: 2000,
                    resource_type: {
                        id: "99e3bc7e-950a-11ec-84a4-406c8f3e9cbb",
                        name: "cpu.hours",
                        unit: "cpu hours",
                    },
                },
                {
                    id: "2c39ff2f-2ec7-4ac8-a10e-79fd82b39c09",
                    quota_value: 3298534883328,
                    resource_type: {
                        id: "99e3f91e-950a-11ec-84a4-406c8f3e9cbb",
                        name: "data.size",
                        unit: "bytes",
                    },
                },
            ],
        },
        {
            id: "d80b5482-98dc-11ec-bbe3-406c8f3e9cbb",
            name: "Commercial",
            description: "Commercial plan",
            plan_quota_defaults: [
                {
                    id: "1e3804ed-4ed3-4cd9-8e58-1e725fa79c1b",
                    quota_value: 5000,
                    resource_type: {
                        id: "99e3bc7e-950a-11ec-84a4-406c8f3e9cbb",
                        name: "cpu.hours",
                        unit: "cpu hours",
                    },
                },
                {
                    id: "de496045-b954-4f41-b068-3c71b32d2287",
                    quota_value: 5497558138880,
                    resource_type: {
                        id: "99e3f91e-950a-11ec-84a4-406c8f3e9cbb",
                        name: "data.size",
                        unit: "bytes",
                    },
                },
            ],
        },
    ],
    status: "OK",
};

export const subscription = {
    id: "c5b2dc54-a34b-11ed-a78d-62d47aced14b",
    effective_start_date: "2023-02-02T15:48:55.304072-07:00",
    effective_end_date: "2024-02-02T15:48:55.304072-07:00",
    user: {
        id: "0d1c4cc4-467c-11ed-9aa7-62d47aced14b",
        username: "00powellemmag",
    },
    plan: {
        id: "99e47c22-950a-11ec-84a4-406c8f3e9cbb",
        name: "Basic",
        description: "Basic plan",
        plan_quota_defaults: [
            {
                id: "46febbba-9511-11ec-8844-406c8f3e9cbb",
                quota_value: 20,
                resource_type: {
                    id: "99e3bc7e-950a-11ec-84a4-406c8f3e9cbb",
                    name: "cpu.hours",
                    unit: "cpu hours",
                },
            },
            {
                id: "60b3d5ae-9511-11ec-8844-406c8f3e9cbb",
                quota_value: 5368709120,
                resource_type: {
                    id: "99e3f91e-950a-11ec-84a4-406c8f3e9cbb",
                    name: "data.size",
                    unit: "bytes",
                },
            },
        ],
    },
    quotas: [
        {
            id: "c5b4d87e-a34b-11ed-a78d-62d47aced14b",
            quota: 53687,
            resource_type: {
                id: "99e3f91e-950a-11ec-84a4-406c8f3e9cbb",
                name: "data.size",
                unit: "bytes",
            },
            last_modified_at: "2023-02-02T15:49:16.811069-07:00",
        },
        {
            id: "c5b377a4-a34b-11ed-a78d-62d47aced14b",
            quota: 25,
            resource_type: {
                id: "99e3bc7e-950a-11ec-84a4-406c8f3e9cbb",
                name: "cpu.hours",
                unit: "cpu hours",
            },
            last_modified_at: "2023-02-02T15:49:17.048279-07:00",
        },
    ],
    usages: [],
};
