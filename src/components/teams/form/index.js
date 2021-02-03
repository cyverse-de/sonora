import React, { useEffect, useState } from "react";

import { build } from "@cyverse-de/ui-lib";
import { Button, Table, Toolbar } from "@material-ui/core";
import { Save } from "@material-ui/icons";
import { Skeleton } from "@material-ui/lab";
import { Form, Formik } from "formik";
import { useMutation, useQuery } from "react-query";

import isQueryLoading from "components/utils/isQueryLoading";
import Privilege from "components/models/Privilege";
import TableLoading from "components/utils/TableLoading";
import { useUserProfile } from "contexts/userProfile";
import { useTranslation } from "i18n";
import ids from "../ids";
import {
    createTeam,
    getTeamDetails,
    TEAM_DETAILS_QUERY,
    updateTeam,
    updateTeamMemberStats,
} from "serviceFacades/groups";
import FormFields from "./FormFields";
import {
    getAllPrivileges,
    groupShortName,
    privilegeHasRead,
    privilegeIsAdmin,
} from "../util";

function TeamForm(props) {
    const { parentId, team } = props;
    const { t } = useTranslation("common");
    const [userProfile] = useUserProfile();

    const [privileges, setPrivileges] = useState([]);
    const [wasPublicTeam, setWasPublicTeam] = useState(false);
    const [selfPrivilege, setSelfPrivilege] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [hasRead, setHasRead] = useState(false);
    const [teamSaveSuccess, setTeamSaveSuccess] = useState(false);
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
                {!loading && (
                    <FormFields
                        parentId={parentId}
                        isAdmin={isAdmin}
                        hasRead={hasRead}
                        submissionError={submissionError}
                    />
                )}
            </Form>
        </Formik>
    );
}

export default TeamForm;
