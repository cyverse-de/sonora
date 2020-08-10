export const dataUserPermRequest = {
    paths: [
        "/iplant/home/aramsey/CORE-9077-path.list",
        "/iplant/home/aramsey/Discovery Environment-CyVerse-blue.svg",
    ],
};

export const dataUserPermResp = {
    paths: [
        {
            path: "/iplant/home/aramsey/CORE-9077-path.list",
            "user-permissions": [
                { user: "user_a", permission: "read" },
                { user: "user_b", permission: "write" },
                { user: "user_c", permission: "own" },
            ],
        },
        {
            path: "/iplant/home/aramsey/Discovery Environment-CyVerse-blue.svg",
            "user-permissions": [
                { user: "user_a", permission: "read" },
                { user: "user_b", permission: "write" },
                { user: "user_c", permission: "read" },
            ],
        },
    ],
};

export const dataShareRequest = {
    sharing: [
        {
            user: "batman_test",
            paths: [
                {
                    path: "/iplant/home/aramsey/CORE-9077-path.list",
                    permission: "read",
                },
            ],
        },
        {
            user: "user_a",
            paths: [
                {
                    path: "/iplant/home/aramsey/CORE-9077-path.list",
                    permission: "own",
                },
            ],
        },
        {
            user: "not_a_user",
            paths: [
                {
                    path: "/iplant/home/aramsey/CORE-9077-path.list",
                    permission: "write",
                },
            ],
        },
    ],
};

export const dataShareResponse = {
    sharing: [
        {
            user: "batman_test",
            sharing: [
                {
                    path: "/iplant/home/aramsey/CORE-9077-path.list",
                    permission: "read",
                    success: true,
                },
            ],
        },
        {
            user: "user_a",
            paths: [
                {
                    path: "/iplant/home/aramsey/CORE-9077-path.list",
                    permission: "own",
                    success: true,
                },
            ],
        },
        {
            user: "not_a_user",
            sharing: [
                {
                    path: "/iplant/home/aramsey/CORE-9077-path.list",
                    permission: "read",
                    success: false,
                    error: {
                        error_code: "ERR_NOT_A_USER",
                        users: ["not_a_user"],
                    },
                },
            ],
        },
    ],
};

export const dataUnshareRequest = {
    unshare: [
        {
            user: "batman_test",
            paths: [
                {
                    path: "/iplant/home/aramsey/CORE-9077-path.list",
                },
            ],
        },
    ],
};

export const dataUnshareResponse = {
    unshare: [
        {
            user: "batman_test",
            sharing: [
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
        {
            system_id: "de",
            app_id: "e54bfc1a-f811-11e8-8a14-008cfa5ae622",
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
                        id: "user_a",
                    },
                    permission: "read",
                },
                {
                    subject: {
                        source_id: "ldap",
                        id: "user_b",
                    },
                    permission: "write",
                },
                {
                    subject: {
                        id: "1448e0f77d794bc9965dea4bf8eddecb",
                        source_id: "g:gsa",
                    },
                    permission: "own",
                },
            ],
        },
        {
            system_id: "de",
            app_id: "e54bfc1a-f811-11e8-8a14-008cfa5ae622",
            name: "MMTF",
            permissions: [
                {
                    subject: {
                        source_id: "ldap",
                        id: "user_a",
                    },
                    permission: "read",
                },
                {
                    subject: {
                        source_id: "ldap",
                        id: "user_b",
                    },
                    permission: "write",
                },
                {
                    subject: {
                        id: "1448e0f77d794bc9965dea4bf8eddecb",
                        source_id: "g:gsa",
                    },
                    permission: "read",
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
                id: "batman_test",
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
                id: "1448e0f77d794bc9965dea4bf8eddecb",
                source_id: "g:gsa",
            },
            apps: [
                {
                    system_id: "de",
                    app_id: "e54bfc1a-f811-11e8-8a14-008cfa5ae622",
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
                id: "batman_test",
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
                id: "1448e0f77d794bc9965dea4bf8eddecb",
                source_id: "g:gsa",
            },
            apps: [
                {
                    system_id: "de",
                    app_id: "e54bfc1a-f811-11e8-8a14-008cfa5ae622",
                    permission: "read",
                    app_name: "MMTF",
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

export const appUnshareRequest = {
    unsharing: [
        {
            subject: {
                source_id: "ldap",
                id: "batman_test",
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
                id: "1448e0f77d794bc9965dea4bf8eddecb",
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
                id: "batman_test",
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
                id: "1448e0f77d794bc9965dea4bf8eddecb",
                source_id: "g:gsa",
            },
            apps: [
                {
                    system_id: "de",
                    app_id: "e54bfc1a-f811-11e8-8a14-008cfa5ae622",
                    app_name: "MMTF",
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
    analyses: [
        "07a3e96e-c21c-11ea-aa22-008cfa5ae621",
        "07a3e96e-c21c-11ea-aa22-008cfa5ae622",
    ],
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
                        id: "user_a",
                    },
                    permission: "read",
                },
                {
                    subject: {
                        source_id: "ldap",
                        id: "user_b",
                    },
                    permission: "write",
                },
                {
                    subject: {
                        source_id: "ldap",
                        id: "user_c",
                    },
                    permission: "own",
                },
            ],
        },
        {
            id: "07a3e96e-c21c-11ea-aa22-008cfa5ae622",
            name: "Trinity Analysis",
            permissions: [
                {
                    subject: {
                        source_id: "ldap",
                        id: "user_a",
                    },
                    permission: "write",
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
                id: "batman_test",
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
                id: "user_a",
            },
            analyses: [
                {
                    analysis_id: "07a3e96e-c21c-11ea-aa22-008cfa5ae6212",
                    permission: "own",
                },
            ],
        },
    ],
};

export const analysisShareResponse = {
    sharing: [
        {
            subject: { source_id: "ldap", id: "batman_test" },
            analyses: [
                {
                    analysis_id: "07a3e96e-c21c-11ea-aa22-008cfa5ae621",
                    permission: "read",
                    analysis_name: "Wordiest_Count_analysis1",
                    success: true,
                    input_errors: [
                        "unable to share input file, /iplant/home/aramsey/sample1.newick: ERR_DOES_NOT_EXIST",
                    ],
                },
            ],
        },
        {
            subject: { source_id: "ldap", id: "user_a" },
            analyses: [
                {
                    analysis_id: "07a3e96e-c21c-11ea-aa22-008cfa5ae622",
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
                id: "user_a",
            },
            analyses: [
                {
                    analysis_id: "07a3e96e-c21c-11ea-aa22-008cfa5ae622",
                },
            ],
        },
        {
            subject: {
                source_id: "ldap",
                id: "user_a",
            },
            analyses: [
                {
                    analysis_id: "07a3e96e-c21c-11ea-aa22-008cfa5ae6212",
                    permission: "own",
                },
            ],
        },
    ],
};

export const analysisUnshareResponse = {
    unsharing: [
        {
            subject: { source_id: "ldap", id: "user_a" },
            analyses: [
                {
                    analysis_id: "07a3e96e-c21c-11ea-aa22-008cfa5ae622",
                    analysis_name: "MMTF_analysis1",
                    success: true,
                },
            ],
        },
    ],
};
