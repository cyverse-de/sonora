import React from "react";

import { build, DotMenu, SearchField } from "@cyverse-de/ui-lib";
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
import { Group, GroupAdd, PeopleOutline } from "@material-ui/icons";

import ids from "./ids";
import styles from "./styles";
import { TEAM_FILTER } from "./index";
import { useTranslation } from "i18n";
import Autocomplete from "@material-ui/lab/Autocomplete";

const useStyles = makeStyles(styles);

function TeamToolbar(props) {
    const {
        parentId,
        teamFilter,
        setTeamFilter,
        searchTerm,
        setSearchTerm,
    } = props;
    const classes = useStyles();
    const { t } = useTranslation("teams");

    const onCreateTeamSelected = () => {
        console.log("Create a team!");
    };

    const onTeamFilterChange = (newValue) => {
        setTeamFilter(newValue);
        setSearchTerm("");
    };

    const toolbarId = build(parentId, ids.TEAMS.TOOLBAR);
    const dotMenuId = build(toolbarId, ids.TEAMS.DOT_MENU);

    return (
        <Toolbar id={toolbarId} variant="dense">
            <Hidden xsDown>
                <Autocomplete
                    id={build(toolbarId, ids.TEAMS.TEAM_FILTER)}
                    disableClearable
                    className={classes.filter}
                    value={teamFilter}
                    options={Object.keys(TEAM_FILTER)}
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
            </Hidden>
            <SearchField
                handleSearch={(value) => {
                    setSearchTerm(value);
                    setTeamFilter("");
                }}
                value={searchTerm}
                id={build(toolbarId, ids.TEAMS.SEARCH)}
                placeholder={t("searchTeams")}
            />
            <div className={classes.divider} />
            <Hidden xsDown>
                <Button
                    variant="contained"
                    id={build(toolbarId, ids.BUTTONS.CREATE_BTN)}
                    onClick={onCreateTeamSelected}
                >
                    <GroupAdd />
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
                                <GroupAdd fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary={t("team")} />
                        </MenuItem>,
                        teamFilter !== TEAM_FILTER.MY_TEAMS && (
                            <MenuItem
                                key={build(dotMenuId, ids.BUTTONS.MY_TEAMS_MI)}
                                id={build(dotMenuId, ids.BUTTONS.MY_TEAMS_MI)}
                                onClick={() => {
                                    onClose();
                                    onTeamFilterChange(TEAM_FILTER.MY_TEAMS);
                                }}
                            >
                                <ListItemIcon>
                                    <Group fontSize="small" />
                                </ListItemIcon>
                                <ListItemText primary={t("myTeams")} />
                            </MenuItem>
                        ),
                        teamFilter !== TEAM_FILTER.ALL_TEAMS && (
                            <MenuItem
                                key={build(dotMenuId, ids.BUTTONS.ALL_TEAMS_MI)}
                                id={build(dotMenuId, ids.BUTTONS.ALL_TEAMS_MI)}
                                onClick={() => {
                                    onClose();
                                    onTeamFilterChange(TEAM_FILTER.ALL_TEAMS);
                                }}
                            >
                                <ListItemIcon>
                                    <PeopleOutline fontSize="small" />
                                </ListItemIcon>
                                <ListItemText primary={t("allTeams")} />
                            </MenuItem>
                        ),
                    ]}
                />
            </Hidden>
        </Toolbar>
    );
}

export default TeamToolbar;
