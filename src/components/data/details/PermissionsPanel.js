/**
 * @author aramsey
 *
 * A component which shows the current permissions for a
 * data resource.  Also allows users to quickly modify the
 * current permissions.
 */

import React, { Fragment, useState, useEffect } from "react";

import buildID from "components/utils/DebugIDUtil";
import {
    Avatar,
    CircularProgress,
    Grid,
    List,
    ListSubheader,
    Typography,
} from "@mui/material";
import { makeStyles } from "tss-react/mui";
import { Skeleton } from "@mui/material";
import { useTranslation } from "i18n";
import { useMutation, useQuery } from "react-query";

import Identity from "../Identity";
import ids from "../ids";
import { groupBy } from "common/functions";
import styles from "../styles";
import PermissionSelector from "./PermissionSelector";
import Permissions from "components/models/Permissions";
import {
    getResourcePermissions,
    USER_INFO_QUERY_KEY,
    RESOURCE_PERMISSIONS_KEY,
} from "serviceFacades/filesystem";
import { dataSharing } from "serviceFacades/sharing";
import isQueryLoading from "components/utils/isQueryLoading";
import { getUserInfo } from "serviceFacades/users";
import ErrorTypography from "components/error/ErrorTypography";
import DEErrorDialog from "components/error/DEErrorDialog";
import { getUserPrimaryText, getUserSecondaryText } from "../../sharing/util";

const useStyles = makeStyles()(styles);

function getAvatarLetters(permission) {
    const firstName = permission.first_name || permission.id;
    const lastName = permission.last_name;
    let letters = [];

    firstName &&
        firstName.length > 0 &&
        letters.push(firstName[0].toUpperCase());
    lastName && lastName.length > 0 && letters.push(lastName[0].toUpperCase());
    return letters.join("");
}

function sortPerms(permissions) {
    return permissions.sort((a, b) => {
        const first = a?.last_name?.toLowerCase();
        const second = b?.last_name?.toLowerCase();
        if (first < second) return -1;
        return first > second;
    });
}

