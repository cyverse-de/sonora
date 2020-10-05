import { GROUP_ID } from "../data/DataMocks";

export const dataUserPermRequest = {
    paths: [
        "/iplant/home/aramsey/CORE-9077-path.list",
        "/iplant/home/aramsey/TestFolder",
    ],
};

export const dataUserPermResp = {
    paths: [
        {
            path: "/iplant/home/aramsey/CORE-9077-path.list",
            "user-permissions": [
                { user: "alfred", permission: "read" },
                { user: "robin", permission: "write" },
                { user: "joker", permission: "own" },
            ],
        },
        {
            path: "/iplant/home/aramsey/TestFolder",
            "user-permissions": [
                { user: "alfred", permission: "read" },
                { user: "robin", permission: "write" },
                { user: "joker", permission: "read" },
            ],
        },
    ],
};

export const dataUserEmptyPermResp = {
    paths: [
        {
            path: "/iplant/home/aramsey/CORE-9077-path.list",
            "user-permissions": [],
        },
        {
            path: "/iplant/home/aramsey/TestFolder",
            "user-permissions": [],
        },
    ],
};

export const dataShareRequest = {
    sharing: [
        {
            user: "joker",
            paths: [
                {
                    path: "/iplant/home/aramsey/CORE-9077-path.list",
                    permission: "read",
                },
            ],
        },
        {
            user: "alfred",
            paths: [
                {
                    path: "/iplant/home/aramsey/CORE-9077-path.list",
                    permission: "own",
                },
            ],
        },
    ],
};

export const dataShareResponse = {
    sharing: [
        {
            user: "joker",
            sharing: [
                {
                    path: "/iplant/home/aramsey/CORE-9077-path.list",
                    permission: "read",
                    success: true,
                },
            ],
        },
        {
            user: "alfred",
            sharing: [
                {
                    path: "/iplant/home/aramsey/CORE-9077-path.list",
                    permission: "own",
                    success: true,
                },
            ],
        },
    ],
};

export const dataUnshareRequest = {
    unshare: [
        {
            user: "joker",
            paths: ["/iplant/home/aramsey/CORE-9077-path.list"],
        },
    ],
};

export const dataUnshareResponse = {
    unshare: [
        {
            user: "joker",
            unshare: [
                {
                    path: "/iplant/home/aramsey/CORE-9077-path.list",
                    success: true,
                },
            ],
        },
    ],
};
export const appPermissionListRequest = {
    apps: [
        {
            system_id: "de",
            app_id: "e54bfc1a-f811-11e8-8a14-008cfa5ae621",
        },
    ],
};

export const appPermissionListResponse = {
    apps: [
        {
            system_id: "de",
            app_id: "e54bfc1a-f811-11e8-8a14-008cfa5ae621",
            name: "JupJup",
            permissions: [
                {
                    subject: {
                        source_id: "ldap",
                        id: "alfred",
                    },
                    permission: "read",
                },
                {
                    subject: {
                        source_id: "ldap",
                        id: "robin",
                    },
                    permission: "write",
                },
                {
                    subject: {
                        id: GROUP_ID,
                        source_id: "g:gsa",
                    },
                    permission: "own",
                },
            ],
        },
    ],
};

export const appShareRequest = {
    sharing: [
        {
            subject: {
                source_id: "ldap",
                id: "robin",
            },
            apps: [
                {
                    system_id: "de",
                    app_id: "e54bfc1a-f811-11e8-8a14-008cfa5ae621",
                    permission: "read",
                },
            ],
        },
        {
            subject: {
                id: GROUP_ID,
                source_id: "g:gsa",
            },
            apps: [
                {
                    system_id: "de",
                    app_id: "e54bfc1a-f811-11e8-8a14-008cfa5ae621",
                    permission: "write",
                },
            ],
        },
    ],
};

export const appShareResponse = {
    sharing: [
        {
            subject: {
                source_id: "ldap",
                id: "robin",
            },
            apps: [
                {
                    system_id: "de",
                    app_id: "e54bfc1a-f811-11e8-8a14-008cfa5ae621",
                    permission: "read",
                    app_name: "JupJup",
                    success: true,
                },
            ],
        },
        {
            subject: {
                id: GROUP_ID,
                source_id: "g:gsa",
            },
            apps: [
                {
                    system_id: "de",
                    app_id: "e54bfc1a-f811-11e8-8a14-008cfa5ae621",
                    permission: "read",
                    app_name: "JupJup",
                    success: true,
                },
            ],
        },
    ],
};

export const appUnshareRequest = {
    unsharing: [
        {
            subject: {
                source_id: "ldap",
                id: "robin",
            },
            apps: [
                {
                    system_id: "de",
                    app_id: "e54bfc1a-f811-11e8-8a14-008cfa5ae621",
                },
            ],
        },
        {
            subject: {
                id: GROUP_ID,
                source_id: "g:gsa",
            },
            apps: [
                {
                    system_id: "de",
                    app_id: "e54bfc1a-f811-11e8-8a14-008cfa5ae621",
                },
            ],
        },
    ],
};

export const appUnshareResponse = {
    unsharing: [
        {
            subject: {
                source_id: "ldap",
                id: "robin",
            },
            apps: [
                {
                    system_id: "de",
                    app_id: "e54bfc1a-f811-11e8-8a14-008cfa5ae621",
                    app_name: "JupJup",
                    success: true,
                },
            ],
        },
        {
            subject: {
                id: GROUP_ID,
                source_id: "g:gsa",
            },
            apps: [
                {
                    system_id: "de",
                    app_id: "e54bfc1a-f811-11e8-8a14-008cfa5ae621",
                    app_name: "JupJup",
                    success: false,
                    error: {
                        error_code: 500,
                        reason: "Does not work",
                    },
                },
            ],
        },
    ],
};
export const analysisPermissionRequest = {
    analyses: ["07a3e96e-c21c-11ea-aa22-008cfa5ae621"],
};

