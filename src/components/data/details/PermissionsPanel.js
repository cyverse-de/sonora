/**
 * @author aramsey
 *
 * A component which shows the current permissions for a
 * data resource.  Also allows users to quickly modify the
 * current permissions.
 */

import React, { Fragment, useCallback, useEffect, useState } from "react";

import { build, getMessage } from "@cyverse-de/ui-lib";
import {
    Avatar,
    CircularProgress,
    Grid,
    List,
    ListSubheader,
    makeStyles,
    Typography,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

import Identity from "../Identity";
import ids from "../ids";
import callApi from "../../../common/callApi";
import { groupBy } from "../../../common/functions";
import styles from "../styles";
import PermissionSelector from "./PermissionSelector";
import Permissions from "../../models/Permissions";

const useStyles = makeStyles(styles);

function getAvatarLetters(permission) {
    return (
        permission.first_name[0].toUpperCase() +
        permission.last_name[0].toUpperCase()
    );
}

function sortPerms(permissions) {
    return permissions.sort((a, b) => {
        const first = a.last_name.toLowerCase();
        const second = b.last_name.toLowerCase();
        if (first < second) return -1;
        return first > second;
    });
}

function PermissionsTabPanel(props) {
    const classes = useStyles();
    const { baseId, resource, selfPermission } = props;

    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [permissionLoadingId, setPermissionLoadingId] = useState(null);

    const mergeUsersWithPerms = (permissions, userInfo) => {
        let merged = [];
        permissions.forEach((permission) => {
            // merge user info with permissions
            merged.push({
                ...permission,
                ...userInfo[permission.user],
            });
        });

        return merged;
    };

    // The permissions endpoint returns only the user ID and the permission value.
    // Fetch the rest of each user's details.
    // Without useCallback, useEffect thinks this function is constantly
    // updating and causes infinite re-renders
    const fetchUserInfo = useCallback((permissions) => {
        const users = new Set(permissions.map((item) => item.user));
        const userQuery = [...users].join("&username=");
        callApi({
            endpoint: `/api/user-info?username=${userQuery}`,
        }).then((userInfos) => {
            const mergedInfo = mergeUsersWithPerms(permissions, userInfos);
            setPermissions(mergedInfo);
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        const resourcePath = resource.path;
        setLoading(true);
        callApi({
            endpoint: "/api/filesystem/user-permissions",
            method: "POST",
            body: { paths: [resourcePath] },
        }).then((permissionResp) => {
            const permissions = permissionResp?.paths[0]["user-permissions"];
            if (permissions) {
                fetchUserInfo(permissions);
            } else {
                setPermissions([]);
                setLoading(false);
            }
        });
    }, [resource, fetchUserInfo]); // lint error without fetchUserInfo

    const onPermissionChange = (currentPermission, newPermissionValue) => {
        setPermissionLoadingId(currentPermission.user);
        const body = {
            sharing: [
                {
                    user: currentPermission.id,
                    paths: [
                        {
                            path: resource.path,
                            permission: newPermissionValue,
                        },
                    ],
                },
            ],
        };

        callApi({
            endpoint: "/api/share",
            method: "POST",
            body,
        }).then((resp) => {
            const userPerm = resp?.sharing?.find(
                (item) => item.user === currentPermission.user
            );
            const pathPerm = userPerm?.sharing?.find(
                (item) => item.path === resource.path
            );
            if (pathPerm.success) {
                const newPerms = [...permissions];
                const permIndex = permissions.findIndex(
                    (perm) => perm.user === currentPermission.user
                );
                newPerms[permIndex].permission = newPermissionValue;
                setPermissions(newPerms);
            }
            setPermissionLoadingId(null);
        });
    };

    if (loading) {
        const arrayRows = [...Array(10)];
        return (
            <Grid container spacing={1}>
                {arrayRows.map((el, index) => (
                    <Fragment key={index}>
                        <Grid item sm={6} xs={6}>
                            <Skeleton variant="text" />
                        </Grid>
                        <Grid item sm={6} xs={6}>
                            <Skeleton variant="text" />
                        </Grid>
                    </Fragment>
                ))}
            </Grid>
        );
    }

    const groupedPermissions = groupBy(
        sortPerms(permissions),
        (permission) => permission.permission
    );

    const getAvatarClass = (permissionValue) => {
        if (permissionValue === Permissions.OWN) {
            return classes.avatarOwn;
        }
        if (permissionValue === Permissions.WRITE) {
            return classes.avatarWrite;
        }
        return classes.avatarRead;
    };

    return (
        <>
            <Typography id={build(baseId, ids.SELF_PERMISSION)}>
                {getMessage("selfPermission", {
                    values: { permission: selfPermission },
                })}
            </Typography>

            <List
                className={classes.list}
                id={build(baseId, ids.PERMISSION_LIST)}
            >
                {Object.values(Permissions).map((permissionValue, index) => (
                    <Fragment key={index}>
                        <ListSubheader>
                            {permissionValue} (
                            {groupedPermissions[permissionValue]?.length || 0})
                        </ListSubheader>
                        {groupedPermissions &&
                            groupedPermissions[
                                permissionValue
                            ]?.map((permission, index) => (
                                <Identity
                                    id={build(
                                        baseId,
                                        ids.PERMISSION_LIST,
                                        permission.user
                                    )}
                                    key={index}
                                    primaryText={permission.name}
                                    secondaryText={
                                        permission.institution
                                            ? permission.institution
                                            : permission.description
                                    }
                                    secondaryAction={
                                        <>
                                            {permissionLoadingId ===
                                            permission.user ? (
                                                <CircularProgress
                                                    color="inherit"
                                                    size={20}
                                                />
                                            ) : (
                                                <PermissionSelector
                                                    baseId={build(
                                                        baseId,
                                                        ids.PERMISSION_LIST,
                                                        permission.user
                                                    )}
                                                    currentPermission={
                                                        permission.permission
                                                    }
                                                    onPermissionChange={(
                                                        updatedPermissionValue
                                                    ) =>
                                                        onPermissionChange(
                                                            permission,
                                                            updatedPermissionValue
                                                        )
                                                    }
                                                />
                                            )}
                                        </>
                                    }
                                    avatar={
                                        <Avatar
                                            className={getAvatarClass(
                                                permissionValue
                                            )}
                                        >
                                            {getAvatarLetters(permission)}
                                        </Avatar>
                                    }
                                />
                            ))}
                    </Fragment>
                ))}
            </List>
        </>
    );
}

export default PermissionsTabPanel;
