import React from "react";

import { Button, Toolbar, useTheme } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

import { useTranslation } from "i18n";

import ids from "../ids";
import SearchField from "components/searchField/SearchField";
import buildID from "components/utils/DebugIDUtil";

function SubscriptionsToolbar(props) {
    const { baseId, handleSearch, isAdminView, searchTerm } = props;
    const { t } = useTranslation("subscriptions");
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
                    <Button
                        id={buildID(toolbarId, ids.ADD_BUTTON)}
                        variant="outlined"
                        style={{ marginLeft: theme.spacing(2) }}
                        color="primary"
                        startIcon={<AddIcon />}
                        // onClick={onAddClicked}
                    >
                        {t("add")}
                    </Button>
                </Toolbar>
            )}
        </>
    );
}

export default SubscriptionsToolbar;
