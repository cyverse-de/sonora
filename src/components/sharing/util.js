import { SharingPermissions } from "../models/Permissions";

// Returns whether the given user object (returned from user-info call) is a group
export const isGroup = (user) => {
    return user.source_id === "g:gsa";
};

// Returns the short group name for display
export const groupName = (subject) => {
    return subject.name.split(":").pop();
};

// Takes a list and returns a new list with only unique, non-empty values
const getUniqueList = (list) => {
    return list.filter(
        (item, index, self) => !!item && self.indexOf(item) === index
    );
};

// Takes a list of permission values (i.e. read, write, own) and returns
// what to display as their overall permission
const getDisplayPermission = (permissionList, resourceTotal) => {
    if (permissionList.length !== resourceTotal) {
        return SharingPermissions.VARIES;
    }
    const values = getUniqueList(permissionList);
    return values.length === 1 ? values[0] : SharingPermissions.VARIES;
};

// These are the keys to each permission-lister response object and correspond
// to each type of resource that can be shared in Sonora
export const TYPE = {
    DATA: "paths",
    APPS: "apps",
    ANALYSES: "analyses",
    TOOLS: "tools",
};

const allResourceTypes = [TYPE.DATA, TYPE.APPS, TYPE.ANALYSES, TYPE.TOOLS];

// Function for returning the response type based on the key in the `resp` obj
// The key should be one of those keys in TYPE
const getResponseType = (resp) => Object.keys(resp)[0];

/**
 * Helper functions for retrieving information across the different types of
 * permission-lister responses.
 *
 * A "sharing" is the object containing the resource information,
 * such as the resource id and name, plus an array of permissions for that
 * resource.
 *
 * A "permission" is the object containing the subject information
 * and the actual permission value that the subject has on a resource.
 *
 * A "user" is an object containing the details for a user returned from the user-info
 * service
 *
 * A "resource" is a resource object that the user has selected to share
 *
 * -idFn will return a resource's ID
 * -permListFn will return the list of permissions in the sharing object
 * -userIdFn will return a user's ID
 * -fmtSubjectFn will return the formatted user information meant for sending
 * to the sharing and unsharing endpoints
 * -fmtSharingFn will return the formatted resource information meant for sending
 * to the sharing endpoints
 * -fmtUnsharingFn will return the formatted resource information meant for
 * sending to the unsharing endpoints
 *
 * @param type
 */
export const getSharingFns = (type) => {
    switch (type) {
        case TYPE.DATA: {
            return {
                idFn: (sharing) => sharing.path,
                permListFn: (sharing) => sharing["user-permissions"],
                userIdFn: (permission) => permission.user,
                fmtSubjectFn: (user) => {
                    return {
                        user: user.id,
                    };
                },
                fmtSharingFn: (resource) => {
                    return {
                        path: resource.path,
                    };
                },
                fmtUnsharingFn: (resource) => resource.path,
            };
        }
        case TYPE.APPS: {
            return {
                idFn: (sharing) => sharing.app_id || sharing.id,
                permListFn: (sharing) => sharing.permissions,
                userIdFn: (permission) => permission.subject.id,
                fmtSubjectFn: (user) => {
                    return {
                        subject: {
                            source_id: user.source_id,
                            id: user.id,
                        },
                    };
                },
                fmtSharingFn: (resource) => {
                    return {
                        app_id: resource.id || resource.app_id,
                        system_id: resource.system_id,
                    };
                },
                fmtUnsharingFn: (resource) => {
                    return {
                        app_id: resource.id || resource.app_id,
                        system_id: resource.system_id,
                    };
                },
            };
        }
        case TYPE.ANALYSES: {
            return {
                idFn: (sharing) => sharing.id || sharing.analysis_id,
                permListFn: (sharing) => sharing.permissions,
                userIdFn: (permission) => permission.subject.id,
                fmtSubjectFn: (user) => {
                    return {
                        subject: {
                            source_id: user.source_id,
                            id: user.id,
                        },
                    };
                },
                fmtSharingFn: (resource) => {
                    return {
                        analysis_id: resource.id || resource.analysis_id,
                    };
                },
                fmtUnsharingFn: (resource) =>
                    resource.id || resource.analysis_id,
            };
        }
        case TYPE.TOOLS: {
            return {
                idFn: (sharing) => sharing.id || sharing.tool_id,
                permListFn: (sharing) => sharing.permissions,
                userIdFn: (permission) => permission.subject.id,
                fmtSubjectFn: (user) => {
                    return {
                        subject: {
                            source_id: user.source_id,
                            id: user.id,
                        },
                    };
                },
                fmtSharingFn: (resource) => {
                    return {
                        tool_id: resource.id || resource.tool_id,
                    };
                },
                fmtUnsharingFn: (resource) => resource.id || resource.tool_id,
            };
        }
        default:
            return null;
    }
};

