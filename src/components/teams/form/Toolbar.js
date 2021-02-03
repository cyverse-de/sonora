import React from "react";

import { build, DotMenu } from "@cyverse-de/ui-lib";
import {
    makeStyles,
    Button,
    Hidden,
    ListItemIcon,
    ListItemText,
    MenuItem,
    Toolbar,
} from "@material-ui/core";
import { Delete, ExitToApp, Save } from "@material-ui/icons";

import BackButton from "components/utils/BackButton";
import { useTranslation } from "i18n";
import ids from "../ids";
import styles from "../styles";

const useStyles = makeStyles(styles);

function EditTeamToolbar(props) {
    const { parentId, isAdmin, isMember } = props;
    const { t } = useTranslation(["teams", "common"]);
    const classes = useStyles();

    const baseId = build(parentId, ids.EDIT_TEAM.TOOLBAR);

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
                    >
                        {t("leave")}
                    </Button>
                )}
                {isAdmin && (
                    <Button
                        color="primary"
                        variant="outlined"
                        id={build(baseId, ids.BUTTONS.DELETE)}
                        className={classes.button}
                        startIcon={<Delete />}
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
                                }}
                            >
                                <ListItemIcon>
                                    <ExitToApp />
                                </ListItemIcon>
                                <ListItemText primary={t("leave")} />
                            </MenuItem>
                        ),
                        isAdmin && (
                            <MenuItem
                                key={build(baseId, ids.BUTTONS.DELETE_MI)}
                                onClick={() => {
                                    onClose();
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
        </Toolbar>
    );
}

export default EditTeamToolbar;
