/**
 * @author aramsey
 *
 * The top-level component for creating/editing communities
 */
import React, { useState } from "react";

import { makeStyles, Paper, Table } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { Formik } from "formik";
import { useMutation, useQuery } from "react-query";

import { announce } from "components/announcer/CyVerseAnnouncer";
import { INFO } from "components/announcer/AnnouncerConstants";
import { ERROR_CODES, getErrorCode } from "components/error/errorCode";
import TableLoading from "components/table/TableLoading";
import ConfirmationDialog from "components/utils/ConfirmationDialog";
import isQueryLoading from "components/utils/isQueryLoading";
import { useConfig } from "contexts/config";
import { useUserProfile } from "contexts/userProfile";
import {
    COMMUNITY_DETAILS_QUERY,
    createCommunity,
    deleteCommunity,
    followCommunity,
    getCommunityDetails,
    unfollowCommunity,
    updateCommunityDetails,
    updateCommunityNameDesc,
} from "serviceFacades/groups";

import FormFields from "./FormFields";
import { useTranslation } from "i18n";
import ids from "../ids";
import styles from "../styles";
import CommunityToolbar from "./Toolbar";

const useStyles = makeStyles(styles);

function CommunitiesForm(props) {
    const { parentId, communityName, goBackToCommunityList } = props;
    const { t } = useTranslation(["communities", "common"]);
    const classes = useStyles();
    const [config] = useConfig();

    const [userProfile] = useUserProfile();
    const [community, setCommunity] = useState(null);
    const [isAdmin, setAdmin] = useState(false);
    const [admins, setAdmins] = useState([]);
    const [isFollower, setFollower] = useState(false);
    const [apps, setApps] = useState([]);
    const [queryError, setQueryError] = useState(null);
    const [communityNameSaved, setCommunityNameSaved] = useState(false);
    const [showRetagAppsDlg, setShowRetagAppsDlg] = useState(false);

    const isCreatingCommunity = !communityName;

    const { isFetching: fetchingCommunityDetails } = useQuery({
        queryKey: [
            COMMUNITY_DETAILS_QUERY,
            {
                name: communityName,
                fullName: community?.display_name,
                userId: userProfile?.id,
            },
        ],
        queryFn: getCommunityDetails,
        config: {
            enabled: !isCreatingCommunity,
            onSuccess: (results) => {
                if (results) {
                    const { community, isAdmin, admins, isFollower, apps } =
                        results;
                    setCommunity(community);
                    setAdmin(isAdmin);
                    setAdmins(admins);
                    setFollower(isFollower);
                    setApps(apps?.apps);
                }
            },
            onError: (error) => {
                setQueryError({
                    message: t("getCommunityFail"),
                    object: error,
                });
            },
        },
    });

    const [followMutation, { status: followStatus }] = useMutation(
        followCommunity,
        {
            onSuccess: (resp) => {
                announce({
                    text: t("followCommunitySuccess", {
                        name: communityName,
                    }),
                    variant: INFO,
                });
                goBackToCommunityList();
            },
            onError: (error) => {
                setQueryError({
                    message: t("followCommunityError", {
                        name: communityName,
                    }),
                    object: error,
                });
            },
        }
    );

    const [unfollowMutation, { status: unfollowStatus }] = useMutation(
        unfollowCommunity,
        {
            onSuccess: () => {
                announce({
                    text: t("unfollowCommunitySuccess", {
                        name: communityName,
                    }),
                    variant: INFO,
                });
                goBackToCommunityList();
            },
            onError: (error) => {
                setQueryError({
                    message: t("unfollowCommunityError", {
                        name: communityName,
                    }),
                    object: error,
                });
            },
        }
    );

    const [deleteMutation, { status: deleteStatus }] = useMutation(
        deleteCommunity,
        {
            onSuccess: () => {
                announce({
                    text: t("deleteCommunitySuccess", {
                        name: communityName,
                    }),
                    variant: INFO,
                });
                goBackToCommunityList();
            },
            onError: (error) => {
                setQueryError({
                    message: t("deleteCommunityError", {
                        name: communityName,
                    }),
                    object: error,
                });
            },
        }
    );

    const [
        updateCommunityNameDescMutation,
        { status: updateCommunityNameDescStatus },
    ] = useMutation(updateCommunityNameDesc, {
        onSuccess: (resp, { newAdmins, newApps, attr }) => {
            updateCommunityDetailsMutation({
                name: resp?.name,
                fullName: resp?.display_name,
                oldAdmins: admins,
                oldApps: apps,
                newAdmins,
                newApps,
                attr,
            });
        },
        onError: (error) => {
            const errorCode = getErrorCode(error);

            if (errorCode === ERROR_CODES.ERR_EXISTS) {
                setShowRetagAppsDlg(true);
            } else {
                setQueryError({
                    message: t("updateCommunityNameDescError"),
                    object: error,
                });
            }
        },
    });

    const [updateCommunityDetailsMutation, { status: updateCommunityStatus }] =
        useMutation(updateCommunityDetails, {
            onSuccess: goBackToCommunityList,
            onError: (error) => {
                setQueryError({
                    message: t("updateCommunityDetailsFail"),
                    object: error,
                });
            },
        });

    const [createCommunityMutation, { status: createCommunityStatus }] =
        useMutation(createCommunity, {
            onSuccess: (resp, { newAdmins, newApps, attr }) => {
                setCommunity(resp);
                setCommunityNameSaved(true);
                updateCommunityDetailsMutation({
                    name: resp?.name,
                    fullName: resp?.display_name,
                    oldAdmins: admins,
                    oldApps: apps,
                    newAdmins,
                    newApps,
                    attr,
                });
            },
            onError: (error) => {
                setQueryError({
                    message: t("createCommunityFail"),
                    object: error,
                });
            },
        });

    const loading = isQueryLoading([
        fetchingCommunityDetails,
        followStatus,
        unfollowStatus,
        deleteStatus,
        createCommunityStatus,
        updateCommunityNameDescStatus,
        updateCommunityStatus,
    ]);

    const handleSubmit = (values) => {
        const {
            name: untrimmedName,
            description: newDescription,
            admins: newAdmins,
            apps: newApps,
            retagApps,
        } = values;

        const newName = untrimmedName.trim();

        setQueryError(null);

        const mutation =
            isCreatingCommunity && !communityNameSaved
                ? createCommunityMutation
                : communityName !== newName ||
                  community?.description !== newDescription
                ? updateCommunityNameDescMutation
                : updateCommunityDetailsMutation;

        mutation({
            originalName: communityName,
            originalDescription: community?.description,
            fullName: community?.display_name,
            name: newName,
            description: newDescription,
            oldAdmins: admins,
            oldApps: apps,
            newAdmins,
            newApps,
            retagApps,
            attr: config?.metadata?.communityAttr,
        });
    };

    return (
        <Formik
            enableReinitialize
            initialValues={
                isCreatingCommunity
                    ? {
                          name: "",
                          description: "",
                          admins: [
                              {
                                  ...userProfile?.attributes,
                                  id: userProfile?.id,
                              },
                          ],
                          apps: apps,
                          retagApps: null,
                      }
                    : {
                          name: communityName || "",
                          description: community?.description || "",
                          admins: admins,
                          apps: apps,
                          retagApps: null,
                      }
            }
            onSubmit={handleSubmit}
        >
            {({ handleSubmit, setFieldValue }) => (
                <>
                    <CommunityToolbar
                        parentId={parentId}
                        isAdmin={isAdmin || isCreatingCommunity}
                        isFollower={isFollower}
                        communityName={communityName}
                        handleSubmit={handleSubmit}
                        onFollowSelected={() =>
                            followMutation({ communityName })
                        }
                        onUnfollowSelected={() =>
                            unfollowMutation({ communityName })
                        }
                        onDeleteCommunitySelected={() =>
                            deleteMutation({ communityName })
                        }
                    />
                    <Paper
                        classes={{ root: classes.paper }}
                        elevation={1}
                        style={{ overflow: "auto" }}
                    >
                        {loading && (
                            <>
                                <Skeleton variant="text" height={40} />
                                <Skeleton variant="rect" height={100} />
                                <Table>
                                    <TableLoading numColumns={2} numRows={3} />
                                </Table>
                            </>
                        )}

                        {!loading && (
                            <FormFields
                                parentId={parentId}
                                isAdmin={isAdmin || isCreatingCommunity}
                                queryError={queryError}
                                loading={loading}
                            />
                        )}
                    </Paper>
                    <ConfirmationDialog
                        baseId={ids.RETAG_APPS_DLG}
                        open={showRetagAppsDlg}
                        onClose={() => setShowRetagAppsDlg(false)}
                        onConfirm={() => {
                            setShowRetagAppsDlg(false);
                            setFieldValue("retagApps", true);
                            handleSubmit();
                        }}
                        title={t("retagAppsTitle")}
                        contentText={t("retagAppsMessage", {
                            name: communityName,
                        })}
                    />
                </>
            )}
        </Formik>
    );
}

export default CommunitiesForm;
