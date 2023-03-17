import React, { useState } from "react";
import { Button, makeStyles, Toolbar } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { Delete } from "@material-ui/icons";

import { useTranslation } from "i18n";
import ids from "../ids";
import buildID from "components/utils/DebugIDUtil";
import EditAddonDialog from "./EditAddon";

const useStyles = makeStyles((theme) => ({
    toolbarItems: {
        [theme.breakpoints.down("xs")]: {
            margin: theme.spacing(0.5),
        },
        [theme.breakpoints.up("sm")]: {
            margin: theme.spacing(1),
        },
    },
}));

function AddonsToolbar(props) {
    const { baseId, isAdminView, multipleSelected, onDeleteSelected } = props;
    const { t } = useTranslation("subscriptions");
    const toolbarId = buildID(baseId, ids.TOOLBAR);
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const classes = useStyles();

    return (
        <>
            {isAdminView && (
                <Toolbar variant="dense">
                    <Button
                        id={buildID(toolbarId, ids.ADD_BUTTON)}
                        variant="outlined"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => setAddDialogOpen(true)}
                    >
                        {t("add")}
                    </Button>
                    <EditAddonDialog
                        open={addDialogOpen}
                        onClose={() => setAddDialogOpen(false)}
                        parentId={baseId}
                    />
                    {multipleSelected && (
                        <Button
                            id={buildID(toolbarId, ids.DELETE_BUTTON)}
                            className={classes.toolbarItems}
                            variant="outlined"
                            color="primary"
                            startIcon={<Delete />}
                            onClick={onDeleteSelected}
                        >
                            {t("deleteAddon")}
                        </Button>
                    )}
                </Toolbar>
            )}
        </>
    );
}
export default AddonsToolbar;
