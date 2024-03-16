/**
 * @author aramsey
 *
 * The top-level component for creating/editing collections
 */
import React, { useState } from "react";

import { Paper, Table } from "@mui/material";
import { makeStyles } from "tss-react/mui";
import { Skeleton } from "@mui/material";
import { Formik } from "formik";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { announce } from "components/announcer/CyVerseAnnouncer";
import { INFO } from "components/announcer/AnnouncerConstants";
import { ERROR_CODES, getErrorCode } from "components/error/errorCode";
import TableLoading from "components/table/TableLoading";
import ConfirmationDialog from "components/utils/ConfirmationDialog";
import isQueryLoading from "components/utils/isQueryLoading";
import { useUserProfile } from "contexts/userProfile";
import {
    COLLECTION_DETAILS_QUERY,
    createCollection,
    deleteCollection,
    followCollection,
    getCollectionDetails,
    MY_COLLECTIONS_QUERY,
    unfollowCollection,
    updateCollectionDetails,
    updateCollectionNameDesc,
} from "serviceFacades/groups";

import FormFields from "./FormFields";
import { useTranslation } from "i18n";
import ids from "../ids";
import styles from "../styles";
import CollectionToolbar from "./Toolbar";
import constants from "constants.js";

const useStyles = makeStyles()(styles);

