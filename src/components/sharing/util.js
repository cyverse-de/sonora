import {
    Apps,
    Assessment as AnalysisIcon,
    Build as ToolIcon,
    InsertDriveFileOutlined as FileIcon,
} from "@material-ui/icons";
import React from "react";
import { groupBy } from "../../common/functions";
import { SharingPermissions } from "../models/Permissions";
import { parseNameFromPath } from "../data/utils";

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
const getDisplayPermission = (permissionList) => {
    const values = getUniqueList(permissionList);
    return values.length === 1 ? values[0] : SharingPermissions.VARIES;
};

// These are the keys to each permission-lister response object and correspond
// to each type of resource that can be shared in Sonora
const TYPE = {
    DATA: "paths",
    APPS: "apps",
    ANALYSES: "analyses",
    TOOLS: "tools",
};

// Function for returning the response type based on the key in the `resp` obj
// The key should be one of those keys in TYPE
const getResponseType = (resp) => Object.keys(resp)[0];

/**
 * Helper functions for retrieving information across the different types of
 * permission-lister responses.
 * For these functions, "sharing" is the object containing the resource information,
 * such as the resource id and name, plus an array of permissions for that
 * resource.
 * A "permission" is the object containing the subject information
 * and the actual permission value that the subject has on a resource.
 *
 * e.g.
 * sharing = {
 *     system_id: "de",
 *     app_id: "e54bfc1a-f811-11e8-8a14-008cfa5ae621",
 *     name: "JupJup",
 *     permissions: [permission1, permission2...]
 * }
 * permission = {
 *     subject: {
 *         source_id: "ldap",
 *         id: "alfred",
 *     },
 *     permission: "read",
 * }
 *
 * @param type
 */
