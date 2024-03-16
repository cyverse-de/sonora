/**
 * @author sriram
 *
 * A toolbar with actions for admin DOI Request listing
 *
 */
import React from "react";
import { useTranslation } from "i18n";

import ids from "./ids";
import buildID from "components/utils/DebugIDUtil";
import {
    Button,
    IconButton,
    Toolbar,
    useTheme,
    useMediaQuery,
} from "@mui/material";
import { makeStyles } from "tss-react/mui";
import UpdateIcon from "@mui/icons-material/Update";
import ViewListIcon from "@mui/icons-material/ViewList";
import AddCircleIcon from "@mui/icons-material/AddCircle";

const useStyles = makeStyles()((theme) => ({
    divider: {
        flexGrow: 1,
    },
    toolbarItems: {
        margin: theme.spacing(1),
    },
}));

export default function DOIToolbar(props) {
    const {
        baseId,
        selected,
        onUpdateClick,
        onMetadataClick,
        onCreateDOIClick,
    } = props;
    const { t } = useTranslation("doi");
    const { t: i18nUtil } = useTranslation("util");
    const { classes } = useStyles();
    const toolbarId = buildID(baseId, ids.toolbarId);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <>
            <Toolbar variant="dense" id={toolbarId}>
                {!isMobile && selected && (
                    <>
                        <div className={classes.divider} />
                        <Button
                            id={buildID(toolbarId, ids.UPDATE_REQUEST_BTN)}
                            startIcon={<UpdateIcon />}
                            color="primary"
                            size="small"
                            variant="outlined"
                            className={classes.toolbarItems}
                            onClick={onUpdateClick}
                        >
                            {i18nUtil("updateRequest")}
                        </Button>
                        <Button
                            id={buildID(toolbarId, ids.VIEW_METADATA_BTN)}
                            startIcon={<ViewListIcon />}
                            color="primary"
                            size="small"
                            variant="outlined"
                            className={classes.toolbarItems}
                            onClick={() => onMetadataClick(selected)}
                        >
                            {t("viewMetadata")}
                        </Button>
                        <Button
                            id={buildID(toolbarId, ids.CREATE_DOI_BTN)}
                            startIcon={<AddCircleIcon />}
                            color="primary"
                            size="small"
                            variant="outlined"
                            className={classes.toolbarItems}
                            onClick={() => onCreateDOIClick()}
                        >
                            {t("createDoi")}
                        </Button>
                    </>
                )}
                {isMobile && selected && (
                    <>
                        <IconButton
                            id={buildID(toolbarId, ids.UPDATE_REQUEST_BTN)}
                            color="primary"
                            variant="outlined"
                            className={classes.toolbarItems}
                            onClick={onUpdateClick}
                            size="large"
                        >
                            <UpdateIcon />
                        </IconButton>
                        <IconButton
                            id={buildID(toolbarId, ids.VIEW_METADATA_BTN)}
                            color="primary"
                            variant="outlined"
                            className={classes.toolbarItems}
                            onClick={() => onMetadataClick(selected)}
                            size="large"
                        >
                            <ViewListIcon />
                        </IconButton>
                        <IconButton
                            id={buildID(toolbarId, ids.CREATE_DOI_BTN)}
                            color="primary"
                            variant="outlined"
                            className={classes.toolbarItems}
                            onClick={() => onCreateDOIClick()}
                            size="large"
                        >
                            <AddCircleIcon />
                        </IconButton>
                    </>
                )}
            </Toolbar>
        </>
    );
}
