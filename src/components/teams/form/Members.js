/**
 * @author aramsey
 *
 * A component that allows a user to view/edit the members in a team
 *
 * Note that an admin can never modify their own privileges. This is to prevent
 * any accidental issues where they remove themselves from their own team or
 * can no longer update their team.
 */

import React, { useMemo } from "react";

import { build, FormSelectField } from "@cyverse-de/ui-lib";
import {
    Button,
    FormControlLabel,
    makeStyles,
    MenuItem,
} from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import { Field, getIn } from "formik";

import SubjectSearchField from "components/sharing/SubjectSearchField";
import { useUserProfile } from "contexts/userProfile";
import { MemberPrivileges } from "components/models/Privilege";
import SimpleExpansionPanel from "components/tools/SimpleExpansionPanel";
import { SubjectTableCell } from "components/sharing/UserTable";
import { getUserPrimaryText } from "components/sharing/util";
import BasicTable from "components/utils/BasicTable";
import HelpIconButton from "./HelpIconButton";
import { useTranslation } from "i18n";
import ids from "../ids";
import styles from "../styles";
import { DEFAULT_MEMBER_PRIVILEGE } from "../util";

const useStyles = makeStyles(styles);

/**
 * A Formik selector for choosing privileges for members within a team
 * @param props
 */
function MemberPrivilegeSelector(props) {
    const { parentId, field, onChange, ...rest } = props;
    const { t } = useTranslation("teams");
    const selectId = build(parentId, ids.EDIT_TEAM.PRIVILEGE);

    return (
        <FormSelectField
            {...rest}
            fullWidth={false}
            field={field}
            id={selectId}
            onChange={onChange}
        >
            {MemberPrivileges.map((privilegeType) => (
                <MenuItem
                    value={privilegeType.value}
                    id={build(
                        selectId,
                        ids.EDIT_TEAM[privilegeType.value.toUpperCase()]
                    )}
                    key={build(
                        selectId,
                        ids.EDIT_TEAM[privilegeType.value.toUpperCase()]
                    )}
                >
                    {t(privilegeType.value)}
                </MenuItem>
            ))}
        </FormSelectField>
    );
}

function Members(props) {
    const {
        parentId,
        isAdmin,
        push,
        remove,
        form: { values },
        name,
    } = props;
    const classes = useStyles();
    const { t } = useTranslation(["teams", "sharing"]);

    const [userProfile] = useUserProfile();
    const username = userProfile?.id;

    const privileges = getIn(values, name);

    const memberExists = (subject) => {
        const exists = privileges.filter(
            (privilege) => privilege.subject.id === subject.id
        );
        return exists?.length > 0;
    };

    const addMember = (subject) => {
        if (!memberExists(subject)) {
            const defaultPrivilege = {
                name: DEFAULT_MEMBER_PRIVILEGE,
                subject: { ...subject },
            };
            push(defaultPrivilege);
        }
    };

    const baseId = build(parentId, ids.EDIT_TEAM.MEMBERS);

    const columns = useMemo(() => {
        const isSelf = (privilege) => {
            return privilege.subject.id === username;
        };

        const getRowId = (row) => {
            return build(baseId, row.original.subject.id);
        };

        return [
            {
                Header: t("sharing:user"),
                accessor: (row) => getUserPrimaryText(row.subject),
                Cell: ({ row }) => {
                    return (
                        <Field name={`${name}.${row.index}.subject`}>
                            {({ field: { value } }) => {
                                return <SubjectTableCell subject={value} />;
                            }}
                        </Field>
                    );
                },
            },
            {
                Header: t("privilege"),
                accessor: "name",
                Cell: ({ row }) => {
                    const privilege = row.original;
                    const rowId = getRowId(row);
                    return (
                        <Field name={`${name}.${row.index}.name`}>
                            {({ field: { onChange, ...field }, ...props }) => {
                                if (!isAdmin || isSelf(privilege)) {
                                    return t(privilege.name);
                                }
                                return (
                                    <MemberPrivilegeSelector
                                        {...props}
                                        parentId={rowId}
                                        onChange={onChange}
                                        field={field}
                                    />
                                );
                            }}
                        </Field>
                    );
                },
            },
            {
                Header: "",
                accessor: "subject.id",
                Cell: ({ row }) => {
                    const privilege = row.original;
                    const rowId = getRowId(row);
                    if (isAdmin && !isSelf(privilege)) {
                        return (
                            <Button
                                id={build(rowId, ids.BUTTONS.DELETE)}
                                aria-label={t("remove")}
                                className={classes.deleteBtn}
                                onClick={() => {
                                    remove(row.index);
                                }}
                            >
                                <Delete />
                            </Button>
                        );
                    }
                    return null;
                },
            },
        ];
    }, [baseId, classes.deleteBtn, isAdmin, name, remove, t, username]);

    return (
        <SimpleExpansionPanel
            header={
                <FormControlLabel
                    aria-label={t("members")}
                    onClick={(event) => event.stopPropagation()}
                    onFocus={(event) => event.stopPropagation()}
                    labelPlacement="start"
                    control={
                        <HelpIconButton
                            parentId={baseId}
                            message={t("memberHelpMessage")}
                            size="small"
                            color="secondary"
                        />
                    }
                    label={t("members")}
                />
            }
            defaultExpanded={true}
            parentId={baseId}
        >
            {isAdmin && (
                <SubjectSearchField
                    baseId={build(baseId, ids.TEAMS.SEARCH)}
                    onUserSelected={addMember}
                />
            )}
            <BasicTable columns={columns} data={privileges} sortable />
        </SimpleExpansionPanel>
    );
}

export default Members;