export const analysisPermissionResponse = {
    analyses: [
        {
            id: "07a3e96e-c21c-11ea-aa22-008cfa5ae621",
            name: "MMTF Analysis",
            permissions: [
                {
                    subject: {
                        source_id: "ldap",
                        id: "alfred",
                    },
                    permission: "read",
                },
                {
                    subject: {
                        source_id: "ldap",
                        id: "robin",
                    },
                    permission: "write",
                },
                {
                    subject: {
                        source_id: "ldap",
                        id: "joker",
                    },
                    permission: "own",
                },
            ],
        },
    ],
};

export const analysisShareRequest = {
    sharing: [
        {
            subject: {
                source_id: "ldap",
                id: "joker",
            },
            analyses: [
                {
                    analysis_id: "07a3e96e-c21c-11ea-aa22-008cfa5ae621",
                    permission: "read",
                },
            ],
        },
        {
            subject: {
                source_id: "ldap",
                id: "alfred",
            },
            analyses: [
                {
                    analysis_id: "07a3e96e-c21c-11ea-aa22-008cfa5ae6211",
                    permission: "own",
                },
            ],
        },
    ],
};

export const analysisShareResponse = {
    sharing: [
        {
            subject: { source_id: "ldap", id: "joker" },
            analyses: [
                {
                    analysis_id: "07a3e96e-c21c-11ea-aa22-008cfa5ae621",
                    permission: "read",
                    analysis_name: "MMTF Analysis",
                    success: true,
                },
            ],
        },
        {
            subject: { source_id: "ldap", id: "alfred" },
            analyses: [
                {
                    analysis_id: "07a3e96e-c21c-11ea-aa22-008cfa5ae621",
                    permission: "owm",
                    analysis_name: "MMTF_analysis1",
                    success: true,
                },
            ],
        },
    ],
};

export const analysisUnshareRequest = {
    unsharing: [
        {
            subject: {
                source_id: "ldap",
                id: "joker",
            },
            analyses: ["07a3e96e-c21c-11ea-aa22-008cfa5ae621"],
        },
        {
            subject: {
                source_id: "ldap",
                id: "alfred",
            },
            analyses: ["07a3e96e-c21c-11ea-aa22-008cfa5ae621"],
        },
    ],
};

export const analysisUnshareResponse = {
    unsharing: [
        {
            subject: { source_id: "ldap", id: "joker" },
            analyses: [
                {
                    analysis_id: "07a3e96e-c21c-11ea-aa22-008cfa5ae621",
                    analysis_name: "MMTF_analysis1",
                    success: true,
                },
            ],
        },
    ],
};
export const toolPermissionRequest = {
    tools: ["2609f8a8-e928-11e9-a2ea-008cfa5ae621"],
};

export const toolPermissionResponse = {
    tools: [
        {
            id: "2609f8a8-e928-11e9-a2ea-008cfa5ae621",
            name: "Test_Tool",
            permissions: [
                {
                    subject: { source_id: "ldap", id: "alfred" },
                    permission: "read",
                },
                {
                    subject: { source_id: "ldap", id: "robin" },
                    permission: "write",
                },
                {
                    subject: { source_id: "ldap", id: "joker" },
                    permission: "own",
                },
            ],
        },
    ],
};

export const toolShareRequest = {
    sharing: [
        {
            tools: [
                {
                    tool_id: "2609f8a8-e928-11e9-a2ea-008cfa5ae621",
                    permission: "read",
                },
            ],
            subject: { id: "joker", source_id: "ldap" },
        },
        {
            tools: [
                {
                    tool_id: "2609f8a8-e928-11e9-a2ea-008cfa5ae621",
                    permission: "own",
                },
            ],
            subject: { id: "alfred", source_id: "ldap" },
        },
    ],
};

export const toolShareResponse = {
    sharing: [
        {
            subject: {
                source_id: "ldap",
                id: "joker",
            },
            tools: [
                {
                    tool_id: "2609f8a8-e928-11e9-a2ea-008cfa5ae621",
                    permission: "read",
                    tool_name: "Test_Tool",
                    success: true,
                },
            ],
        },
        {
            subject: {
                source_id: "ldap",
                id: "alfred",
            },
            tools: [
                {
                    tool_id: "2609f8a8-e928-11e9-a2ea-008cfa5ae621",
                    permission: "own",
                    tool_name: "Test_Tool",
                    success: true,
                },
            ],
        },
    ],
};

export const toolUnshareRequest = {
    unsharing: [
        {
            tools: ["2609f8a8-e928-11e9-a2ea-008cfa5ae621"],
            subject: { id: "joker", source_id: "ldap" },
        },
    ],
};

export const toolUnshareResponse = {
    unsharing: [
        {
            subject: {
                source_id: "ldap",
                id: "joker",
            },
            tools: [
                {
                    tool_id: "2609f8a8-e928-11e9-a2ea-008cfa5ae621",
                    tool_name: "Test_Tool",
                    success: true,
                },
            ],
        },
    ],
};

export const allPermissionListerResponses = [
    dataUserPermResp,
    appPermissionListResponse,
    analysisPermissionResponse,
    toolPermissionResponse,
];
