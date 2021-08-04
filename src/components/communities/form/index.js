import React, { useState } from "react";

import announce from "components/announcer/CyVerseAnnouncer";
import { INFO } from "components/announcer/AnnouncerConstants";
import { makeStyles, Paper, Table } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { Formik } from "formik";
import { useMutation, useQuery } from "react-query";

import isQueryLoading from "components/utils/isQueryLoading";
import TableLoading from "components/table/TableLoading";
import { useUserProfile } from "contexts/userProfile";
import FormFields from "./FormFields";
import { useTranslation } from "i18n";
import {
    COMMUNITY_DETAILS_QUERY,
    createTeam,
    deleteCommunity,
    followCommunity,
    getCommunityDetails,
    unfollowCommunity,
} from "serviceFacades/groups";
import styles from "../styles";
import CommunityToolbar from "./Toolbar";

const useStyles = makeStyles(styles);

function CommunitiesForm(props) {
    const { parentId, communityName } = props;
    const { t } = useTranslation(["communities", "common"]);
    const classes = useStyles();

    const [userProfile] = useUserProfile();
    const [community, setCommunity] = useState(null);
    const [isAdmin, setAdmin] = useState(false);
    const [admins, setAdmins] = useState([]);
    const [isFollower, setFollower] = useState(false);
    const [apps, setApps] = useState([]);
    const [queryError, setQueryError] = useState(null);
    const [communityNameSaved, setCommunityNameSaved] = useState(false);

    const isCreatingCommunity = !communityName;

    const { isFetching: fetchingCommunityDetails } = useQuery({
        queryKey: [
            COMMUNITY_DETAILS_QUERY,
            { name: communityName, userId: userProfile?.id },
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

    // Creates the team name, description, and initial public privilege
    // then calls updateTeamMemberStatsMutation
    const [createCommunityMutation, { status: createCommunityStatus }] =
        useMutation(createTeam, {
            onSuccess: (resp, { newPrivileges }) => {
                setCommunityNameSaved(true);
                updateTeamMemberStatsMutation({
                    name: resp?.name,
                    newPrivileges,
                });
            },
            onError: (error) => {
                setSaveError({
                    message: t("createTeamFail"),
                    object: error,
                });
            },
        });

    const loading = isQueryLoading([
        fetchingCommunityDetails,
        followStatus,
        unfollowStatus,
        deleteStatus,
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

        if (isCreatingCommunity && !communityNameSaved) {
            createCommunityMutation({});
        }
    };

    return (
        <Formik
            enableReinitialize
            initialValues={
                isCreatingCommunity
                    ? {
                          name: "",
                          description: "",
                          admins: admins,
                          apps: apps,
                      }
                    : {
                          name: communityName || "",
                          description: community?.description || "",
                          admins: admins,
                          apps: apps,
                      }
            }
            onSubmit={handleSubmit}
        >
            {({ handleSubmit }) => (
                <>
                    <CommunityToolbar
                        parentId={parentId}
                        isAdmin={isAdmin || isCreatingCommunity}
                        isFollower={isFollower}
                        communityName={communityName}
                        handleSubmit={handleSubmit}
                        onFollowSelected={() =>
                            followMutation({ name: communityName })
                        }
                        onUnfollowSelected={() =>
                            unfollowMutation({ name: communityName })
                        }
                        onDeleteCommunitySelected={() =>
                            deleteMutation({ name: communityName })
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
                            />
                        )}
                    </Paper>
                </>
            )}
        </Formik>
    );
}

export default CommunitiesForm;
