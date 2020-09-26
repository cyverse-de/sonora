import {
    addMissingResourcesToUser,
    getResourceTotal,
    getSharingUpdates,
    getUnsharingUpdates,
    getUserMap,
    getUserSet,
} from "../components/sharing/util";
import {
    allPermissionListerResponses,
    dataUserPermResp,
} from "../../stories/sharing/SharingMocks";
import { GROUP_ID, userInfoResp } from "../../stories/data/DataMocks";

const alfredUser = userInfoResp["alfred"];

/**
 * Resources object as sent in from the sharing bag
 */
const resources = {
    paths: [
        {
            label: "CORE-9077-path.list",
            path: "/iplant/home/aramsey/CORE-9077-path.list",
            type: "file",
        },
        {
            label: "TestFolder",
            path: "/iplant/home/aramsey/TestFolder",
            type: "folder",
        },
    ],
    apps: [
        {
            name: "JupJup",
            system_id: "de",
            id: "e54bfc1a-f811-11e8-8a14-008cfa5ae621",
        },
    ],
    analyses: [
        {
            name: "MMTF Analysis",
            id: "07a3e96e-c21c-11ea-aa22-008cfa5ae621",
        },
    ],
    tools: [
        {
            name: "Test_Tool",
            id: "2609f8a8-e928-11e9-a2ea-008cfa5ae621",
        },
    ],
};

/**
 * A sample mapping of users with their resources built by the getUserMap function
 */
const userMap = {
    [GROUP_ID]: {
        ...userInfoResp[GROUP_ID],
        apps: [
            {
                app_id: "e54bfc1a-f811-11e8-8a14-008cfa5ae621",
                permission: "own",
                system_id: "de",
            },
        ],
        displayPermission: "varies",
        originalPermission: "varies",
    },
    alfred: {
        ...alfredUser,
        originalPermission: "read",
        displayPermission: "read",
        analyses: [
            {
                analysis_id: "07a3e96e-c21c-11ea-aa22-008cfa5ae621",
                permission: "read",
            },
        ],
        apps: [
            {
                app_id: "e54bfc1a-f811-11e8-8a14-008cfa5ae621",
                permission: "read",
                system_id: "de",
            },
        ],
        paths: [
            {
                path: "/iplant/home/aramsey/CORE-9077-path.list",
                permission: "read",
            },
            { path: "/iplant/home/aramsey/TestFolder", permission: "read" },
        ],
        tools: [
            {
                permission: "read",
                tool_id: "2609f8a8-e928-11e9-a2ea-008cfa5ae621",
            },
        ],
    },
    joker: {
        ...userInfoResp["joker"],
        originalPermission: "varies",
        displayPermission: "varies",
        analyses: [
            {
                analysis_id: "07a3e96e-c21c-11ea-aa22-008cfa5ae621",
                permission: "own",
            },
        ],
        paths: [
            {
                path: "/iplant/home/aramsey/CORE-9077-path.list",
                permission: "own",
            },
            { path: "/iplant/home/aramsey/TestFolder", permission: "read" },
        ],
        tools: [
            {
                permission: "own",
                tool_id: "2609f8a8-e928-11e9-a2ea-008cfa5ae621",
            },
        ],
    },
    robin: {
        ...userInfoResp["robin"],
        originalPermission: "write",
        displayPermission: "write",
        analyses: [
            {
                analysis_id: "07a3e96e-c21c-11ea-aa22-008cfa5ae621",
                permission: "write",
            },
        ],
        apps: [
            {
                app_id: "e54bfc1a-f811-11e8-8a14-008cfa5ae621",
                permission: "write",
                system_id: "de",
            },
        ],
        paths: [
            {
                path: "/iplant/home/aramsey/CORE-9077-path.list",
                permission: "write",
            },
            { path: "/iplant/home/aramsey/TestFolder", permission: "write" },
        ],
        tools: [
            {
                permission: "write",
                tool_id: "2609f8a8-e928-11e9-a2ea-008cfa5ae621",
            },
        ],
    },
};

it("tests userSet given all permission-lister responses", () => {
    const result = getUserSet(allPermissionListerResponses);
    const expected = ["alfred", "robin", "joker", GROUP_ID];

    expect(result).toStrictEqual(expected);
});

