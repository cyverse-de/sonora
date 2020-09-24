/**
 * @author aramsey
 *
 * A dialog that accepts a collection of different resources and allows users
 * to modify with whom those resources are shared
 */

import React, { Fragment, useEffect, useState } from "react";

import { announce, AnnouncerConstants, build } from "@cyverse-de/ui-lib";
import {
    Avatar,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    Grid,
    IconButton,
    makeStyles,
    Typography,
    useMediaQuery,
    useTheme,
} from "@material-ui/core";
import { Close, Group } from "@material-ui/icons";
import { useMutation, useQuery } from "react-query";

import {
    addMissingResourcesToUser,
    getResourceTotal,
    getShareResponseValues,
    getSharingUpdates,
    getUnsharingUpdates,
    getUserMap,
    getUserSet,
    groupName,
    isGroup,
    TYPE,
} from "./util";
import { getUserInfo } from "serviceFacades/users";
import { USER_INFO_QUERY_KEY } from "serviceFacades/filesystem";
import isQueryLoading from "../utils/isQueryLoading";
import GridLoading from "../utils/GridLoading";
import ids from "./ids";
import SharedItem from "./SharedItem";
import Identity from "../data/Identity";
import SubjectSearchField from "./SubjectSearchField";
import { useUserProfile } from "contexts/userProfile";
import { useTranslation } from "i18n";
import SharingPermissionSelector from "components/sharing/SharingPermissionSelector";
import Permissions from "components/models/Permissions";
import {
    doSharingUpdates,
    GET_PERMISSIONS_QUERY_KEY,
    getPermissions,
} from "../../serviceFacades/sharing";
import withErrorAnnouncer from "components/utils/error/withErrorAnnouncer";
import styles from "./styles";

const useStyles = makeStyles(styles);

function Sharing(props) {
    const { open, onClose, resources, showErrorAnnouncer } = props;

    const [permissions, setPermissions] = useState([]);
    const [originalUsers, setOriginalUsers] = useState({});
    const [userIdList, setUserIdList] = useState([]);
    const [hasData, setHasData] = useState(false);
    const [userMap, setUserMap] = useState({});
    const [resourceTotal, setResourceTotal] = useState(0);
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
            onSuccess: (results) => {
                setPermissions(results);
                setUserIdList(getUserSet(results));
            },
            onError: (error) => {
                showErrorAnnouncer(tSharing("fetchPermissionsError"), error);
            },
        },
    });

    const { isFetching: fetchUserInfo } = useQuery({
        queryKey: [USER_INFO_QUERY_KEY, { userIds: userIdList }],
        queryFn: getUserInfo,
        config: {
            onSuccess: (results) => {
                const userMap = getUserMap(permissions, results, resourceTotal);

                setUserMap(userMap);
                setOriginalUsers(userMap);
            },
            onError: (error) => {
                showErrorAnnouncer(tSharing("fetchUserInfoError"), error);
            },
        },
    });

    useEffect(() => {
        if (resources) {
            const data = resources[TYPE.DATA];
            setHasData(data && data.length > 0);
            setResourceTotal(getResourceTotal(resources));
        }
    }, [resources]);

    const getUserAvatar = (user) => {
        return isGroup(user) ? <Group /> : user.email[0].toUpperCase();
    };

    const addUser = (user) => {
        const id = user.id;
        const updatedUser = addMissingResourcesToUser(user, resources);
        setUserMap({
            ...userMap,
            [id]: { ...updatedUser, displayPermission: Permissions.READ },
        });
    };

    const onPermissionChange = (user, permission) => {
        const userId = user.id;

        // Cannot update permissions for groups if data is included
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
            ? announce({
                  text: tSharing("cannotAddSelf"),
                  variant: AnnouncerConstants.INFO,
              })
            : userExist
            ? announce({
                  text: tSharing("userAlreadyAdded"),
                  variant: AnnouncerConstants.INFO,
              })
            : isGroup(user) && hasData
            ? announce({
                  text: tSharing("dataGroupSharingDisabled"),
                  variant: AnnouncerConstants.INFO,
              })
            : addUser(user) && onUserAdded();
    };

    const onRemoveUser = (user) => {
        const updated = { ...userMap };
        delete updated[user.id];

        setUserMap({ ...updated });
    };

    const [sendSharingUpdates, { isLoading: isSaving }] = useMutation(
        doSharingUpdates,
        {
            onSuccess: (results) => {
                let failures = [];
                results.forEach((type) => {
                    const sharing = type.sharing || type.unsharing;
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
                    announce({
                        text: tSharing("sharingUnsuccessful"),
                        variant: AnnouncerConstants.ERROR,
                    });
                } else {
                    onClose();
                }
            },
            onError: (error) => {
                showErrorAnnouncer(tSharing("sharingError"), error);
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
            onClose={onClose}
            maxWidth="lg"
            fullWidth
            id={baseId}
        >
            <DialogTitle id={build(baseId, ids.TITLE_BAR)}>
                {tSharing("sharing")}
                <IconButton
                    aria-label={tCommon("cancel")}
                    onClick={onClose}
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
                        rows={25}
                        baseId={build(ids.DIALOG, ids.LOADING)}
                    />
                )}
                {!isLoading && (
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <SubjectSearchField
                                baseId={build(ids.DIALOG, ids.SEARCH_FIELD)}
                                onUserSelected={onUserSelected}
                            />
                        </Grid>
                        <Grid item sm={12} md={6} zeroMinWidth>
                            <>
                                <Typography>
                                    {tSharing("sharingAccess")}
                                </Typography>
                                {userMap &&
                                    Object.values(userMap).map((user) => {
                                        const permissionSelector = () => (
                                            <FormControl
                                                className={
                                                    isMobile &&
                                                    classes.mobilePermission
                                                }
                                            >
                                                <SharingPermissionSelector
                                                    baseId={build(
                                                        baseId,
                                                        user.id,
                                                        ids.PERMISSION_SELECTOR
                                                    )}
                                                    currentPermission={
                                                        user.displayPermission
                                                    }
                                                    onPermissionChange={(
                                                        updatedPermission
                                                    ) =>
                                                        onPermissionChange(
                                                            user,
                                                            updatedPermission
                                                        )
                                                    }
                                                    onRemoveSelected={() =>
                                                        onRemoveUser(user)
                                                    }
                                                />
                                            </FormControl>
                                        );
                                        return (
                                            <Fragment key={user.id}>
                                                <Identity
                                                    ContainerComponent="div"
                                                    avatar={
                                                        <Avatar>
                                                            {getUserAvatar(
                                                                user
                                                            )}
                                                        </Avatar>
                                                    }
                                                    primaryText={
                                                        isGroup(user)
                                                            ? groupName(user)
                                                            : user.email
                                                    }
                                                    secondaryText={
                                                        user.institution ||
                                                        user.description
                                                    }
                                                    secondaryAction={
                                                        !isMobile
                                                            ? permissionSelector()
                                                            : null
                                                    }
                                                />
                                                {isMobile &&
                                                    permissionSelector()}
                                            </Fragment>
                                        );
                                    })}
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
                            <Typography className={classes.typographyPadding}>
                                {tSharing("resources")}
                            </Typography>
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
                        </Grid>
                    </Grid>
                )}
            </DialogContent>
            <DialogActions>
                <Button
                    id={build(baseId, ids.BUTTONS.CANCEL)}
                    onClick={onClose}
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

export default withErrorAnnouncer(Sharing);
