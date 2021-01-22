/**
 * @author aramsey
 *
 * The toolbar displayed when viewing teams
 * In mobile view, the buttons to create a team or view details will be
 * hidden within the dot menu
 */

import React from "react";

import { build, DotMenu } from "@cyverse-de/ui-lib";
import {
    Button,
    Hidden,
    ListItemIcon,
    ListItemText,
    makeStyles,
    MenuItem,
    TextField,
    Toolbar,
} from "@material-ui/core";
import { AddTeamIcon } from "./Icons";

import ids from "./ids";
import styles from "./styles";
import { TEAM_FILTER } from "./index";
import { useTranslation } from "i18n";
import Autocomplete from "@material-ui/lab/Autocomplete";

const useStyles = makeStyles(styles);

function TeamToolbar(props) {
    const { parentId, teamFilter, setTeamFilter } = props;
    const classes = useStyles();
    const { t } = useTranslation("teams");

    const onCreateTeamSelected = () => {
        console.log("Create a team!");
    };

    const onTeamFilterChange = (newValue) => {
        setTeamFilter(newValue);
    };

    const toolbarId = build(parentId, ids.TEAMS.TOOLBAR);
    const dotMenuId = build(toolbarId, ids.TEAMS.DOT_MENU);

    return (
        <Toolbar id={toolbarId} variant="dense">
            <Autocomplete
                id={build(toolbarId, ids.TEAMS.TEAM_FILTER)}
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
                    id={build(toolbarId, ids.BUTTONS.CREATE_BTN)}
                    onClick={onCreateTeamSelected}
                    startIcon={<AddTeamIcon />}
                >
                    {t("team")}
                </Button>
            </Hidden>
            <Hidden smUp>
                <DotMenu
                    baseId={dotMenuId}
                    render={(onClose) => [
                        <MenuItem
                            key={build(dotMenuId, ids.BUTTONS.CREATE_MI)}
                            id={build(dotMenuId, ids.BUTTONS.CREATE_MI)}
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
                    ]}
                />
            </Hidden>
        </Toolbar>
    );
}

export default TeamToolbar;
