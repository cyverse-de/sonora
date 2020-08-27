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

const errorResponse = {
    error_code: "ERR_GOOD_NEWS_EVERYONE",
    reason: "This error will only occur once! Please try again...",
};

export const AnalysesListingTest = () => {
    mockAxios.onGet(/\/api\/analyses*/).reply(200, listing);

    mockAxios.onPost("/api/analyses/relauncher").replyOnce(500, errorResponse);
    mockAxios.onPost("/api/analyses/relauncher").reply((config) => {
        console.log("Relaunch analysis", config.url, config.data);

        return [200, {}];
    });

    mockAxios.onPost("/api/analyses/shredder").replyOnce(500, errorResponse);
    mockAxios.onPost("/api/analyses/shredder").reply((config) => {
        console.log("Delete analysis", config.url, config.data);

        return [200, {}];
    });

    mockAxios.onPost(/\/api\/analyses\/.*\/stop/).replyOnce(500, errorResponse);
    mockAxios.onPost(/\/api\/analyses\/.*\/stop/).reply((config) => {
        console.log("Cancel analysis", config.url);

        return [
            200,
            {
                id: config.url.split("/")[3],
            },
        ];
    });

    mockAxios.onPatch(/\/api\/analyses*/).replyOnce(500, errorResponse);
    mockAxios.onPatch(/\/api\/analyses*/).reply((config) => {
        console.log("Edit analysis", config.url, config.data);
        const req = JSON.parse(config.data);

        return [
            200,
            {
                id: config.url.replace(/.*\//, ""),
                name: req?.name,
                description: req?.description,
            },
        ];
    });

    return <ListingTest />;
};