function CollectionsForm(props) {
    const { parentId, collectionName, goBackToCollectionList } = props;
    const { t } = useTranslation(["collections", "common"]);
    const { classes } = useStyles();

    const [userProfile] = useUserProfile();
    const [collection, setCollection] = useState(null);
    const [isAdmin, setAdmin] = useState(false);
    const [admins, setAdmins] = useState([]);
    const [isFollower, setFollower] = useState(false);
    const [apps, setApps] = useState([]);
    const [queryError, setQueryError] = useState(null);
    const [collectionNameSaved, setCollectionNameSaved] = useState(false);
    const [showRetagAppsDlg, setShowRetagAppsDlg] = useState(false);

    const queryClient = useQueryClient();

    const isCreatingCollection = !collectionName;

    const resetMyCollectionsCache = () => {
        queryClient.setQueryData(
            [MY_COLLECTIONS_QUERY, { userId: userProfile?.id }],
            null
        );
    };

    const { isFetching: fetchingCollectionDetails } = useQuery({
        queryKey: [
            COLLECTION_DETAILS_QUERY,
            {
                name: collectionName,
                fullName: collection?.display_name,
                userId: userProfile?.id,
            },
        ],
        queryFn: () =>
            getCollectionDetails({
                name: collectionName,
                fullName: collection?.display_name,
                userId: userProfile?.id,
            }),
        enabled: !isCreatingCollection,
        onSuccess: (results) => {
            if (results) {
                const { collection, isAdmin, admins, isFollower, apps } =
                    results;
                setCollection(collection);
                setAdmin(isAdmin);
                setAdmins(admins);
                setFollower(isFollower);
                setApps(apps?.apps);
            }
        },
        onError: (error) => {
            setQueryError({
                message: t("getCollectionFail"),
                object: error,
            });
        },
    });

    const { mutate: followMutation, status: followStatus } = useMutation(
        followCollection,
        {
            onSuccess: (resp) => {
                announce({
                    text: t("followCollectionSuccess", {
                        name: collectionName,
                    }),
                    variant: INFO,
                });
                resetMyCollectionsCache();
                goBackToCollectionList();
            },
            onError: (error) => {
                setQueryError({
                    message: t("followCollectionError", {
                        name: collectionName,
                    }),
                    object: error,
                });
            },
        }
    );

    const { mutate: unfollowMutation, status: unfollowStatus } = useMutation(
        unfollowCollection,
        {
            onSuccess: () => {
                announce({
                    text: t("unfollowCollectionSuccess", {
                        name: collectionName,
                    }),
                    variant: INFO,
                });
                resetMyCollectionsCache();
                goBackToCollectionList();
            },
            onError: (error) => {
                setQueryError({
                    message: t("unfollowCollectionError", {
                        name: collectionName,
                    }),
                    object: error,
                });
            },
        }
    );

    const { mutate: deleteMutation, status: deleteStatus } = useMutation(
        deleteCollection,
        {
            onSuccess: () => {
                announce({
                    text: t("deleteCollectionSuccess", {
                        name: collectionName,
                    }),
                    variant: INFO,
                });
                resetMyCollectionsCache();
                goBackToCollectionList();
            },
            onError: (error) => {
                setQueryError({
                    message: t("deleteCollectionError", {
                        name: collectionName,
                    }),
                    object: error,
                });
            },
        }
    );

    const {
        mutate: updateCollectionNameDescMutation,
        status: updateCollectionNameDescStatus,
    } = useMutation(updateCollectionNameDesc, {
        onSuccess: (resp, { newAdmins, newApps, attr }) => {
            updateCollectionDetailsMutation({
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
                    message: t("updateCollectionNameDescError"),
                    object: error,
                });
            }
        },
    });

    const {
        mutate: updateCollectionDetailsMutation,
        status: updateCollectionStatus,
    } = useMutation(updateCollectionDetails, {
        onSuccess: () => {
            resetMyCollectionsCache();
            goBackToCollectionList();
        },
        onError: (error) => {
            setQueryError({
                message: t("updateCollectionDetailsFail"),
                object: error,
            });
        },
    });

    const { mutate: createCollectionMutation, status: createCollectionStatus } =
        useMutation(createCollection, {
            onSuccess: (resp, { newAdmins, newApps, attr }) => {
                setCollection(resp);
                setCollectionNameSaved(true);
                updateCollectionDetailsMutation({
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
                    message: t("createCollectionFail"),
                    object: error,
                });
            },
        });

    const loading = isQueryLoading([
        fetchingCollectionDetails,
        followStatus,
        unfollowStatus,
        deleteStatus,
        createCollectionStatus,
        updateCollectionNameDescStatus,
        updateCollectionStatus,
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
            isCreatingCollection && !collectionNameSaved
                ? createCollectionMutation
                : collectionName !== newName ||
                  collection?.description !== newDescription
                ? updateCollectionNameDescMutation
                : updateCollectionDetailsMutation;

        mutation({
            originalName: collectionName,
            originalDescription: collection?.description,
            fullName: collection?.display_name,
            name: newName,
            description: newDescription,
            oldAdmins: admins,
            oldApps: apps,
            newAdmins,
            newApps,
            retagApps,
            attr: constants.METADATA.COMMUNITY_ATTR,
        });
    };

    return (
        <Formik
            enableReinitialize
            initialValues={
                isCreatingCollection
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
                          name: collectionName || "",
                          description: collection?.description || "",
                          admins: admins,
                          apps: apps,
                          retagApps: null,
                      }
            }
            onSubmit={handleSubmit}
        >
            {({ handleSubmit, setFieldValue, dirty }) => (
                <>
                    <CollectionToolbar
                        parentId={parentId}
                        isAdmin={isAdmin || isCreatingCollection}
                        isFollower={isFollower}
                        collectionName={collectionName}
                        handleSubmit={handleSubmit}
                        dirty={dirty}
                        onFollowSelected={() =>
                            followMutation({ collectionName })
                        }
                        onUnfollowSelected={() =>
                            unfollowMutation({ collectionName })
                        }
                        onDeleteCollectionSelected={() =>
                            deleteMutation({ collectionName })
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
                                <Skeleton variant="rectangular" height={100} />
                                <Table>
                                    <TableLoading numColumns={2} numRows={3} />
                                </Table>
                            </>
                        )}

                        {!loading && (
                            <FormFields
                                parentId={parentId}
                                isAdmin={isAdmin || isCreatingCollection}
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
                            name: collectionName,
                        })}
                    />
                </>
            )}
        </Formik>
    );
}

export default CollectionsForm;