it("tests userSet given data permission-lister responses", () => {
    const result = getUserSet([dataUserPermResp]);
    const expected = ["alfred", "robin", "joker"];

    expect(result).toStrictEqual(expected);
});

it("tests userSet given no permission-lister responses", () => {
    const result = getUserSet([]);
    const expected = [];

    expect(result).toStrictEqual(expected);
});

/**
 * Tests all permission-lister responses from Storybook which should include:
 * a user with permissions on only 1 resource (the gotham baddies group),
 * a user with varied permissions (joker has 'own' and 'read')
 * and users with uniform permissions on all resources (alfred has 'read' on all
 * and robin has 'write' on all)
 */
it("tests userMap given all permission-lister responses", () => {
    const resourceTotal = getResourceTotal(resources);
    const result = getUserMap(
        allPermissionListerResponses,
        userInfoResp,
        resourceTotal
    );

    expect(result).toStrictEqual(userMap);
});

/**
 * If a user has no resources, all the resources should be added with no
 * permissions set
 */
it("tests adding missing resources to a user with no resources", () => {
    const result = addMissingResourcesToUser(alfredUser, resources);

    const expected = {
        ...alfredUser,
        analyses: [
            {
                analysis_id: "07a3e96e-c21c-11ea-aa22-008cfa5ae621",
            },
        ],
        apps: [
            {
                app_id: "e54bfc1a-f811-11e8-8a14-008cfa5ae621",
                system_id: "de",
            },
        ],
        paths: [
            {
                path: "/iplant/home/aramsey/CORE-9077-path.list",
            },
            { path: "/iplant/home/aramsey/TestFolder" },
        ],
        tools: [
            {
                tool_id: "2609f8a8-e928-11e9-a2ea-008cfa5ae621",
            },
        ],
    };
    expect(result).toStrictEqual(expected);
});

/**
 * A user with some resources should have the original permissions set
 * on those resources, while the added resources should have no permissions
 * set
 */
it("tests adding missing resources to a user with some resources", () => {
    const user = {
        ...alfredUser,
        paths: [
            {
                path: "/iplant/home/aramsey/CORE-9077-path.list",
                permission: "read",
            },
            {
                path: "/iplant/home/aramsey/TestFolder",
                permission: "read",
            },
        ],
    };
    const result = addMissingResourcesToUser(user, resources);

    const expected = {
        ...alfredUser,
        analyses: [
            {
                analysis_id: "07a3e96e-c21c-11ea-aa22-008cfa5ae621",
            },
        ],
        apps: [
            {
                app_id: "e54bfc1a-f811-11e8-8a14-008cfa5ae621",
                system_id: "de",
            },
        ],
        paths: [
            {
                path: "/iplant/home/aramsey/CORE-9077-path.list",
                permission: "read",
            },
            {
                path: "/iplant/home/aramsey/TestFolder",
                permission: "read",
            },
        ],
        tools: [
            {
                tool_id: "2609f8a8-e928-11e9-a2ea-008cfa5ae621",
            },
        ],
    };
    expect(result).toStrictEqual(expected);
});

/**
 * A user who already has all resources should have no changes when trying to
 * add missing resources
 */
it("tests adding missing resources to a user with all resources", () => {
    const user = userMap["alfred"];
    const result = addMissingResourcesToUser(user, resources);

    expect(result).toStrictEqual(user);
});

it("tests sharing updates with no changes", () => {
    const user = {
        alfred: {
            ...alfredUser,
            displayPermission: "own",
            originalPermission: "own",
            apps: [
                {
                    app_id: "e54bfc1a-f811-11e8-8a14-008cfa5ae621",
                    permission: "own",
                    system_id: "de",
                },
            ],
        },
    };

    const sharing = getSharingUpdates(user);
    const unsharing = getSharingUpdates(userMap, userMap);

    const expectedSharing = {};
    const expectedUnsharing = {};
    expect(sharing).toStrictEqual(expectedSharing);
    expect(unsharing).toStrictEqual(expectedUnsharing);
});