// A user can have all or no resources.  Check for each resource type and
// return a list containing them all
const getUserResourceList = (user) => {
    return [
        ...(user[TYPE.DATA] || []),
        ...(user[TYPE.ANALYSES] || []),
        ...(user[TYPE.APPS] || []),
        ...(user[TYPE.TOOLS] || []),
    ];
};

const addDisplayPermissions = (userMap, resourceTotal) => {
    return Object.keys(userMap).reduce(
        (acc, userId) => {
            const user = acc[userId];
            const resources = getUserResourceList(user);

            const permissions = resources.map(
                (resource) => resource.permission
            );
            const displayPermission = getDisplayPermission(
                permissions,
                resourceTotal
            );
            return {
                ...acc,
                [userId]: {
                    ...user,
                    displayPermission,
                    originalPermission: displayPermission,
                },
            };
        },
        { ...userMap }
    );
};

/**
 * This will create a mapping where each key is a user ID.  The value is
 * the user's information from the user-info service with 3 things added:
 * - originalPermission: contains the original overall permission for the user
 *
 * - displayPermission: contains the current overall permission for the user.
 * If the user's permission gets updated in the sharing dialog, this value will
 * update.
 *
 * - paths, apps, analyses, tools keys for storing the array of resources the
 * user has or will have permissions on
 *
 * @param responses - permission-lister responses
 * @param userInfos
 * @param resourceTotal
 * @returns {{}}
 */
export const getUserMap = (responses, userInfos, resourceTotal) => {
    const userMap = responses.reduce((acc, resp) => {
        const type = getResponseType(resp);
        const { permListFn, userIdFn, fmtSharingFn } = getSharingFns(type);
        return resp[type].reduce(
            (shares, sharing) => {
                const permissions = permListFn(sharing);

                return permissions.reduce(
                    (userMap, permission) => {
                        const userId = userIdFn(permission);
                        const currentUser = {
                            ...(userMap[userId] || userInfos[userId]),
                        };
                        const permissionValue = permission.permission;

                        // Create an obj with the resource details and the user's
                        // current permission
                        const resourceWithPermission = {
                            ...fmtSharingFn(sharing),
                            permission: permissionValue,
                        };

                        const updatedUser = {
                            ...currentUser,
                            [type]: [
                                ...(currentUser[type] || []),
                                resourceWithPermission,
                            ],
                        };
                        return { ...userMap, [userId]: updatedUser };
                    },
                    { ...shares }
                );
            },
            { ...acc }
        );
    }, {});
    return addDisplayPermissions(userMap, resourceTotal);
};

// Takes a user and examines its paths, apps, analyses, and tools keys to compare
// against the resources list to find missing resources.  Adds the missing resources.
export const addMissingResourcesToUser = (user, resources) => {
    const currentResources = getUserResourceList(user);

    return Object.keys(resources).reduce(
        (acc, type) => {
            const { idFn, fmtSharingFn } = getSharingFns(type);
            return resources[type].reduce(
                (resources, resource) => {
                    const hasResource = currentResources.some(
                        (perm) => idFn(perm) === idFn(resource)
                    );
                    if (!hasResource) {
                        // Create new sharing object
                        const updatedSharing = fmtSharingFn(resource);

                        return {
                            ...resources,
                            [type]: [
                                ...(resources[type] || []),
                                updatedSharing,
                            ],
                        };
                    } else {
                        return { ...resources };
                    }
                },
                { ...acc }
            );
        },
        { ...user }
    );
};

