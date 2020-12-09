import React from "react";

import { build, SearchField } from "@cyverse-de/ui-lib";
import {
    Button,
    Select,
    MenuItem,
    Toolbar,
    makeStyles,
} from "@material-ui/core";
import { Add } from "@material-ui/icons";

import ids from "./ids";
import styles from "./styles";
import { TEAM_FILTER } from "./index";
import { useTranslation } from "i18n";

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

    const teamFilterId = build(parentId, ids.TEAMS.TEAM_FILTER);

    const onCreateTeamSelected = () => {
        console.log("Create a team!");
    };

    return (
        <Toolbar id={build(parentId, ids.TEAMS.TOOLBAR)} variant="dense">
            <Select
                value={teamFilter}
                onChange={(event) => {
                    setTeamFilter(event.target.value);
                    setSearchTerm("");
                }}
                id={teamFilterId}
            >
                <MenuItem
                    value={TEAM_FILTER.MY_TEAMS}
                    id={build(teamFilterId, ids.TEAMS.MY_TEAMS_MI)}
                >
                    {t("myTeams")}
                </MenuItem>
                <MenuItem
                    value={TEAM_FILTER.ALL_TEAMS}
                    id={build(teamFilterId, ids.TEAMS.ALL_TEAMS_MI)}
                >
                    {t("allTeams")}
                </MenuItem>
            </Select>
            <SearchField
                handleSearch={(value) => {
                    setSearchTerm(value);
                    setTeamFilter("");
                }}
                value={searchTerm}
                id={build(parentId, ids.TEAMS.SEARCH)}
                placeholder={t("searchTeams")}
            />
            <div className={classes.divider} />
            <Button
                variant="contained"
                id={build(parentId, ids.BUTTONS.CREATE_BTN)}
                onClick={onCreateTeamSelected}
            >
                <Add />
                {t("create")}
            </Button>
        </Toolbar>
    );
}

export default TeamToolbar;
