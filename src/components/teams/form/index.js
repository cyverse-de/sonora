/**
 * @author aramsey
 *
 * The entire view the user sees when creating or editing a team at /teams/:name
 * Basically a toolbar and a form to fill out.
 */

import React, { useEffect, useState } from "react";
import { Paper, Table } from "@mui/material";
import { makeStyles } from "tss-react/mui";
import { Skeleton } from "@mui/material";
import { Formik } from "formik";
import { useMutation, useQuery } from "react-query";

import Privilege from "components/models/Privilege";
import isQueryLoading from "components/utils/isQueryLoading";
import TableLoading from "components/table/TableLoading";
import { useConfig } from "contexts/config";
import { useUserProfile } from "contexts/userProfile";
import FormFields from "./FormFields";
import { useTranslation } from "i18n";
import {
    createTeam,
    deleteTeam,
    getTeamDetails,
    leaveTeam,
    TEAM_DETAILS_QUERY,
    updateTeam,
    updateTeamMemberStats,
} from "serviceFacades/groups";
import styles from "../styles";
import TeamToolbar from "./Toolbar";
import {
    getAllPrivileges,
    groupShortName,
    privilegeHasRead,
    privilegeIsAdmin,
    userIsMember,
} from "../util";
import { trackIntercomEvent, IntercomEvents } from "common/intercom";

const useStyles = makeStyles()(styles);

