import React, { useState } from "react";

import { Button, Toolbar, useTheme, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import { useTranslation } from "i18n";

import ids from "../ids";
import SearchField from "components/searchField/SearchField";
import buildID from "components/utils/DebugIDUtil";
import EditSubscriptionDialog from "../edit/EditSubscription";

function SubscriptionsToolbar(props) {
    const { baseId, handleSearch, isAdminView, searchTerm } = props;
    const { t } = useTranslation("subscriptions");
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const toolbarId = buildID(baseId, ids.TOOLBAR);
    const theme = useTheme();

    return (
        <>
            {isAdminView && (
                <Toolbar variant="dense">
                    <SearchField
                        id={buildID(toolbarId, ids.SEARCH_FIELD)}
                        handleSearch={handleSearch}
                        value={searchTerm}
                        placeholder={t("searchUsers")}
                    />

                    <Tooltip
                        title={t("addTooltip")}
                        id={buildID(baseId, ids.ADD_BUTTON_TOOLTIP)}
                    >
                        <Button
                            id={buildID(toolbarId, ids.ADD_BUTTON)}
                            variant="outlined"
                            style={{ marginLeft: theme.spacing(2) }}
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={() => setAddDialogOpen(true)}
                        >
                            {t("add")}
                        </Button>
                    </Tooltip>

                    <EditSubscriptionDialog
                        open={addDialogOpen}
                        onClose={() => setAddDialogOpen(false)}
                        parentId={baseId}
                    />
                </Toolbar>
            )}
        </>
    );
}

export default SubscriptionsToolbar;
