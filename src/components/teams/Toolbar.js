/**
 * @author aramsey
 *
 * The toolbar displayed when viewing teams
 * In mobile view, the buttons to create a team or view details will be
 * hidden within the dot menu
 */

import React, { useState } from "react";

import buildID from "components/utils/DebugIDUtil";
import DotMenu from "components/dotMenu/DotMenu";

import {
    Button,
    Hidden,
    ListItemIcon,
    ListItemText,
    makeStyles,
    MenuItem,
    TextField,
    Toolbar,
    Typography,
} from "@material-ui/core";
import { Help } from "@material-ui/icons";
import { AddTeamIcon } from "./Icons";

import ids from "./ids";
import styles from "./styles";
import { TEAM_FILTER } from "./index";
import { useTranslation } from "i18n";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Trans } from "react-i18next";
import DEDialog from "../utils/DEDialog";

const useStyles = makeStyles(styles);

function TeamToolbar(props) {
    const { parentId, teamFilter, setTeamFilter, onCreateTeamSelected } = props;
    const classes = useStyles();
    const { t } = useTranslation(["teams", "common"]);

    const [helpDlgOpen, setHelpDlgOpen] = useState(false);

    const onTeamFilterChange = (newValue) => {
        setTeamFilter(newValue);
    };

    const toolbarId = buildID(parentId, ids.TEAMS.TOOLBAR);
    const dotMenuId = buildID(toolbarId, ids.TEAMS.DOT_MENU);

    return (
        <Toolbar id={toolbarId} variant="dense">
            <Autocomplete
                id={buildID(toolbarId, ids.TEAMS.TEAM_FILTER)}
                disableClearable
                className={classes.filter}
                value={teamFilter}
                options={Object.values(TEAM_FILTER)}
                size="small"
                onChange={(event, newValue) => {
                    onTeamFilterChange(newValue);
                }}
                getOptionLabel={(option) =>
                    option === TEAM_FILTER.ALL_TEAMS
                        ? t("allTeams")
                        : t("myTeams")
                }
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={t("view")}
                        variant="outlined"
                    />
                )}
            />
            <div className={classes.divider} />
            <Hidden xsDown>
                <Button
                    color="primary"
                    variant="outlined"
                    id={buildID(toolbarId, ids.BUTTONS.CREATE_BTN)}
                    onClick={onCreateTeamSelected}
                    className={classes.button}
                    startIcon={<AddTeamIcon />}
                >
                    {t("team")}
                </Button>
                <Button
                    color="primary"
                    variant="outlined"
                    id={buildID(toolbarId, ids.BUTTONS.HELP_BTN)}
                    onClick={() => setHelpDlgOpen(true)}
                    className={classes.button}
                    startIcon={<Help />}
                >
                    {t("common:help")}
                </Button>
            </Hidden>
            <Hidden smUp>
                <DotMenu
                    baseId={dotMenuId}
                    render={(onClose) => [
                        <MenuItem
                            key={buildID(dotMenuId, ids.BUTTONS.CREATE_MI)}
                            id={buildID(dotMenuId, ids.BUTTONS.CREATE_MI)}
                            onClick={() => {
                                onClose();
                                onCreateTeamSelected();
                            }}
                        >
                            <ListItemIcon>
                                <AddTeamIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary={t("team")} />
                        </MenuItem>,
                        <MenuItem
                            key={buildID(dotMenuId, ids.BUTTONS.HELP_MI)}
                            id={buildID(dotMenuId, ids.BUTTONS.HELP_MI)}
                            onClick={() => {
                                onClose();
                                setHelpDlgOpen(true);
                            }}
                        >
                            <ListItemIcon>
                                <Help fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary={t("common:help")} />
                        </MenuItem>,
                    ]}
                />
            </Hidden>
            <DEDialog
                baseId={ids.TEAMS.HELP_DLG}
                open={helpDlgOpen}
                title={t("common:help")}
                onClose={() => {
                    setHelpDlgOpen(false);
                }}
            >
                <Typography component="div">
                    <Trans
                        t={t}
                        i18nKey="helpText"
                        components={{
                            p: <p />,
                        }}
                    />
                </Typography>
            </DEDialog>
        </Toolbar>
    );
}

export default TeamToolbar;
