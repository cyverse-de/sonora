/**
 * @author aramsey
 *
 * A component which shows the current permissions for a
 * data resource.  Also allows users to quickly modify the
 * current permissions.
 */

import React, { Fragment, useState } from "react";

import { build, formatMessage, getMessage, withI18N } from "@cyverse-de/ui-lib";
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
import { injectIntl } from "react-intl";
import { useMutation, useQuery } from "react-query";

import Identity from "../Identity";
import ids from "../ids";
import { groupBy } from "../../../common/functions";
import styles from "../styles";
import PermissionSelector from "./PermissionSelector";
import Permissions from "../../models/Permissions";
import {
    getResourcePermissions,
    USER_INFO_QUERY_KEY,
    RESOURCE_PERMISSIONS_KEY,
} from "../../../serviceFacades/filesystem";
import { updateSharing } from "../../../serviceFacades/sharing";
import messages from "../messages";
import isQueryLoading from "../../utils/isQueryLoading";
import { getUserInfo } from "../../../serviceFacades/users";
import ErrorTypography from "../../utils/error/ErrorTypography";
import DEErrorDialog from "../../utils/error/DEErrorDialog";

const useStyles = makeStyles(styles);

function getAvatarLetters(permission) {
    const firstName = permission.first_name;
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
    const classes = useStyles();
    const { baseId, resource, selfPermission, intl } = props;
    const [fetchUserInfoKey, setFetchUserInfoKey] = useState(
        USER_INFO_QUERY_KEY
    );
    const [userlessPermissions, setUserlessPermissions] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [permissionLoadingIds, setPermissionLoadingIds] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const [errorObject, setErrorObject] = useState(null);
    const resourcePath = resource.path;

    let fetchResourcePermissionsKey = RESOURCE_PERMISSIONS_KEY;
    let fetchResourcePermissionsQueryEnabled = false;

    if (selfPermission && selfPermission === Permissions.OWN) {
        // Only users with `own` permission can list permissions
        fetchResourcePermissionsKey = [
            RESOURCE_PERMISSIONS_KEY,
            { paths: [resourcePath] },
        ];

        fetchResourcePermissionsQueryEnabled = true;
    }

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

    const { status: fetchUserInfoStatus } = useQuery({
        queryKey: fetchUserInfoKey,
        queryFn: getUserInfo,
        config: {
            enabled: false,
            onSuccess: (userInfos) => {
                const mergedInfo = mergeUsersWithPerms(
                    userlessPermissions,
                    userInfos
                );
                setPermissions(mergedInfo);
                setFetchUserInfoKey(null);
            },
            onError: (e) => {
                setErrorMessage(formatMessage(intl, "fetchPermissionsError"));
                setErrorObject(e);
            },
        },
    });

    const { status: fetchResourcePermissionsStatus } = useQuery({
        queryKey: fetchResourcePermissionsKey,
        queryFn: getResourcePermissions,
        config: {
            enabled: fetchResourcePermissionsQueryEnabled,
            onSuccess: (permissionResp) => {
                const userlessPermissions =
                    permissionResp?.paths[0]["user-permissions"];
                if (userlessPermissions && userlessPermissions.length > 0) {
                    const userIds = new Set(
                        userlessPermissions.map((item) => item.user)
                    );
                    setUserlessPermissions(userlessPermissions);
                    setFetchUserInfoKey({ userIds: [...userIds] });
                } else {
                    setPermissions([]);
                }
            },
            onError: (e) => {
                setErrorMessage(formatMessage(intl, "fetchPermissionsError"));
                setErrorObject(e);
            },
        },
    });

    const [updatePermissions] = useMutation(updateSharing, {
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
            formatMessage(intl, "updatePermissionsError");
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
                id={build(baseId, ids.LOADING_SKELETON)}
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
            <Typography id={build(baseId, ids.SELF_PERMISSION)}>
                {getMessage("selfPermission", {
                    values: { permission: selfPermission },
                })}
            </Typography>
            {fetchResourcePermissionsKey && (
                <List
                    className={classes.permissionsList}
                    id={build(baseId, ids.PERMISSION_LIST)}
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
                                                    {permissionLoadingIds.includes(
                                                        permission.user
                                                    ) ? (
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
                                                    {getAvatarLetters(
                                                        permission
                                                    )}
                                                </Avatar>
                                            }
                                        />
                                    ))}
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

export default withI18N(injectIntl(PermissionsTabPanel), messages);
