import React, { useState } from "react";
import { Button, Toolbar } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

import { useTranslation } from "i18n";
import ids from "../ids";
import buildID from "components/utils/DebugIDUtil";
import EditAddonDialog from "./EditAddon";

function AddonsToolbar(props) {
    const { baseId, isAdminView } = props;
    const { t } = useTranslation("subscriptions");
    const toolbarId = buildID(baseId, ids.TOOLBAR);
    const [addDialogOpen, setAddDialogOpen] = useState(false);

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
                </Toolbar>
            )}
        </>
    );
}
export default AddonsToolbar;