it("tests sharing updates with data change", () => {
    const user = {
        alfred: {
            ...alfredUser,
            displayPermission: "own",
            originalPermission: "read",
            paths: [
                {
                    path: "/iplant/home/aramsey/CORE-9077-path.list",
                    permission: "read",
                },
            ],
        },
    };

    const sharingResult = getSharingUpdates(user);
    const unsharingResult = getUnsharingUpdates(user, {});

    const expectedSharing = {
        paths: [
            {
                paths: [
                    {
                        path: "/iplant/home/aramsey/CORE-9077-path.list",
                        permission: "own",
                    },
                ],
                user: "alfred",
            },
        ],
    };

    const expectedUnsharing = {
        paths: [
            {
                paths: ["/iplant/home/aramsey/CORE-9077-path.list"],
                user: "alfred",
            },
        ],
    };
    expect(sharingResult).toStrictEqual(expectedSharing);
    expect(unsharingResult).toStrictEqual(expectedUnsharing);
});

it("tests sharing updates with apps change", () => {
    const user = {
        alfred: {
            ...alfredUser,
            apps: [
                {
                    app_id: "e54bfc1a-f811-11e8-8a14-008cfa5ae621",
                    permission: "own",
                    system_id: "de",
                },
            ],
            displayPermission: "read",
            originalPermission: "own",
        },
    };

    const sharingResult = getSharingUpdates(user);
    const unsharingResult = getUnsharingUpdates(user, {});

    const expectedSharing = {
        apps: [
            {
                apps: [
                    {
                        app_id: "e54bfc1a-f811-11e8-8a14-008cfa5ae621",
                        permission: "read",
                        system_id: "de",
                    },
                ],
                subject: {
                    id: "alfred",
                    source_id: "ldap",
                },
            },
        ],
    };

    const expectedUnsharing = {
        apps: [
            {
                apps: [
                    {
                        app_id: "e54bfc1a-f811-11e8-8a14-008cfa5ae621",
                        system_id: "de",
                    },
                ],
                subject: {
                    id: "alfred",
                    source_id: "ldap",
                },
            },
        ],
    };
    expect(sharingResult).toStrictEqual(expectedSharing);
    expect(unsharingResult).toStrictEqual(expectedUnsharing);
});

it("tests sharing updates with analysis change", () => {
    const user = {
        alfred: {
            ...alfredUser,
            analyses: [
                {
                    analysis_id: "07a3e96e-c21c-11ea-aa22-008cfa5ae621",
                    permission: "own",
                },
            ],
            displayPermission: "read",
            originalPermission: "own",
        },
    };

    const sharingResult = getSharingUpdates(user);
    const unsharingResult = getUnsharingUpdates(user, {});

    const expectedSharing = {
        analyses: [
            {
                analyses: [
                    {
                        analysis_id: "07a3e96e-c21c-11ea-aa22-008cfa5ae621",
                        permission: "read",
                    },
                ],
                subject: {
                    id: "alfred",
                    source_id: "ldap",
                },
            },
        ],
    };

    const expectedUnsharing = {
        analyses: [
            {
                analyses: ["07a3e96e-c21c-11ea-aa22-008cfa5ae621"],
                subject: {
                    id: "alfred",
                    source_id: "ldap",
                },
            },
        ],
    };
    expect(sharingResult).toStrictEqual(expectedSharing);
    expect(unsharingResult).toStrictEqual(expectedUnsharing);
});

it("tests sharing updates with tools change", () => {
    const user = {
        alfred: {
            ...alfredUser,
            displayPermission: "read",
            originalPermission: "own",
            tools: [
                {
                    tool_id: "2609f8a8-e928-11e9-a2ea-008cfa5ae621",
                    permission: "own",
                },
            ],
        },
    };

    const sharingResult = getSharingUpdates(user);
    const unsharingResult = getUnsharingUpdates(user, {});

    const expectedSharing = {
        tools: [
            {
                tools: [
                    {
                        tool_id: "2609f8a8-e928-11e9-a2ea-008cfa5ae621",
                        permission: "read",
                    },
                ],
                subject: {
                    id: "alfred",
                    source_id: "ldap",
                },
            },
        ],
    };

    const expectedUnharing = {
        tools: [
            {
                tools: ["2609f8a8-e928-11e9-a2ea-008cfa5ae621"],
                subject: {
                    id: "alfred",
                    source_id: "ldap",
                },
            },
        ],
    };
    expect(sharingResult).toStrictEqual(expectedSharing);
    expect(unsharingResult).toStrictEqual(expectedUnharing);
});
