import React, { useEffect, useState } from "react";

import { build } from "@cyverse-de/ui-lib";
import { Button, Table, Toolbar } from "@material-ui/core";
import { Save } from "@material-ui/icons";
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
import ids from "../ids";
import {
    createTeam,
    getTeamDetails,
    TEAM_DETAILS_QUERY,
    updateTeam,
    updateTeamMemberStats,
} from "serviceFacades/groups";
import {
    getAllPrivileges,
    groupShortName,
    privilegeHasRead,
    privilegeIsAdmin,
} from "../util";

function TeamForm(props) {
    const { parentId, team } = props;
    const { t } = useTranslation(["teams", "common"]);
    const [userProfile] = useUserProfile();

    const [privileges, setPrivileges] = useState([]);
    const [wasPublicTeam, setWasPublicTeam] = useState(false);
    const [selfPrivilege, setSelfPrivilege] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [hasRead, setHasRead] = useState(false);
    const [teamNameSaved, setTeamNameSaved] = useState(false);
    const [submissionError, setSubmissionError] = useState(null);

    useEffect(() => {
        setHasRead(privilegeHasRead(selfPrivilege) || !team);
        setIsAdmin(privilegeIsAdmin(selfPrivilege) || !team);
    }, [selfPrivilege, team]);

    const { isFetching: fetchingTeamDetails } = useQuery({
        queryKey: [TEAM_DETAILS_QUERY, { name: team?.name }],
        queryFn: getTeamDetails,
        config: {
            enabled: !!team,
            onSuccess: (results) => {
                if (results) {
                    const privileges = results[0].privileges;
                    const members = results[1].members;

                    const privilegeMap = getAllPrivileges(privileges, members);
                    const memberPrivileges = Object.values(privilegeMap);

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
                    name: resp?.name,
                    ...variables,
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
        onSuccess: () => console.log("details updated"),
        onError: (error) => {
            setSubmissionError({
                message: t("updateTeamMemberStatsFail"),
                object: error,
            });
        },
    });

    const loading = isQueryLoading([
        fetchingTeamDetails,
        updateTeamStatus,
        createTeamStatus,
        updateTeamMemberStatsStatus,
    ]);

    const handleSubmit = (values, { setFieldError }) => {
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
                    setFieldError,
                });
            } else {
                updateTeamMemberStatsMutation({
                    name: originalName,
                    oldPrivileges: privileges,
                    newPrivileges,
                    isPublicTeam,
                    wasPublicTeam,
                    setFieldError,
                });
            }
        }
    };

    return (
        <Formik
            enableReinitialize
            initialValues={
                team
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
                <Toolbar>
                    <Button
                        type="submit"
                        color="primary"
                        variant="outlined"
                        id={build(
                            parentId,
                            ids.EDIT_TEAM.TOOLBAR,
                            ids.BUTTONS.SAVE_BTN
                        )}
                        startIcon={<Save />}
                    >
                        {t("common:save")}
                    </Button>
                </Toolbar>
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
            </Form>
        </Formik>
    );
}

export default TeamForm;
