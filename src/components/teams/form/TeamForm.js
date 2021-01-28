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
    privilegeHasRead,
    privilegeIsAdmin,
    validateGroupName,
} from "../util";
import ids from "../ids";
import { useTranslation } from "i18n";
import { useQuery } from "react-query";
import { getTeamDetails, TEAM_DETAILS_QUERY } from "serviceFacades/groups";
import { useUserProfile } from "contexts/userProfile";
import Members from "./Members";
import { Skeleton } from "@material-ui/lab";
import TableLoading from "../../utils/TableLoading";
import HelpIconButton from "./HelpIconButton";
import Privilege from "../../models/Privilege";

function TeamForm(props) {
    const { parentId, team } = props;
    const [userProfile] = useUserProfile();

    const [privileges, setPrivileges] = useState([]);
    const [isPublicTeam, setPublicTeam] = useState(false);
    const [selfPrivilege, setSelfPrivilege] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [hasRead, setHasRead] = useState(false);

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

                    setPublicTeam(!!privilegeMap["GrouperAll"]);
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

    if (fetchingTeamDetails) {
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

    const handleSubmit = (values, actions) => {
        const { team } = props;
        console.log(values, actions);
        if (
            team.name !== values.name ||
            team.description !== values.description
        ) {
            //update team
        }
    };

    return (
        <Formik
            enableReinitialize
            initialValues={
                team
                    ? {
                          name: team?.name,
                          description: team?.description,
                          privileges: privileges,
                          isPublicTeam: isPublicTeam,
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
