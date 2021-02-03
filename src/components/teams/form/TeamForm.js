import React, { useEffect, useState } from "react";

import {
    build,
    FormCheckbox,
    FormMultilineTextField,
    FormTextField,
} from "@cyverse-de/ui-lib";
import { Table } from "@material-ui/core";
import { Field, FieldArray, Form, Formik } from "formik";

import {
    getAllPrivileges,
    groupShortName,
    privilegeHasRead,
    privilegeIsAdmin,
    validateGroupName,
} from "../util";
import ids from "../ids";
import { useTranslation } from "i18n";
import { useMutation, useQuery } from "react-query";
import {
    createTeam,
    getTeamDetails,
    TEAM_DETAILS_QUERY,
    updateTeam,
    updateTeamMemberStats,
} from "serviceFacades/groups";
import { useUserProfile } from "contexts/userProfile";
import Members from "./Members";
import { Skeleton } from "@material-ui/lab";
import TableLoading from "../../utils/TableLoading";
import HelpIconButton from "./HelpIconButton";
import Privilege from "../../models/Privilege";
import isQueryLoading from "../../utils/isQueryLoading";
import ErrorTypography from "../../utils/error/ErrorTypography";

function TeamForm(props) {
    const { parentId, team } = props;
    const [userProfile] = useUserProfile();

    const [privileges, setPrivileges] = useState([]);
    const [wasPublicTeam, setWasPublicTeam] = useState(false);
    const [selfPrivilege, setSelfPrivilege] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [hasRead, setHasRead] = useState(false);
    const [teamSaveSuccess, setTeamSaveSuccess] = useState(false);
    const [submissionError, setSubmissionError] = useState(null);

    const { t } = useTranslation("teams");

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
            onError: console.log,
        },
    });

    const [updateTeamMutation, { status: updateTeamStatus }] = useMutation(
        updateTeam,
        {
            onSuccess: (resp, variables) => {
                setTeamSaveSuccess(true);
                updateTeamMemberStatsMutation({
                    name: resp?.name,
                    ...variables,
                });
            },
            onError: (e) => {},
        }
    );

    const [createTeamMutation, { status: createTeamStatus }] = useMutation(
        createTeam,
        {
            onSuccess: (resp, { newPrivileges }) => {
                setTeamSaveSuccess(true);
                updateTeamMemberStatsMutation({
                    name: resp?.name,
                    oldPrivileges: [],
                    newPrivileges,
                });
            },
            onError: (e) => {
                setSubmissionError("wrong!");
            },
        }
    );

    const [
        updateTeamMemberStatsMutation,
        { status: updateTeamMemberStatsStatus },
    ] = useMutation(updateTeamMemberStats, {
        onSuccess: () => console.log("details updated"),
        onError: (e) => console.log(e),
    });

    const loading = isQueryLoading([
        fetchingTeamDetails,
        updateTeamStatus,
        createTeamStatus,
        updateTeamMemberStatsStatus,
    ]);

    if (loading) {
        return (
            <>
                <Skeleton variant="text" />
                <Skeleton variant="rect" />
                <Table>
                    <TableLoading numColumns={2} numRows={3} />
                </Table>
            </>
        );
    }

    const handleSubmit = (values, { setFieldError }) => {
        const {
            name,
            description,
            isPublicTeam,
            privileges: newPrivileges,
        } = values;

        // If the user tries to resubmit the form after updating/creating the
        // team name has already succeeded (but maybe updating members failed),
        // you must skip resubmitting the team name request as the team
        // endpoints use the team name in the query, not ID
        if (!team && !teamSaveSuccess) {
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
                !teamSaveSuccess &&
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
                <ErrorTypography
                    errorMessage={submissionError?.message || submissionError}
                />
                <Field
                    name="name"
                    label={t("teamName")}
                    id={build(parentId, ids.EDIT_TEAM.NAME)}
                    InputProps={{
                        readOnly: !isAdmin,
                    }}
                    validate={(value) => validateGroupName(value, t)}
                    component={FormTextField}
                />
                <Field
                    name="description"
                    label={t("teamDesc")}
                    id={build(parentId, ids.EDIT_TEAM.DESCRIPTION)}
                    InputProps={{
                        readOnly: !isAdmin,
                    }}
                    component={FormMultilineTextField}
                />
                {isAdmin && (
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                    >
                        <Field
                            name="isPublicTeam"
                            label={t("publicTeam")}
                            id={build(
                                parentId,
                                ids.EDIT_TEAM.PUBLIC_PRIVILEGES
                            )}
                            component={FormCheckbox}
                        />
                        <HelpIconButton
                            parentId={build(
                                parentId,
                                ids.EDIT_TEAM.PUBLIC_PRIVILEGES
                            )}
                            message={t("publicTeamHelp")}
                            color="secondary"
                        />
                    </div>
                )}
                {hasRead && (
                    <FieldArray
                        name="privileges"
                        render={(props) => (
                            <Members
                                {...props}
                                isAdmin={isAdmin}
                                hasRead={hasRead}
                                parentId={parentId}
                            />
                        )}
                    />
                )}
                <button type="submit">Submit</button>
            </Form>
        </Formik>
    );
}

export default TeamForm;
