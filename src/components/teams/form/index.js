import React, { useEffect, useState } from "react";
import { makeStyles, Paper, Table } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { Form, Formik } from "formik";
import { useMutation, useQuery } from "react-query";

import Privilege from "components/models/Privilege";
import isQueryLoading from "components/utils/isQueryLoading";
import ErrorTypographyWithDialog from "components/utils/error/ErrorTypographyWithDialog";
import TableLoading from "components/utils/TableLoading";
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

const useStyles = makeStyles(styles);

function TeamForm(props) {
    const { parentId, teamName, goBackToTeamView } = props;
    const { t } = useTranslation(["teams", "common"]);
    const classes = useStyles();
    const [userProfile] = useUserProfile();

    const [team, setTeam] = useState(null);
    const [privileges, setPrivileges] = useState([]);
    const [wasPublicTeam, setWasPublicTeam] = useState(false);
    const [selfPrivilege, setSelfPrivilege] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [hasRead, setHasRead] = useState(false);
    const [isMember, setIsMember] = useState(false);
    const [teamNameSaved, setTeamNameSaved] = useState(false);
    const [submissionError, setSubmissionError] = useState(null);

    useEffect(() => {
        setHasRead(privilegeHasRead(selfPrivilege) || !teamName);
        setIsAdmin(privilegeIsAdmin(selfPrivilege) || !teamName);
        setIsMember(userIsMember(userProfile?.id, privileges));
    }, [privileges, selfPrivilege, teamName, userProfile]);

    const { isFetching: fetchingTeamDetails } = useQuery({
        queryKey: [TEAM_DETAILS_QUERY, { name: teamName }],
        queryFn: getTeamDetails,
        config: {
            enabled: !!teamName,
            onSuccess: (results) => {
                if (results) {
                    const team = results[0];
                    const privileges = results[1].privileges;
                    const members = results[2].members;

                    const privilegeMap = getAllPrivileges(privileges, members);
                    const memberPrivileges = Object.values(privilegeMap);

                    setTeam(team);
                    setWasPublicTeam(!!privilegeMap["GrouperAll"]);
                    setSelfPrivilege(privilegeMap[userProfile?.id]);
                    setPrivileges(
                        memberPrivileges.filter(
                            (privilege) => privilege.subject.id !== "GrouperAll"
                        )
                    );
                }
            },
            onError: (error) => {
                setSubmissionError({
                    message: t("getTeamFail"),
                    object: error,
                });
            },
        },
    });

    const [updateTeamMutation, { status: updateTeamStatus }] = useMutation(
        updateTeam,
        {
            onSuccess: (resp, variables) => {
                setTeamNameSaved(true);
                updateTeamMemberStatsMutation({
                    ...variables,
                    name: resp?.name,
                    selfId: userProfile?.id,
                });
            },
            onError: (error) => {
                setSubmissionError({
                    message: t("updateTeamFail"),
                    object: error,
                });
            },
        }
    );

    const [createTeamMutation, { status: createTeamStatus }] = useMutation(
        createTeam,
        {
            onSuccess: (resp, { newPrivileges }) => {
                setTeamNameSaved(true);
                updateTeamMemberStatsMutation({
                    name: resp?.name,
                    oldPrivileges: [],
                    newPrivileges,
                    selfId: userProfile?.id,
                });
            },
            onError: (error) => {
                setSubmissionError({
                    message: t("createTeamFail"),
                    object: error,
                });
            },
        }
    );

    const [
        updateTeamMemberStatsMutation,
        { status: updateTeamMemberStatsStatus },
    ] = useMutation(updateTeamMemberStats, {
        onSuccess: goBackToTeamView,
        onError: (error) => {
            setSubmissionError({
                message: t("updateTeamMemberStatsFail"),
                object: error,
            });
        },
    });

    const [leaveTeamMutation, { status: leaveTeamStatus }] = useMutation(
        leaveTeam,
        {
            onSuccess: goBackToTeamView,
            onError: (error) => {
                setSubmissionError({
                    message: t("leaveTeamFail"),
                    object: error,
                });
            },
        }
    );

    const [deleteTeamMutation, { status: deleteTeamStatus }] = useMutation(
        deleteTeam,
        {
            onSuccess: goBackToTeamView,
            onError: (error) => {
                setSubmissionError({
                    message: t("deleteTeamFail"),
                    object: error,
                });
            },
        }
    );

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
            name,
            description,
            isPublicTeam,
            privileges: newPrivileges,
        } = values;

        setSubmissionError(null);

        // If the user tries to resubmit the form after updating/creating the
        // team name has already succeeded (but maybe updating members failed),
        // you must skip resubmitting the team name request as the team
        // endpoints use the team name in the query, not ID
        if (!team && !teamNameSaved) {
            createTeamMutation({
                name,
                description,
                isPublicTeam,
                newPrivileges,
            });
        } else {
            const {
                name: originalName,
                description: originalDescription,
            } = team;

            if (
                !teamNameSaved &&
                (groupShortName(originalName) !== name ||
                    originalDescription !== description)
            ) {
                updateTeamMutation({
                    originalName,
                    name,
                    description,
                    oldPrivileges: privileges,
                    newPrivileges,
                    isPublicTeam,
                    wasPublicTeam,
                });
            } else {
                updateTeamMemberStatsMutation({
                    name: originalName,
                    oldPrivileges: privileges,
                    newPrivileges,
                    isPublicTeam,
                    wasPublicTeam,
                    selfId: userProfile?.id,
                });
            }
        }
    };

    return (
        <Formik
            enableReinitialize
            initialValues={
                teamName
                    ? {
                          name: groupShortName(team?.name),
                          description: team?.description,
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
            <Form>
                <TeamToolbar
                    parentId={parentId}
                    isAdmin={isAdmin}
                    isMember={isMember}
                    teamName={groupShortName(team?.name)}
                    onLeaveTeamSelected={() =>
                        leaveTeamMutation({ name: team?.name })
                    }
                    onDeleteTeamSelected={() =>
                        deleteTeamMutation({ name: team?.name })
                    }
                />
                <Paper classes={{ root: classes.paper }} elevation={1}>
                    {loading && (
                        <>
                            <Skeleton variant="text" height={40} />
                            <Skeleton variant="rect" height={100} />
                            <Table>
                                <TableLoading numColumns={2} numRows={3} />
                            </Table>
                        </>
                    )}

                    {submissionError && (
                        <ErrorTypographyWithDialog
                            errorMessage={submissionError?.message}
                            errorObject={submissionError?.object}
                        />
                    )}
                    {!loading && (
                        <FormFields
                            parentId={parentId}
                            isAdmin={isAdmin}
                            hasRead={hasRead}
                            submissionError={submissionError}
                        />
                    )}
                    {submissionError && (
                        <ErrorTypographyWithDialog
                            errorMessage={submissionError?.message}
                            errorObject={submissionError?.object}
                        />
                    )}
                </Paper>
            </Form>
        </Formik>
    );
}

export default TeamForm;