// Takes as input an array of all the permission-lister responses and returns a
// list of each unique user ID found in those responses for the purpose
// of fetching their detailed info from the user-info service
export const getUserSet = (responses) => {
    //resource type
    const allUsers = responses.reduce((acc, resp) => {
        const type = getResponseType(resp);
        const { permListFn, userIdFn } = getSharingFns(type);
        // permission list
        const users = resp[type].reduce((currUsers, sharing) => {
            const permList = permListFn(sharing);
            return [...currUsers, ...permList.map((perm) => userIdFn(perm))];
        }, []);
        return [...acc, ...users];
    }, []);
    return getUniqueList(allUsers);
};

// Takes the resources provided from the bag and returns the total #
export const getResourceTotal = (resources) => {
    return Object.values(resources).reduce((acc, type) => {
        return acc + type.length;
    }, 0);
};

// Checks a response from the sharing endpoints and will find which resource
// type key exists and will return the values
export const getShareResponseValues = (resp) => {
    return (
        resp[TYPE.DATA] ||
        resp[TYPE.APPS] ||
        resp[TYPE.ANALYSES] ||
        resp[TYPE.TOOLS]
    );
};

/**
 * Takes the userMap returned from `groupByUser`, and returns all the
 * sharing requests that need to be sent out for each resource type.
 * Will return an object that looks like
 * `{paths: [updates], apps: [updates], analyses: [updates], tools: [updates]}`
 * @param userMap
 */
export const getSharingUpdates = (userMap) => {
    return Object.keys(userMap).reduce((acc, userId) => {
        const user = userMap[userId];
        const { originalPermission, displayPermission } = user;

        if (originalPermission !== displayPermission) {
            return allResourceTypes.reduce(
                (acc, type) => {
                    const resources = user[type];

                    if (resources && resources.length > 0) {
                        const { fmtSubjectFn } = getSharingFns(type);
                        const updates = resources.filter(
                            (resource) =>
                                displayPermission !== resource.permission
                        );

                        if (updates && updates.length > 0) {
                            const sharingReq = {
                                ...fmtSubjectFn(user),
                                [type]: updates.map((resource) => {
                                    return {
                                        ...resource,
                                        permission: displayPermission,
                                    };
                                }),
                            };
                            return {
                                ...acc,
                                [type]: [...(acc[type] || []), sharingReq],
                            };
                        } else {
                            return { ...acc };
                        }
                    } else {
                        return { ...acc };
                    }
                },
                { ...acc }
            );
        } else {
            return { ...acc };
        }
    }, {});
};

/**
 * Takes two userMaps (generated by `groupByUsers`) and finds which users
 * have been removed in order to create unsharing requests.
 * Will return an object that looks like
 * `{paths: [updates], apps: [updates], analyses: [updates], tools: [updates]}`
 * @param originalUsers - original userMap
 * @param userMap - updated userMap
 */
export const getUnsharingUpdates = (originalUsers, userMap) => {
    const currentUserIds = Object.keys(userMap);

    return Object.keys(originalUsers).reduce((acc, id) => {
        if (!currentUserIds.includes(id)) {
            const user = originalUsers[id];

            return allResourceTypes.reduce(
                (acc, type) => {
                    const resources = user[type];

                    if (resources && resources.length > 0) {
                        const { fmtSubjectFn, fmtUnsharingFn } = getSharingFns(
                            type
                        );
                        const subject = fmtSubjectFn(user);
                        const unshareReq = {
                            ...subject,
                            [type]: resources.map((resource) =>
                                fmtUnsharingFn(resource)
                            ),
                        };
                        return {
                            ...acc,
                            [type]: [...(acc[type] || []), unshareReq],
                        };
                    } else {
                        return { ...acc };
                    }
                },
                { ...acc }
            );
        } else {
            return { ...acc };
        }
    }, {});
};
