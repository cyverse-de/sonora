import React from "react";
import { Toolbar } from "@material-ui/core";
import { useTranslation } from "i18n";
import SearchField from "components/searchField/SearchField";

function SubscriptionsToolbar(props) {
    const { handleSearch, isAdminView, searchTerm } = props;
    const { t } = useTranslation("subscriptions");
    return (
        <>
            {isAdminView && (
                <Toolbar variant="dense">
                    <SearchField
                        handleSearch={handleSearch}
                        value={searchTerm}
                        id="1"
                        placeholder={t("searchUsers")}
                    />
                    {/* admin/refgenomes */}
                </Toolbar>
            )}
        </>
    );
}

export default SubscriptionsToolbar;
