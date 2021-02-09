/**
 * @author sriram
 *
 * A toolbar with actions for admin DOI Request listing
 *
 */
import React from "react";
import { useTranslation } from "i18n";

import ids from "./ids";
import { build } from "@cyverse-de/ui-lib";
import {
    Button,
    IconButton,
    makeStyles,
    Toolbar,
    useTheme,
    useMediaQuery,
} from "@material-ui/core";
import UpdateIcon from "@material-ui/icons/Update";
import ViewListIcon from "@material-ui/icons/ViewList";
import AddCircleIcon from "@material-ui/icons/AddCircle";

const useStyles = makeStyles((theme) => ({
    divider: {
        flexGrow: 1,
    },
    toolbarItems: {
        margin: theme.spacing(1),
    },
}));

export default function DOIToolbar(props) {
    const { baseId, selected, onUpdateClick, onMetadataSelected } = props;
    const { t } = useTranslation("doi");
    const classes = useStyles();
    const toolbarId = build(baseId, ids.toolbarId);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

    return (
        <>
            <Toolbar variant="dense" id={toolbarId}>
                {!isMobile && selected && (
                    <>
                        <div className={classes.divider} />
                        <Button
                            id={build(toolbarId, ids.UPDATE_REQUEST_BTN)}
                            startIcon={<UpdateIcon />}
                            color="primary"
                            size="small"
                            variant="outlined"
                            className={classes.toolbarItems}
                            onClick={onUpdateClick}
                        >
                            {t("updateRequest")}
                        </Button>
                        <Button
                            id={build(toolbarId, ids.VIEW_METADATA_BTN)}
                            startIcon={<ViewListIcon />}
                            color="primary"
                            size="small"
                            variant="outlined"
                            className={classes.toolbarItems}
                            onClick={() => onMetadataSelected(selected)}
                        >
                            {t("viewMetadata")}
                        </Button>
                        <Button
                            id={build(toolbarId, ids.CREATE_DOI_BTN)}
                            startIcon={<AddCircleIcon />}
                            color="primary"
                            size="small"
                            variant="outlined"
                            className={classes.toolbarItems}
                        >
                            {t("createDoi")}
                        </Button>
                    </>
                )}
                {isMobile && selected && (
                    <>
                        <IconButton
                            id={build(toolbarId, ids.UPDATE_REQUEST_BTN)}
                            color="primary"
                            variant="outlined"
                            className={classes.toolbarItems}
                            onClick={onUpdateClick}
                        >
                            <UpdateIcon />
                        </IconButton>
                        <IconButton
                            id={build(toolbarId, ids.VIEW_METADATA_BTN)}
                            color="primary"
                            variant="outlined"
                            className={classes.toolbarItems}
                        >
                            <ViewListIcon />
                        </IconButton>
                        <IconButton
                            id={build(toolbarId, ids.CREATE_DOI_BTN)}
                            color="primary"
                            variant="outlined"
                            className={classes.toolbarItems}
                        >
                            <AddCircleIcon />
                        </IconButton>
                    </>
                )}
            </Toolbar>
        </>
    );
}