function PermissionsTabPanel(props) {
    const { classes } = useStyles();
    const { baseId, resource, selfPermission } = props;
    const { t } = useTranslation("data");
    const [fetchUserInfoKey, setFetchUserInfoKey] =
        useState(USER_INFO_QUERY_KEY);
    const [fetchUserInfoQueryEnabled, setFetchUserInfoQueryEnabled] =
        useState(false);

    const [fetchResourcePermissionsKey, setFetchResourcePermissionsKey] =
        useState(RESOURCE_PERMISSIONS_KEY);
    const [
        fetchResourcePermissionsQueryEnabled,
        setFetchResourcePermissionsQueryEnabled,
    ] = useState(false);

    const [userlessPermissions, setUserlessPermissions] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [permissionLoadingIds, setPermissionLoadingIds] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const [errorObject, setErrorObject] = useState(null);
    const resourcePath = resource.path;

    useEffect(() => {
        if (selfPermission && selfPermission === Permissions.OWN) {
            // Only users with `own` permission can list permissions
            setFetchResourcePermissionsKey([
                RESOURCE_PERMISSIONS_KEY,
                { paths: [resourcePath] },
            ]);

            setFetchResourcePermissionsQueryEnabled(true);
        }
    }, [resourcePath, selfPermission]);

    const mergeUsersWithPerms = (permissions, userInfo) => {
        let merged = [];
        permissions.forEach((permission) => {
            // merge user info with permissions
            merged.push({
                ...permission,
                ...(userInfo[permission.user] || { id: permission.user }),
            });
        });

        return merged;
    };

    const { isFetching: fetchUserInfoStatus } = useQuery({
        queryKey: fetchUserInfoKey,
        queryFn: () => getUserInfo(fetchUserInfoKey[1]),
        enabled: fetchUserInfoQueryEnabled,
        onSuccess: (userInfos) => {
            const mergedInfo = mergeUsersWithPerms(
                userlessPermissions,
                userInfos
            );
            setPermissions(mergedInfo);
            setFetchUserInfoQueryEnabled(false);
        },
        onError: (e) => {
            setErrorMessage(t("fetchPermissionsError"));
            setErrorObject(e);
        },
    });

    const { isFetching: fetchResourcePermissionsStatus } = useQuery({
        queryKey: fetchResourcePermissionsKey,
        queryFn: () => getResourcePermissions(fetchResourcePermissionsKey[1]),
        enabled: fetchResourcePermissionsQueryEnabled,
        onSuccess: (permissionResp) => {
            const userlessPermissions =
                permissionResp?.paths[0]["user-permissions"];
            if (userlessPermissions && userlessPermissions.length > 0) {
                const userIds = new Set(
                    userlessPermissions.map((item) => item.user)
                );
                setUserlessPermissions(userlessPermissions);
                setFetchUserInfoKey([
                    USER_INFO_QUERY_KEY,
                    { userIds: [...userIds] },
                ]);
                setFetchUserInfoQueryEnabled(true);
            } else {
                setPermissions([]);
            }
            setFetchResourcePermissionsQueryEnabled(false);
        },
        onError: (e) => {
            setErrorMessage(t("fetchPermissionsError"));
            setErrorObject(e);
        },
    });

    const { mutate: updatePermissions } = useMutation(dataSharing, {
        onSuccess: (resp, { currentPermission, newPermissionValue }) => {
            const userPerm = resp?.sharing?.find(
                (item) => item.user === currentPermission.user
            );
            const pathPerm = userPerm?.sharing?.find(
                (item) => item.path === resource.path
            );
            if (pathPerm?.success) {
                const newPerms = [...permissions];
                const permIndex = permissions.findIndex(
                    (perm) => perm.user === currentPermission.user
                );
                newPerms[permIndex].permission = newPermissionValue;
                setPermissions(newPerms);
            }

            setPermissionLoadingIds((prevLoadingIds) =>
                prevLoadingIds.filter((id) => id !== currentPermission.id)
            );
        },
        onError: (e) => {
            t("updatePermissionsError");
            setErrorObject(e);
        },
    });

    const onPermissionChange = (currentPermission, newPermissionValue) => {
        setPermissionLoadingIds((prevLoadingIds) => [
            ...prevLoadingIds,
            currentPermission.user,
        ]);

        const sharingReq = {
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

        updatePermissions({
            sharingReq,
            currentPermission,
            newPermissionValue,
        });
    };

    const loading = isQueryLoading([
        fetchResourcePermissionsStatus,
        fetchUserInfoStatus,
    ]);

    if (loading) {
        const arrayRows = [...Array(10)];
        return (
            <Grid
                id={buildID(baseId, ids.LOADING_SKELETON)}
                container
                spacing={1}
            >
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
            <Typography id={buildID(baseId, ids.SELF_PERMISSION)}>
                {t("selfPermission", { permission: selfPermission })}
            </Typography>
            {selfPermission === Permissions.OWN && (
                <List
                    className={classes.permissionsList}
                    id={buildID(baseId, ids.PERMISSION_LIST)}
                >
                    {Object.values(Permissions).map(
                        (permissionValue, index) => (
                            <Fragment key={index}>
                                <ListSubheader>
                                    {permissionValue} (
                                    {groupedPermissions[permissionValue]
                                        ?.length || 0}
                                    )
                                </ListSubheader>
                                {groupedPermissions &&
                                    groupedPermissions[permissionValue]?.map(
                                        (permission, index) => (
                                            <Identity
                                                id={buildID(
                                                    baseId,
                                                    ids.PERMISSION_LIST,
                                                    permission.user
                                                )}
                                                key={index}
                                                primaryText={getUserPrimaryText(
                                                    permission
                                                )}
                                                secondaryText={getUserSecondaryText(
                                                    permission
                                                )}
                                                secondaryAction={
                                                    <>
                                                        {permissionLoadingIds.includes(
                                                            permission.user
                                                        ) ? (
                                                            <CircularProgress
                                                                color="inherit"
                                                                size={20}
                                                            />
                                                        ) : (
                                                            <PermissionSelector
                                                                baseId={buildID(
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
                                                        {getAvatarLetters(
                                                            permission
                                                        )}
                                                    </Avatar>
                                                }
                                            />
                                        )
                                    )}
                            </Fragment>
                        )
                    )}
                </List>
            )}
            {errorMessage && (
                <ErrorTypography
                    errorMessage={errorMessage}
                    onDetailsClick={() => setErrorDialogOpen(true)}
                />
            )}
            <DEErrorDialog
                open={errorDialogOpen}
                baseId={baseId}
                errorObject={errorObject}
                handleClose={() => {
                    setErrorDialogOpen(false);
                }}
            />
        </>
    );
}

export default PermissionsTabPanel;
