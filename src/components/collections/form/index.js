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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { announce } from "components/announcer/CyVerseAnnouncer";
import { INFO } from "components/announcer/AnnouncerConstants";
import TableLoading from "components/table/TableLoading";
import isQueryLoading from "components/utils/isQueryLoading";
import { useUserProfile } from "contexts/userProfile";
import {
    COLLECTION_APPS_QUERY,
    COLLECTION_DETAILS_QUERY,
    createCollection,
    deleteCollection,
    followCollection,
    getCollectionApps,
    getCollectionDetails,
    MY_COLLECTIONS_QUERY,
    unfollowCollection,
    updateCollectionDetails,
    updateCollectionNameDesc,
} from "serviceFacades/groups";

import FormFields from "./FormFields";
import { useTranslation } from "i18n";
import styles from "../styles";
import CollectionToolbar from "./Toolbar";

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
    const [queryError, setQueryError] = useState(null);
    const [collectionNameSaved, setCollectionNameSaved] = useState(false);

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
                userId: userProfile?.id,
            },
        ],
        queryFn: () =>
            getCollectionDetails({
                name: collectionName,
                userId: userProfile?.id,
            }),
        enabled: !isCreatingCollection,
        onSuccess: (results) => {
            if (results) {
                const { collection, isAdmin, admins, isFollower } = results;
                setCollection(collection);
                setAdmin(isAdmin);
                setAdmins(admins);
                setFollower(isFollower);
            }
        },
        onError: (error) => {
            setQueryError({
                message: t("getCollectionFail"),
                object: error,
            });
        },
    });

    const collectionId = collection?.id;

    const { data: collectionApps, isFetching: fetchingCollectionApps } =
        useQuery({
            queryKey: [COLLECTION_APPS_QUERY, { collectionId }],
            queryFn: () => getCollectionApps({ collectionId }),
            enabled: !isCreatingCollection && !!collectionId,
            onError: (error) => {
                setQueryError({
                    message: t("getCollectionFail"),
                    object: error,
                });
            },
        });

    const apps = collectionApps?.apps || [];

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
        onSuccess: (resp, { newAdmins, newApps }) => {
            updateCollectionDetailsMutation({
                name: resp?.name,
                collectionId: resp?.id,
                oldAdmins: admins,
                oldApps: apps,
                newAdmins,
                newApps,
            });
        },
        onError: (error) => {
            setQueryError({
                message: t("updateCollectionNameDescError"),
                object: error,
            });
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
            onSuccess: (resp, { newAdmins, newApps }) => {
                setCollection(resp);
                setCollectionNameSaved(true);
                updateCollectionDetailsMutation({
                    name: resp?.name,
                    collectionId: resp?.id,
                    oldAdmins: admins,
                    oldApps: apps,
                    newAdmins,
                    newApps,
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
        fetchingCollectionApps,
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
            collectionId,
            name: newName,
            description: newDescription,
            oldAdmins: admins,
            oldApps: apps,
            newAdmins,
            newApps,
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
                      }
                    : {
                          name: collectionName || "",
                          description: collection?.description || "",
                          admins: admins,
                          apps: apps,
                      }
            }
            onSubmit={handleSubmit}
        >
            {({ handleSubmit, dirty }) => (
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
                </>
            )}
        </Formik>
    );
}

export default CollectionsForm;
