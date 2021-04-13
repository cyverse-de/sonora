/**
 * @author aramsey
 *
 * A dialog that accepts a collection of different resources and allows users
 * to modify with whom those resources are shared
 */

import React, { useEffect, useState } from "react";

import { announce, AnnouncerConstants, build } from "@cyverse-de/ui-lib";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    IconButton,
    List,
    makeStyles,
    Typography,
    useMediaQuery,
    useTheme,
} from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { useMutation, useQuery } from "react-query";

import {
    addMissingResourcesToUser,
    getResourceTotal,
    getShareResponseValues,
    getSharingUpdates,
    getUnsharingUpdates,
    getUserMap,
    getUserSet,
    isGroup,
} from "./util";
import { TYPE } from "./constants";
import { getUserInfo } from "serviceFacades/users";
import { USER_INFO_QUERY_KEY } from "serviceFacades/filesystem";
import isQueryLoading from "components/utils/isQueryLoading";
import GridLoading from "components/utils/GridLoading";
import ids from "./ids";
import SharedItem from "./SharedItem";
import SubjectSearchField from "./SubjectSearchField";
import { useUserProfile } from "contexts/userProfile";
import { useTranslation } from "i18n";
import Permissions from "components/models/Permissions";
import {
    doSharingUpdates,
    GET_PERMISSIONS_QUERY_KEY,
    getPermissions,
} from "serviceFacades/sharing";
import styles from "./styles";
import UserTable from "./UserTable";
import ErrorTypography from "components/utils/error/ErrorTypography";
import DEErrorDialog from "components/utils/error/DEErrorDialog";

const useStyles = makeStyles(styles);

