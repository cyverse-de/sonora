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
