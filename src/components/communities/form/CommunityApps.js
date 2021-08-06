/**
 * @author aramsey
 *
 * A component that allows a user to view/edit the community apps
 */

import React, { useEffect, useState } from "react";

import buildID from "components/utils/DebugIDUtil";
import { getIn } from "formik";

import TableView from "components/apps/listing/TableView";
import SimpleExpansionPanel from "components/tools/SimpleExpansionPanel";
import { useTranslation } from "i18n";
import ids from "../ids";
import GlobalSearchField from "../../search/GlobalSearchField";
import SearchConstants from "../../search/constants";
import AppSearchDrawer from "../../search/detailed/AppSearchDrawer";
import Toolbar from "@material-ui/core/Toolbar";
import constants from "../../../constants";
import { getSorting, stableSort } from "../../table/TableSort";

function CommunityApps(props) {
    const {
        parentId,
        isAdmin,
        push,
        remove,
        form: { values },
        name,
    } = props;
    const appList = getIn(values, name);
    const { t } = useTranslation(["communities", "sharing"]);
    const [sortedApps, setSortedApps] = useState(appList);
    const [searchTerm, setSearchTerm] = useState("");
    const [viewSettings, setViewSettings] = useState({
        order: constants.SORT_ASCENDING,
        orderBy: "name",
    });

    const baseId = buildID(parentId, ids.APP_LIST);

    const onAddApp = (app) => {
        if (!appList.find((resource) => resource.id === app.id)) {
            push(app);
        }
    };

    const onAddApps = (apps) => {
        apps.forEach(onAddApp);
    };

    const onDeleteSelected = (app) => {
        const index = appList.findIndex((item) => item.id === app.id);
        remove(index);
    };

    useEffect(() => {
        setSortedApps(
            stableSort(
                appList,
                getSorting(viewSettings.order, viewSettings.orderBy)
            )
        );
    }, [appList, viewSettings]);

    const handleRequestSort = (event, property) => {
        const isAsc =
            viewSettings.orderBy === property &&
            viewSettings.order === constants.SORT_ASCENDING;
        setViewSettings({
            order: isAsc ? constants.SORT_DESCENDING : constants.SORT_ASCENDING,
            orderBy: property,
        });
    };

    return (
        <SimpleExpansionPanel
            header={t("communityApps")}
            defaultExpanded={true}
            parentId={baseId}
        >
            {isAdmin && (
                <Toolbar>
                    <GlobalSearchField
                        outlined
                        singleSearchOption={true}
                        selectedFilter={SearchConstants.APPS}
                        onShowDetailedSearch={(query) =>
                            setSearchTerm(query?.searchTerm)
                        }
                        onOptionSelected={onAddApp}
                    />
                </Toolbar>
            )}
            <TableView
                loading={false}
                listing={{ apps: sortedApps }}
                baseId={baseId}
                order={viewSettings.order}
                orderBy={viewSettings.orderBy}
                enableSorting={true}
                enableMenu={false}
                enableSelection={false}
                enableDelete={isAdmin}
                isAdminView={false}
                onDeleteSelected={onDeleteSelected}
                handleRequestSort={handleRequestSort}
            />
            <AppSearchDrawer
                open={searchTerm.length > 0}
                onConfirm={(apps) => {
                    onAddApps(apps);
                    setSearchTerm("");
                }}
                onClose={() => setSearchTerm("")}
                searchTerm={searchTerm}
            />
        </SimpleExpansionPanel>
    );
}

export default CommunityApps;
