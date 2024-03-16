/**
 * @author aramsey
 *
 * The toolbar displayed when viewing collections
 */

import React, { useState } from "react";

import buildID from "components/utils/DebugIDUtil";
import DotMenu from "components/dotMenu/DotMenu";

import {
    Button,
    ListItemIcon,
    ListItemText,
    MenuItem,
    TextField,
    Toolbar,
    Typography,
} from "@mui/material";
import { makeStyles } from "tss-react/mui";
import { Add, Help } from "@mui/icons-material";

import ids from "./ids";
import styles from "./styles";
import { COLLECTION_FILTER } from "./index";
import { useTranslation } from "i18n";

import DEDialog from "../utils/DEDialog";
import useBreakpoints from "components/layout/useBreakpoints";

const useStyles = makeStyles()(styles);

function CollectionToolbar(props) {
    const { parentId, filter, setFilter, onCreateCollectionSelected } = props;
    const { classes } = useStyles();
    const { t } = useTranslation(["collections", "common"]);

    const [helpDlgOpen, setHelpDlgOpen] = useState(false);

    const onFilterChange = (event) => {
        setFilter(event.target.value);
    };

    const toolbarId = buildID(parentId, ids.TOOLBAR);
    const dotMenuId = buildID(toolbarId, ids.DOT_MENU);
    const { isSmDown, isSmUp } = useBreakpoints();

    return (
        <Toolbar id={toolbarId} variant="dense">
            <TextField
                id={buildID(toolbarId, ids.COLLECTION_FILTER)}
                label={t("view")}
                value={filter}
                onChange={onFilterChange}
                variant="outlined"
                select
                margin="dense"
            >
                <MenuItem
                    value={COLLECTION_FILTER.ALL_COLLECTIONS}
                    key={COLLECTION_FILTER.ALL_COLLECTIONS}
                    id={buildID()}
                >
                    {t("allCollections")}
                </MenuItem>
                <MenuItem
                    value={COLLECTION_FILTER.MY_COLLECTIONS}
                    key={COLLECTION_FILTER.MY_COLLECTIONS}
                    id={buildID()}
                >
                    {t("myCollections")}
                </MenuItem>
            </TextField>
            <div className={classes.divider} />
            {!isSmDown && (
                <Button
                    color="primary"
                    variant="outlined"
                    id={buildID(toolbarId, ids.BUTTONS.CREATE_BTN)}
                    onClick={onCreateCollectionSelected}
                    startIcon={<Add />}
                    classes={{ root: classes.button }}
                >
                    {t("createCollection")}
                </Button>
            )}
            {!isSmDown && (
                <Button
                    color="primary"
                    variant="outlined"
                    id={buildID(toolbarId, ids.BUTTONS.HELP_BTN)}
                    onClick={() => setHelpDlgOpen(true)}
                    startIcon={<Help />}
                >
                    {t("common:help")}
                </Button>
            )}
            {!isSmUp && (
                <DotMenu
                    baseId={dotMenuId}
                    render={(onClose) => [
                        <MenuItem
                            key={buildID(dotMenuId, ids.BUTTONS.CREATE_MI)}
                            id={buildID(dotMenuId, ids.BUTTONS.CREATE_MI)}
                            onClick={() => {
                                onClose();
                                onCreateCollectionSelected();
                            }}
                        >
                            <ListItemIcon>
                                <Add fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary={t("createCollection")} />
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
            )}
            <DEDialog
                baseId={ids.HELP_DLG}
                open={helpDlgOpen}
                title={t("common:help")}
                onClose={() => {
                    setHelpDlgOpen(false);
                }}
            >
                <Typography component="div">{t("helpText")}</Typography>
            </DEDialog>
        </Toolbar>
    );
}

export default CollectionToolbar;
