/**
 * @author aramsey
 *
 * A component that allows a user to view/edit the community apps
 */

import React, { useEffect, useState } from "react";

import { Toolbar, Typography } from "@material-ui/core";
import { getIn } from "formik";

import { announce } from "components/announcer/CyVerseAnnouncer";
import { ERROR } from "components/announcer/AnnouncerConstants";
import AppDetails from "components/apps/details/Drawer";
import TableView from "components/apps/listing/TableView";
import GlobalSearchField from "components/search/GlobalSearchField";
import SearchConstants from "components/search/constants";
import AppSearchDrawer from "components/search/detailed/AppSearchDrawer";
import { getSorting, stableSort } from "components/table/TableSort";
import SimpleExpansionPanel from "components/tools/SimpleExpansionPanel";
import buildID from "components/utils/DebugIDUtil";

import constants from "constants.js";
import { useTranslation } from "i18n";
import ids from "../ids";

function CommunityApps(props) {
    const {
        parentId,
        isAdmin,
        push,
        remove,
        form: { values },
        name,
        loading,
    } = props;
    const appList = getIn(values, name);
    const { t } = useTranslation(["communities", "sharing"]);
    const [sortedApps, setSortedApps] = useState(appList);
    const [searchTerm, setSearchTerm] = useState("");
    const [viewSettings, setViewSettings] = useState({
        order: constants.SORT_ASCENDING,
        orderBy: "name",
    });
    const [detailsApp, setDetailsApp] = useState(null);

    const baseId = buildID(parentId, ids.APP_LIST);

    const isExternalApp = (app) => {
        return (
            app?.app_type.toUpperCase() ===
            constants.APP_TYPE_EXTERNAL.toUpperCase()
        );
    };

    const onAddApp = (app) => {
        if (isExternalApp(app)) {
            announce({
                text: t("noExternalApps"),
                variant: ERROR,
            });
        } else if (!appList.find((resource) => resource.id === app.id)) {
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

    const onDetailsSelected = (app) => {
        setDetailsApp(app);
    };

    const validateAppSelection = (apps) => {
        if (apps.some(isExternalApp)) {
            return t("noExternalApps");
        }
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
                <>
                    <Typography>{t("noExternalAppsNote")}</Typography>
                    <Toolbar>
                        <GlobalSearchField
                            outlined
                            hideDropDown={true}
                            singleSearchOption={true}
                            selectedFilter={SearchConstants.APPS}
                            onShowDetailedSearch={(query) =>
                                setSearchTerm(query?.searchTerm)
                            }
                            onOptionSelected={onAddApp}
                            placeholder={t("searchApps")}
                        />
                    </Toolbar>
                </>
            )}
            <TableView
                loading={loading}
                listing={{ apps: sortedApps }}
                baseId={baseId}
                order={viewSettings.order}
                orderBy={viewSettings.orderBy}
                enableSorting={true}
                enableMenu={false}
                enableSelection={false}
                enableDelete={isAdmin}
                isAdminView={false}
                enableActionCell={true}
                onDeleteSelected={onDeleteSelected}
                onDetailsSelected={onDetailsSelected}
                handleRequestSort={handleRequestSort}
            />
            <AppSearchDrawer
                open={searchTerm?.length > 0}
                onConfirm={(apps) => {
                    onAddApps(apps);
                    setSearchTerm("");
                }}
                onClose={() => setSearchTerm("")}
                searchTerm={searchTerm}
                validateSelection={validateAppSelection}
            />
            <AppDetails
                open={!!detailsApp}
                appId={detailsApp?.id}
                systemId={detailsApp?.system_id}
                baseId={baseId}
                onClose={() => setDetailsApp(null)}
            />
        </SimpleExpansionPanel>
    );
}

export default CommunityApps;
