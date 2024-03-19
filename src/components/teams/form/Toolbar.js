/**
 * @author aramsey
 *
 * A toolbar that displays above the form for editing teams
 *
 * This toolbar contains buttons for saving, deleting, and leaving a team
 */

import React, { useState } from "react";

import buildID from "components/utils/DebugIDUtil";
import DotMenu from "components/dotMenu/DotMenu";

import {
    Button,
    ListItemIcon,
    ListItemText,
    MenuItem,
    Toolbar,
} from "@mui/material";
import { makeStyles } from "tss-react/mui";
import { Delete, EmojiPeople, ExitToApp, Save } from "@mui/icons-material";

import BackButton from "components/utils/BackButton";
import { useTranslation } from "i18n";
import ids from "../ids";
import styles from "../styles";
import ConfirmationDialog from "../../utils/ConfirmationDialog";
import JoinTeamDialog from "../dialogs/JoinTeamDialog";
import { groupShortName } from "../util";
import useBreakpoints from "components/layout/useBreakpoints";

const useStyles = makeStyles()(styles);

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
    const { classes } = useStyles();

    const [leaveTeamDlgOpen, setLeaveTeamDlgOpen] = useState(false);
    const [deleteTeamDlgOpen, setDeleteTeamDlgOpen] = useState(false);
    const [joinTeamDlgOpen, setJoinTeamDlgOpen] = useState(false);

    const baseId = buildID(parentId, ids.EDIT_TEAM.TOOLBAR);
    const teamShortName = groupShortName(teamName);
    const isCreatingTeam = !teamName;

    const leaveEnabled = !isAdmin && isMember;
    const joinEnabled = !isAdmin && !isMember;
    const deleteEnabled = isAdmin && !isCreatingTeam;
    const { isSmDown, isSmUp } = useBreakpoints();

    return (
        <Toolbar variant="dense">
            <BackButton />
            {isAdmin && (
                <Button
                    type="submit"
                    color="primary"
                    variant="outlined"
                    id={buildID(baseId, ids.BUTTONS.SAVE_BTN)}
                    className={classes.button}
                    startIcon={<Save />}
                    onClick={handleSubmit}
                >
                    {t("common:save")}
                </Button>
            )}
            <div className={classes.divider} />
            {!isSmDown && (
                <>
                    {leaveEnabled && (
                        <Button
                            color="primary"
                            variant="outlined"
                            id={buildID(baseId, ids.BUTTONS.LEAVE_BTN)}
                            className={classes.button}
                            startIcon={<ExitToApp />}
                            onClick={() => {
                                setLeaveTeamDlgOpen(true);
                            }}
                        >
                            {t("leave")}
                        </Button>
                    )}
                    {joinEnabled && (
                        <Button
                            color="primary"
                            variant="outlined"
                            id={buildID(baseId, ids.BUTTONS.JOIN_BTN)}
                            className={classes.button}
                            startIcon={<EmojiPeople />}
                            onClick={() => {
                                setJoinTeamDlgOpen(true);
                            }}
                        >
                            {t("join")}
                        </Button>
                    )}
                    {deleteEnabled && (
                        <Button
                            classes={{ root: classes.deleteBtn }}
                            variant="outlined"
                            id={buildID(baseId, ids.BUTTONS.DELETE)}
                            className={classes.button}
                            startIcon={<Delete />}
                            onClick={() => {
                                setDeleteTeamDlgOpen(true);
                            }}
                        >
                            {t("common:delete")}
                        </Button>
                    )}
                </>
            )}

            {!isSmUp && (
                <DotMenu
                    baseId={baseId}
                    render={(onClose) => [
                        leaveEnabled && (
                            <MenuItem
                                key={buildID(baseId, ids.BUTTONS.LEAVE_MI)}
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
                        joinEnabled && (
                            <MenuItem
                                key={buildID(baseId, ids.BUTTONS.JOIN_MI)}
                                onClick={() => {
                                    onClose();
                                    setJoinTeamDlgOpen(true);
                                }}
                            >
                                <ListItemIcon>
                                    <EmojiPeople />
                                </ListItemIcon>
                                <ListItemText primary={t("join")} />
                            </MenuItem>
                        ),
                        deleteEnabled && (
                            <MenuItem
                                key={buildID(baseId, ids.BUTTONS.DELETE_MI)}
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
            )}
            <ConfirmationDialog
                baseId={ids.EDIT_TEAM.LEAVE_TEAM_DLG}
                open={leaveTeamDlgOpen}
                onClose={() => setLeaveTeamDlgOpen(false)}
                onConfirm={() => {
                    setLeaveTeamDlgOpen(false);
                    onLeaveTeamSelected();
                }}
                title={t("leaveTeamTitle", { name: teamShortName })}
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
                title={t("deleteTeamTitle", { name: teamShortName })}
                contentText={t("deleteTeamText")}
                confirmButtonText={t("common:delete")}
            />
            <JoinTeamDialog
                open={joinTeamDlgOpen}
                onClose={() => setJoinTeamDlgOpen(false)}
                teamName={teamName}
            />
        </Toolbar>
    );
}

export default EditTeamToolbar;