export const getSharingFns = (type) => {
    switch (type) {
        case TYPE.DATA: {
            return {
                idKey: "path",
                idFn: (sharing) => sharing.path,
                permListKey: "user-permissions",
                permListFn: (sharing) => sharing["user-permissions"],
                userIdFn: (permission) => permission.user,
                labelFn: (sharing) => parseNameFromPath(sharing.path),
                icon: <FileIcon />,
            };
        }
        case TYPE.APPS: {
            return {
                idKey: "app_id",
                idFn: (sharing) => sharing.app_id,
                permListKey: "permissions",
                permListFn: (sharing) => sharing.permissions,
                userIdFn: (permission) => permission.subject.id,
                labelFn: (sharing) => sharing.name,
                icon: <Apps />,
            };
        }
        case TYPE.ANALYSES: {
            return {
                idKey: "id",
                idFn: (sharing) => sharing.id,
                permListKey: "permissions",
                permListFn: (sharing) => sharing.permissions,
                userIdFn: (permission) => permission.subject.id,
                labelFn: (sharing) => sharing.name,
                icon: <AnalysisIcon />,
            };
        }
        case TYPE.TOOLS: {
            return {
                idKey: "id",
                idFn: (sharing) => sharing.id,
                permListKey: "permissions",
                permListFn: (sharing) => sharing.permissions,
                userIdFn: (permission) => permission.subject.id,
                labelFn: (sharing) => sharing.name,
                icon: <ToolIcon />,
            };
        }
        default:
            return {
                idKey: "id",
                idFn: (sharing) => sharing.id,
                permListKey: "permissions",
                permListFn: (sharing) => sharing.permissions,
                userIdFn: (permission) => permission.subject.id,
                labelFn: (sharing) => sharing.name,
                icon: null,
            };
    }
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
 * - resources: a list of all the resources the user has or will have permission
 * on
 *
 * @param responses - permission-lister responses
 * @param userInfos
 * @returns {{}}
 */
export const getUserMap = (responses, userInfos) => {
    return responses.reduce((acc, resp) => {
        const type = getResponseType(resp);
        const { permListFn, userIdFn, permListKey } = getSharingFns(type);
        return resp[type].reduce(
            (shares, sharing) => {
                const permissions = permListFn(sharing);

                return permissions.reduce(
                    (userMap, permission) => {
                        const userId = userIdFn(permission);
                        const permissionValue = permission.permission;

                        // Create an obj with the resource details and the user's
                        // current permission
                        const resourceWithPermission = {
                            ...sharing,
                            type,
                            permission: permissionValue,
                        };
                        // Remove the old permission list which included other users
                        delete resourceWithPermission[permListKey];

                        // Add/Update the display permission
                        const currentUser = {
                            ...(userMap[userId] || userInfos[userId]),
                        };

                        const displayPermission = getDisplayPermission([
                            currentUser["displayPermission"],
                            permissionValue,
                        ]);

                        const updatedUser = {
                            ...currentUser,
                            displayPermission,
                            originalPermission: displayPermission,
                            resources: [
                                ...(currentUser["resources"] || []),
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
};

// Takes an array of permission-lister response objects and returns one object
// where the keys are the different response types e.g. TYPE.DATA, TYPE.APPS...
export const getResourceMap = (responses) => {
    return responses.reduce((acc, resp) => {
        const type = getResponseType(resp);
        return {
            ...acc,
            [type]: resp[type],
        };
    });
};

// Takes a user and examines its resource key to compare against the
// resourceMap to find missing resources.  Adds the missing resources.
export const addMissingResourcesToUser = (user, resourceMap) => {
    const currentResources = user.resources || [];

    const updatedResources = Object.keys(resourceMap).reduce(
        (acc, type) => {
            const { idKey, permListKey } = getSharingFns(type);
            return resourceMap[type].reduce(
                (shares, sharing) => {
                    const hasResource = acc.some(
                        (perm) => perm[idKey] === sharing[idKey]
                    );
                    if (!hasResource) {
                        // Create new sharing object
                        const updatedSharing = {
                            ...sharing,
                            type,
                        };
                        // Remove the old permission list which included other users
                        delete updatedSharing[permListKey];

                        return [...shares, updatedSharing];
                    } else {
                        return [...shares];
                    }
                },
                [...acc]
            );
        },
        [...currentResources]
    );
    return { ...user, resources: updatedResources };
};

// Takes as input an array of all the permission-lister responses and returns a
// list of each unique user ID found in those responses for the purpose
// of fetching their detailed info from the user-info service
export const getUserSet = (responses) => {
    //resource type
    return responses.reduce((acc, resp) => {
        const type = getResponseType(resp);
        const { permListFn, userIdFn } = getSharingFns(type);
        // permission list
        const users = resp[type].reduce((currUsers, sharing) => {
            const permList = permListFn(sharing);
            return [...currUsers, ...permList.map((perm) => userIdFn(perm))];
        }, []);
        return getUniqueList([...acc, ...users]);
    }, []);
};

// Takes the resourceMap returned by `groupByResource` and returns
// the total number of resources
export const getResourceTotal = (resourceMap) => {
    return Object.values(resourceMap).reduce((acc, type) => {
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

// Takes the userMap returned from `groupByUser`, and returns all the
// sharing requests that need to be sent out for each resource type
export const getSharingUpdates = (userMap) => {
    const shares = Object.keys(userMap).reduce((acc, userId) => {
        const {
            originalPermission,
            displayPermission,
            resources,
            ...sharing
        } = userMap[userId];
        if (originalPermission !== displayPermission) {
            // Get the mismatching permissions for what needs to be updated
            const updates = resources.filter(
                (resource) => displayPermission !== resource.permission
            );

            // Group the permissions by type for sending to different
            // endpoints. Update the permission to the display permission
            const updatesByType = groupBy(
                updates,
                (perm) => perm.type,
                (perm) => {
                    return { ...perm, permission: displayPermission };
                }
            );
            return {
                ...acc,
                [userId]: { ...updatesByType, subject: sharing },
            };
        } else {
            return { ...acc };
        }
    }, {});
    return getSharingRequests(true, shares);
};

// Takes the userMap returned from `groupByUser` and compares it against the
// list of original users, then creates all of the unsharing requests that
// need to be sent, by resource type
export const getUnsharingUpdates = (originalUsers, userMap) => {
    const unshareUpdates = Object.keys(originalUsers).reduce((acc, id) => {
        const currentUserIds = Object.keys(userMap);
        if (!currentUserIds.includes(id)) {
            const resources = originalUsers[id]["resources"];
            // Group the permissions by type for sending to different
            // endpoints
            const newSharesMap = groupBy(
                resources,
                (permission) => permission.type
            );
            return {
                ...acc,
                [id]: {
                    ...newSharesMap,
                    subject: { ...originalUsers[id] },
                },
            };
        } else {
            return { ...acc };
        }
    }, {});
    return getSharingRequests(false, unshareUpdates);
};

// Takes a map of users with their sharing/unsharing updates and
// returns the formatted sharing requests
const getSharingRequests = (isSharing, shareUpdatesMap) => {
    let dataShares = [];
    let appShares = [];
    let analysisShares = [];
    let toolShares = [];
    Object.keys(shareUpdatesMap).forEach((userId) => {
        const userUpdates = shareUpdatesMap[userId];
        Object.keys(userUpdates).forEach((type) => {
            switch (type) {
                case TYPE.DATA: {
                    dataShares.push({
                        user: userUpdates.subject.id,
                        paths: userUpdates.paths.map((path) => {
                            return isSharing
                                ? {
                                      path: path.path,
                                      permission: path.permission,
                                  }
                                : path.path;
                        }),
                    });
                    return;
                }
                case TYPE.APPS: {
                    appShares.push({
                        subject: {
                            source_id: userUpdates.subject.source_id,
                            id: userUpdates.subject.id,
                        },
                        apps: userUpdates.apps.map((app) => {
                            return {
                                app_id: app.app_id,
                                system_id: app.system_id,
                                ...(isSharing && {
                                    permission: app.permission,
                                }),
                            };
                        }),
                    });
                    return;
                }
                case TYPE.ANALYSES: {
                    analysisShares.push({
                        subject: {
                            source_id: userUpdates.subject.source_id,
                            id: userUpdates.subject.id,
                        },
                        analyses: userUpdates.analyses.map((analysis) => {
                            return isSharing
                                ? {
                                      analysis_id: analysis.id,
                                      permission: analysis.permission,
                                  }
                                : analysis.id;
                        }),
                    });
                    return;
                }
                case TYPE.TOOLS: {
                    toolShares.push({
                        subject: {
                            source_id: userUpdates.subject.source_id,
                            id: userUpdates.subject.id,
                        },
                        tools: userUpdates.tools.map((tool) => {
                            return isSharing
                                ? {
                                      tool_id: tool.id,
                                      permission: tool.permission,
                                  }
                                : tool.id;
                        }),
                    });

                    return;
                }
                default: {
                    return;
                }
            }
        });
    });
    return {
        data: dataShares,
        apps: appShares,
        analyses: analysisShares,
        tools: toolShares,
    };
};
