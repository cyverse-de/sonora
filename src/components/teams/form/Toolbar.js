/**
 * @author aramsey
 *
 * A toolbar that displays above the form for editing teams
 *
 * This toolbar contains buttons for saving, deleting, and leaving a team
 */

import React, { useState } from "react";

import { build, DotMenu } from "@cyverse-de/ui-lib";
import {
    Button,
    Hidden,
    ListItemIcon,
    ListItemText,
    makeStyles,
    MenuItem,
    Toolbar,
} from "@material-ui/core";
import { Delete, ExitToApp, Save } from "@material-ui/icons";

import BackButton from "components/utils/BackButton";
import { useTranslation } from "i18n";
import ids from "../ids";
import styles from "../styles";
import ConfirmationDialog from "../../utils/ConfirmationDialog";

const useStyles = makeStyles(styles);

function EditTeamToolbar(props) {
    const {
        parentId,
        isAdmin,
        isMember,
        onLeaveTeamSelected,
        onDeleteTeamSelected,
        teamName,
        handleSubmit,
    } = props;
    const { t } = useTranslation(["teams", "common"]);
    const classes = useStyles();

    const [leaveTeamDlgOpen, setLeaveTeamDlgOpen] = useState(false);
    const [deleteTeamDlgOpen, setDeleteTeamDlgOpen] = useState(false);

    const baseId = build(parentId, ids.EDIT_TEAM.TOOLBAR);
    const isCreatingTeam = !teamName;

    return (
        <Toolbar variant="dense">
            <BackButton />
            {isAdmin && (
                <Button
                    type="submit"
                    color="primary"
                    variant="outlined"
                    id={build(baseId, ids.BUTTONS.SAVE_BTN)}
                    className={classes.button}
                    startIcon={<Save />}
                    onClick={handleSubmit}
                >
                    {t("common:save")}
                </Button>
            )}
            <div className={classes.divider} />
            <Hidden xsDown>
                {!isAdmin && isMember && (
                    <Button
                        color="primary"
                        variant="outlined"
                        id={build(baseId, ids.BUTTONS.LEAVE_BTN)}
                        className={classes.button}
                        startIcon={<ExitToApp />}
                        onClick={() => {
                            setLeaveTeamDlgOpen(true);
                        }}
                    >
                        {t("leave")}
                    </Button>
                )}
                {isAdmin && !isCreatingTeam && (
                    <Button
                        classes={{ root: classes.deleteBtn }}
                        variant="outlined"
                        id={build(baseId, ids.BUTTONS.DELETE)}
                        className={classes.button}
                        startIcon={<Delete />}
                        onClick={() => {
                            setDeleteTeamDlgOpen(true);
                        }}
                    >
                        {t("common:delete")}
                    </Button>
                )}
            </Hidden>
            <Hidden smUp>
                <DotMenu
                    baseId={baseId}
                    render={(onClose) => [
                        !isAdmin && isMember && (
                            <MenuItem
                                key={build(baseId, ids.BUTTONS.LEAVE_MI)}
                                onClick={() => {
                                    onClose();
                                    setLeaveTeamDlgOpen(true);
                                }}
                            >
                                <ListItemIcon>
                                    <ExitToApp />
                                </ListItemIcon>
                                <ListItemText primary={t("leave")} />
                            </MenuItem>
                        ),
                        isAdmin && !isCreatingTeam && (
                            <MenuItem
                                key={build(baseId, ids.BUTTONS.DELETE_MI)}
                                onClick={() => {
                                    onClose();
                                    setDeleteTeamDlgOpen(true);
                                }}
                            >
                                <ListItemIcon>
                                    <Delete />
                                </ListItemIcon>
                                <ListItemText primary={t("common:delete")} />
                            </MenuItem>
                        ),
                    ]}
                />
            </Hidden>
            <ConfirmationDialog
                baseId={ids.EDIT_TEAM.LEAVE_TEAM_DLG}
                open={leaveTeamDlgOpen}
                onClose={() => setLeaveTeamDlgOpen(false)}
                onConfirm={() => {
                    setLeaveTeamDlgOpen(false);
                    onLeaveTeamSelected();
                }}
                title={t("leaveTeamTitle", { name: teamName })}
                contentText={t("leaveTeamText")}
                confirmButtonText={t("leave")}
            />
            <ConfirmationDialog
                baseId={ids.EDIT_TEAM.DELETE_TEAM_DLG}
                open={deleteTeamDlgOpen}
                onClose={() => setDeleteTeamDlgOpen(false)}
                onConfirm={() => {
                    setDeleteTeamDlgOpen(false);
                    onDeleteTeamSelected();
                }}
                title={t("deleteTeamTitle", { name: teamName })}
                contentText={t("deleteTeamText")}
                confirmButtonText={t("common:delete")}
            />
        </Toolbar>
    );
}

export default EditTeamToolbar;
