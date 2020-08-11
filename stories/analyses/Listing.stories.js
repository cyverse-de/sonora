import React from "react";
import Listing from "../../src/components/analyses/listing/Listing";
import analysisFields from "../../src/components/analyses/analysisFields";
import constants from "../../src/constants";
import { mockAxios } from "../axiosMock";
import { listing } from "./AnalysesMocks";
import { NotificationsProvider } from "../../src/contexts/pushNotifications";

export default {
    title: "Analyses",
};

function ListingTest(props) {
    const selectedPage = 0;
    const selectedRowsPerPage = 25;
    const selectedOrder = constants.SORT_DESCENDING;
    const selectedOrderBy = analysisFields.START_DATE.key;
    const selectedPermFilter = null;
    const selectedTypeFilter = null;
    return (
        <NotificationsProvider>
            <Listing
                baseId="tableView"
                selectedPage={selectedPage}
                selectedRowsPerPage={selectedRowsPerPage}
                selectedOrder={selectedOrder}
                selectedOrderBy={selectedOrderBy}
                selectedPermFilter={selectedPermFilter}
                selectedTypeFilter={selectedTypeFilter}
                onRouteToListing={(
                    order,
                    orderBy,
                    page,
                    rowsPerPage,
                    permFilter,
                    appTypeFilter
                ) => {
                    console.log(
                        "onRouteToListing",
                        order,
                        orderBy,
                        page,
                        rowsPerPage,
                        permFilter,
                        appTypeFilter
                    );
                }}
                handleGoToOutputFolder={(analysis) =>
                    console.log("Go to output folder", analysis?.resultfolderid)
                }
                handleSingleRelaunch={(analysis) =>
                    console.log("Relaunch Analysis", analysis?.id)
                }
            />
        </NotificationsProvider>
    );
}

export const AnalysesListingTest = () => {
    mockAxios.onGet(/\/api\/analyses*/).reply(200, listing);
    mockAxios.onPost("/api/analyses/relauncher").reply(200);
    mockAxios.onPost("/api/analyses/shredder").reply(200);

    return <ListingTest />;
};