function TeamForm(props) {
    const { parentId, teamName, goBackToTeamView } = props;
    const { t } = useTranslation(["teams", "common"]);
    const { classes } = useStyles();
    const [userProfile] = useUserProfile();
    const [config] = useConfig();
    const GROUPER_ADMIN_ID = config?.grouper?.admin;
    const GROUPER_ALL_USERS_ID = config?.grouper?.allUsers;

    const [team, setTeam] = useState(null);
    const [privileges, setPrivileges] = useState([]);
    const [wasPublicTeam, setWasPublicTeam] = useState(false);
    const [selfPrivilege, setSelfPrivilege] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [hasRead, setHasRead] = useState(false);
    const [isMember, setIsMember] = useState(false);
    const [teamNameSaved, setTeamNameSaved] = useState(false);
    const [saveError, setSaveError] = useState(null);
    const isCreatingTeam = !teamName;

    useEffect(() => {
        setHasRead(privilegeHasRead(selfPrivilege) || isCreatingTeam);
        setIsAdmin(privilegeIsAdmin(selfPrivilege) || isCreatingTeam);
        setIsMember(userIsMember(userProfile?.id, privileges));
    }, [isCreatingTeam, privileges, selfPrivilege, teamName, userProfile]);

    const { isFetching: fetchingTeamDetails } = useQuery({
        queryKey: [TEAM_DETAILS_QUERY, { name: teamName }],
        queryFn: () => getTeamDetails({ name: teamName }),
        enabled: !isCreatingTeam,
        onSuccess: (results) => {
            if (results) {
                const team = results[0];
                const privileges = results[1].privileges;
                const members = results[2].members;

                const privilegeMap = getAllPrivileges(
                    privileges,
                    members,
                    GROUPER_ALL_USERS_ID,
                    GROUPER_ADMIN_ID
                );
                const memberPrivileges = Object.values(privilegeMap);

                setTeam(team);
                setSelfPrivilege(privilegeMap[userProfile?.id]);
                setWasPublicTeam(!!privilegeMap[GROUPER_ALL_USERS_ID]);
                setPrivileges(
                    memberPrivileges.filter(
                        (privilege) =>
                            privilege.subject.id !== GROUPER_ALL_USERS_ID
                    )
                );
            }
        },
        onError: (error) => {
            setSaveError({
                message: t("getTeamFail"),
                object: error,
            });
        },
    });

    // Updates only team name and description, then calls updateTeamMemberStatsMutation
    const { mutate: updateTeamMutation, status: updateTeamStatus } =
        useMutation(updateTeam, {
            onSuccess: (resp, variables) => {
                setTeamNameSaved(true);
                updateTeamMemberStatsMutation({
                    ...variables,
                    name: resp?.name,
                });
            },
            onError: (error) => {
                setSaveError({
                    message: t("updateTeamFail"),
                    object: error,
                });
            },
        });

    // Creates the team name, description, and initial public privilege
    // then calls updateTeamMemberStatsMutation
    const { mutate: createTeamMutation, status: createTeamStatus } =
        useMutation(createTeam, {
            onSuccess: (resp, { newPrivileges }) => {
                trackIntercomEvent(IntercomEvents.CREATED_NEW_TEAM, resp);
                setTeamNameSaved(true);
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

    // Updates privileges and memberships
    const {
        mutate: updateTeamMemberStatsMutation,
        status: updateTeamMemberStatsStatus,
    } = useMutation(
        (variables) =>
            updateTeamMemberStats({
                ...variables,
                oldPrivileges: privileges,
                selfId: userProfile?.id,
                GrouperAllUsersId: GROUPER_ALL_USERS_ID,
            }),
        {
            onSuccess: goBackToTeamView,
            onError: (error) => {
                setSaveError({
                    message: t("updateTeamMemberStatsFail"),
                    object: error,
                });
            },
        }
    );

    const { mutate: leaveTeamMutation, status: leaveTeamStatus } = useMutation(
        leaveTeam,
        {
            onSuccess: goBackToTeamView,
            onError: (error) => {
                setSaveError({
                    message: t("leaveTeamFail"),
                    object: error,
                });
            },
        }
    );

    const { mutate: deleteTeamMutation, status: deleteTeamStatus } =
        useMutation(deleteTeam, {
            onSuccess: (resp) => {
                trackIntercomEvent(IntercomEvents.DELETED_TEAM, resp);
                goBackToTeamView();
            },
            onError: (error) => {
                setSaveError({
                    message: t("deleteTeamFail"),
                    object: error,
                });
            },
        });

    const loading = isQueryLoading([
        fetchingTeamDetails,
        updateTeamStatus,
        createTeamStatus,
        updateTeamMemberStatsStatus,
        leaveTeamStatus,
        deleteTeamStatus,
    ]);

    const handleSubmit = (values) => {
        const {
            name: untrimmedName,
            description,
            isPublicTeam,
            privileges: newPrivileges,
        } = values;

        const name = untrimmedName.trim();

        setSaveError(null);

        // If the user tries to resubmit the form after updating/creating the
        // team name has already succeeded (but maybe updating members failed),
        // you must skip resubmitting the team name request as the team
        // endpoints use the team name in the query, not ID
        if (isCreatingTeam && !teamNameSaved) {
            createTeamMutation({
                name,
                description,
                isPublicTeam,
                newPrivileges,
            });
        } else {
            const { name: originalName, description: originalDescription } =
                team;

            if (
                !isCreatingTeam &&
                !teamNameSaved &&
                (groupShortName(originalName) !== name ||
                    originalDescription !== description)
            ) {
                updateTeamMutation({
                    originalName,
                    name,
                    description,
                    newPrivileges,
                    isPublicTeam,
                    wasPublicTeam,
                });
            } else {
                const updateName = isCreatingTeam
                    ? `${userProfile?.id}:${name}`
                    : originalName;
                updateTeamMemberStatsMutation({
                    name: updateName,
                    newPrivileges,
                    isPublicTeam,
                    wasPublicTeam,
                });
            }
        }
    };

    return (
        <Formik
            enableReinitialize
            initialValues={
                !isCreatingTeam
                    ? {
                          name: groupShortName(teamName) || "",
                          description: team?.description || "",
                          privileges: privileges,
                          isPublicTeam: wasPublicTeam,
                      }
                    : {
                          name: "",
                          description: "",
                          privileges: [
                              {
                                  name: Privilege.ADMIN.value,
                                  subject: { ...userProfile },
                              },
                          ],
                          isPublicTeam: true,
                      }
            }
            onSubmit={handleSubmit}
        >
            {({ handleSubmit }) => (
                <>
                    <TeamToolbar
                        parentId={parentId}
                        isAdmin={isAdmin}
                        isMember={isMember}
                        teamName={team?.name}
                        handleSubmit={handleSubmit}
                        onLeaveTeamSelected={() =>
                            leaveTeamMutation({ name: team?.name })
                        }
                        onDeleteTeamSelected={() =>
                            deleteTeamMutation({ name: team?.name })
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
                                    <TableLoading
                                        baseId={parentId}
                                        numColumns={2}
                                        numRows={3}
                                    />
                                </Table>
                            </>
                        )}

                        {!loading && (
                            <FormFields
                                parentId={parentId}
                                isAdmin={isAdmin}
                                hasRead={hasRead}
                                saveError={saveError}
                            />
                        )}
                    </Paper>
                </>
            )}
        </Formik>
    );
}

export default TeamForm;
