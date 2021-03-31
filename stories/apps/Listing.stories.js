import React from "react";
import { useTranslation } from "i18n";
import { AXIOS_DELAY, mockAxios } from "../axiosMock";
import { appListing, categories } from "./AppMocks";

import constants from "../../src/constants";
import appFields from "../../src/components/apps/appFields";
import { getFilters } from "components/apps/AppsTypeFilter";
import Listing from "../../src/components/apps/listing/Listing";
import { UploadTrackingProvider } from "../../src/contexts/uploadTracking";
import { UserProfileProvider } from "../../src/contexts/userProfile";

export default {
    title: "Apps / Listing",
};

function ListingTest(props) {
    //Note: the params must exactly with original call made by react-query
    mockAxios.onGet("/api/apps/categories?public=false").reply(200, categories);
    mockAxios.onGet(/\/api\/apps*/).reply(200, appListing);
    const { t } = useTranslation("apps");
    const fields = appFields(t);
    const selectedPage = 0;
    const selectedRowsPerPage = 25;
    const selectedOrder = constants.SORT_ASCENDING;
    const selectedOrderBy = fields.NAME.key;

    const selectedFilter = getFilters()[0];

    const selectedCategory = {
        name: constants.BROWSE_ALL_APPS,
        id: constants.BROWSE_ALL_APPS_ID,
    };

    return (
        <UploadTrackingProvider>
            <UserProfileProvider>
                <Listing
                    baseId="tableView"
                    onRouteToListing={(
                        order,
                        orderBy,
                        page,
                        rowsPerPage,
                        filter,
                        category
                    ) => {
                        console.log(
                            "onRouteToListing",
                            order,
                            orderBy,
                            page,
                            rowsPerPage,
                            filter,
                            category
                        );
                    }}
                    page={selectedPage}
                    rowsPerPage={selectedRowsPerPage}
                    order={selectedOrder}
                    orderBy={selectedOrderBy}
                    filter={selectedFilter}
                    category={selectedCategory}
                />
            </UserProfileProvider>
        </UploadTrackingProvider>
    );
}

export const AppsListingTest = () => {
    return <ListingTest />;
};

AppsListingTest.story = {
    parameters: {
        chromatic: { delay: AXIOS_DELAY * 2 + 500 },
    },
};
