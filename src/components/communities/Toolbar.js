/**
 * @author aramsey
 *
 * The toolbar displayed when viewing communities
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
    TextField,
    Toolbar,
    Typography,
} from "@material-ui/core";
import { Help } from "@material-ui/icons";
import Autocomplete from "@material-ui/lab/Autocomplete";

import ids from "./ids";
import styles from "./styles";
import { COMMUNITY_FILTER } from "./index";
import { useTranslation, Trans } from "i18n";

import DEDialog from "../utils/DEDialog";

const useStyles = makeStyles(styles);

function CommunityToolbar(props) {
    const { parentId, filter, setFilter } = props;
    const classes = useStyles();
    const { t } = useTranslation(["communities", "common"]);

    const [helpDlgOpen, setHelpDlgOpen] = useState(false);

    const onFilterChange = (newValue) => {
        setFilter(newValue);
    };

    const toolbarId = build(parentId, ids.TOOLBAR);
    const dotMenuId = build(toolbarId, ids.DOT_MENU);

    return (
        <Toolbar id={toolbarId} variant="dense">
            <Autocomplete
                id={build(toolbarId, ids.COMMUNITY_FILTER)}
                disableClearable
                className={classes.filter}
                value={filter}
                options={Object.values(COMMUNITY_FILTER)}
                size="small"
                onChange={(event, newValue) => {
                    onFilterChange(newValue);
                }}
                getOptionLabel={(option) =>
                    option === COMMUNITY_FILTER.ALL_COMMUNITIES
                        ? t("allCommunities")
                        : t("myCommunities")
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
                    id={build(toolbarId, ids.BUTTONS.HELP_BTN)}
                    onClick={() => setHelpDlgOpen(true)}
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
                            key={build(dotMenuId, ids.BUTTONS.HELP_MI)}
                            id={build(dotMenuId, ids.BUTTONS.HELP_MI)}
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
                baseId={ids.HELP_DLG}
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

export default CommunityToolbar;