function Sharing(props) {
    const { open, onClose, resources } = props;

    const [permissions, setPermissions] = useState([]);
    const [originalUsers, setOriginalUsers] = useState({});
    const [userIdList, setUserIdList] = useState([]);
    const [hasData, setHasData] = useState(false);
    const [userMap, setUserMap] = useState({});
    const [resourceTotal, setResourceTotal] = useState(0);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const [errorDetails, setErrorDetails] = useState(null);
    const [userProfile] = useUserProfile();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const { t: tCommon } = useTranslation("common");
    const { t: tSharing } = useTranslation("sharing");
    const classes = useStyles();
    const baseId = ids.DIALOG;

    const { isFetching: fetchPermissions } = useQuery({
        queryKey: [GET_PERMISSIONS_QUERY_KEY, { resources }],
        queryFn: getPermissions,
        config: {
            enabled: open && resources !== null,
            onSuccess: (results) => {
                setPermissions(results);
                setUserIdList(getUserSet(results));
            },
            onError: (error) => {
                setErrorDetails({
                    message: tSharing("fetchPermissionsError"),
                    error,
                });
            },
        },
    });

    const { isFetching: fetchUserInfo } = useQuery({
        queryKey: [USER_INFO_QUERY_KEY, { userIds: userIdList }],
        queryFn: getUserInfo,
        config: {
            enabled: userIdList && userIdList.length > 0,
            onSuccess: (results) => {
                const userMap = getUserMap(permissions, results, resourceTotal);

                setUserMap(userMap);
                setOriginalUsers(userMap);
            },
            onError: (error) => {
                setErrorDetails({
                    message: tSharing("fetchUserInfoError"),
                    error,
                });
            },
        },
    });

    useEffect(() => {
        if (resources) {
            const data = resources[TYPE.DATA];
            const analyses = resources[TYPE.ANALYSES];
            setHasData(
                (data && data.length > 0) || (analyses && analyses.length > 0)
            );
            setResourceTotal(getResourceTotal(resources));
        }
    }, [resources]);

    const addUser = (user, onUserAdded) => {
        onUserAdded();
        const id = user.id;
        const updatedUser = addMissingResourcesToUser(user, resources);
        setUserMap({
            ...userMap,
            [id]: { ...updatedUser, displayPermission: Permissions.READ },
        });
    };

    const onPermissionChange = (user, permission) => {
        setErrorDetails(null);
        const userId = user.id;

        // Cannot update permissions for groups if data (which also means
        // analyses) are included
        if (isGroup(user) && hasData) {
            announce({
                text: tSharing("dataGroupSharingDisabled"),
                variant: AnnouncerConstants.INFO,
            });
            return;
        }

        // Add any missing resources to the users resources list
        const updatedUser = addMissingResourcesToUser(user, resources);

        // Update the userMap so the user has the new display permission
        setUserMap({
            ...userMap,
            [userId]: { ...updatedUser, displayPermission: permission },
        });
    };

    const onUserSelected = (user, onUserAdded) => {
        const userExist = userMap[user.id];
        const isSelf = user.id === userProfile.id;
        isSelf
            ? setErrorDetails({
                  message: tSharing("cannotAddSelf"),
              })
            : userExist
            ? setErrorDetails({
                  message: tSharing("userAlreadyAdded"),
              })
            : isGroup(user) && hasData
            ? setErrorDetails({
                  message: tSharing("dataGroupSharingDisabled"),
              })
            : addUser(user, onUserAdded);
    };

    const onRemoveUser = (user) => {
        setErrorDetails(null);
        const updated = { ...userMap };
        delete updated[user.id];

        setUserMap(updated);
    };

    const handleClose = () => {
        setPermissions([]);
        setUserMap({});
        setOriginalUsers({});
        setUserIdList([]);
        setErrorDetails(null);

        onClose();
    };

    const [sendSharingUpdates, { isLoading: isSaving }] = useMutation(
        doSharingUpdates,
        {
            onSuccess: (results) => {
                let failures = [];
                results.forEach((type) => {
                    const sharing =
                        type.sharing || type.unshare || type.unsharing;
                    sharing.forEach((shares) => {
                        const updates = getShareResponseValues(shares);
                        const successFalse = updates.filter(
                            (update) => update.success === false
                        );
                        if (successFalse && successFalse.length > 0) {
                            failures.push(...successFalse);
                        }
                    });
                });
                if (failures.length > 0) {
                    setErrorDetails({
                        message: tSharing("sharingUnsuccessful"),
                        error: failures,
                    });
                } else {
                    handleClose();
                }
            },
            onError: (error) => {
                setErrorDetails({
                    message: tSharing("sharingError"),
                    error,
                });
            },
        }
    );

    const onSave = () => {
        const sharing = getSharingUpdates(userMap);
        const unsharing = getUnsharingUpdates(originalUsers, userMap);
        sendSharingUpdates({ sharing, unsharing });
    };

    const isLoading = isQueryLoading([
        fetchUserInfo,
        fetchPermissions,
        isSaving,
    ]);

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="lg"
            fullWidth
            fullScreen={isMobile}
            id={baseId}
        >
            <DialogTitle id={build(baseId, ids.TITLE_BAR)}>
                {tSharing("sharing")}
                <IconButton
                    aria-label={tCommon("cancel")}
                    onClick={handleClose}
                    size="small"
                    classes={{ root: classes.closeButton }}
                    id={build(baseId, ids.TITLE_BAR, ids.BUTTONS.CANCEL)}
                >
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                {isLoading && (
                    <GridLoading
                        rows={5}
                        baseId={build(ids.DIALOG, ids.LOADING)}
                    />
                )}
                {!isLoading && (
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <SubjectSearchField
                                baseId={build(ids.DIALOG, ids.SEARCH_FIELD)}
                                onUserSelected={onUserSelected}
                                onSearchStart={() => setErrorDetails(null)}
                            />
                            {errorDetails && (
                                <>
                                    <ErrorTypography
                                        errorMessage={errorDetails.message}
                                        onDetailsClick={
                                            errorDetails.error
                                                ? () => setErrorDialogOpen(true)
                                                : null
                                        }
                                    />
                                    <DEErrorDialog
                                        open={errorDialogOpen}
                                        baseId={baseId}
                                        errorObject={errorDetails.error}
                                        handleClose={() => {
                                            setErrorDialogOpen(false);
                                        }}
                                    />
                                </>
                            )}
                        </Grid>
                        <Grid item sm={12} md={6} zeroMinWidth>
                            <>
                                <Typography>
                                    {tSharing("sharingAccess")}
                                </Typography>
                                {userMap && (
                                    <UserTable
                                        baseId={baseId}
                                        userMap={userMap}
                                        onPermissionChange={onPermissionChange}
                                        onRemoveUser={onRemoveUser}
                                    />
                                )}
                            </>
                        </Grid>
                        <Grid
                            item
                            sm={12}
                            md={1}
                            classes={{ root: !isMobile && classes.dividerGrid }}
                        >
                            <Divider
                                orientation={
                                    isMobile ? "horizontal" : "vertical"
                                }
                            />
                        </Grid>
                        <Grid item sm={12} md={5} zeroMinWidth>
                            <Typography>{tSharing("resources")}</Typography>
                            <List>
                                {resources &&
                                    Object.keys(resources).map((type) => {
                                        return resources[type].map(
                                            (resource, index) => (
                                                <Grid item key={index}>
                                                    <SharedItem
                                                        baseId={baseId}
                                                        type={type}
                                                        item={resource}
                                                    />
                                                </Grid>
                                            )
                                        );
                                    })}
                            </List>
                        </Grid>
                    </Grid>
                )}
            </DialogContent>
            <DialogActions>
                <Button
                    id={build(baseId, ids.BUTTONS.CANCEL)}
                    onClick={handleClose}
                >
                    {tCommon("cancel")}
                </Button>
                <Button
                    id={build(baseId, ids.BUTTONS.SAVE)}
                    color="primary"
                    type="submit"
                    onClick={onSave}
                >
                    {tCommon("done")}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default Sharing;
