import React from "react";

import { useTranslation } from "i18n";

import { AXIOS_DELAY, errorResponseJSON, mockAxios } from "../axiosMock";
import userProfileMock from "../userProfileMock";

import { appListing, categories } from "./AppMocks";

import constants from "../../src/constants";
import appFields from "components/apps/appFields";
import { getFilters } from "components/apps/AppsTypeFilter";
import Listing from "components/apps/listing/Listing";

import { UploadTrackingProvider } from "contexts/uploadTracking";
import { UserProfileProvider, useUserProfile } from "contexts/userProfile";
import { myCollectionList } from "../collections/CollectionMocks";

export default {
    title: "Apps / Listing",
};

function ListingTest(props) {
    //Note: the params must exactly with original call made by react-query
    mockAxios.reset();
    mockAxios.onGet("/api/apps/categories?public=false").reply(200, categories);
    mockAxios.onGet(/\/api\/apps*/).reply(200, appListing);

    mockAxios.onPost(/\/api\/apps\/.*\/copy/).replyOnce(500, errorResponseJSON);
    mockAxios.onPost(/\/api\/apps\/.*\/copy/).reply((config) => {
        console.log("Copy App", config.url);
        const url = config.url.split("/");
        return [200, { system_id: url[3], id: url[4] }];
    });

    mockAxios.onDelete(/\/api\/apps\/.*/).replyOnce(500, errorResponseJSON);
    mockAxios.onDelete(/\/api\/apps\/.*/).reply((config) => {
        console.log("Delete App", config.url);
        return [200];
    });
    mockAxios.onGet("/api/communities").reply(200, myCollectionList);

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

    const [userProfile, setUserProfile] = useUserProfile();

    React.useEffect(() => {
        setUserProfile(userProfileMock);
    }, [userProfile, setUserProfile]);

    return (
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
    );
}

export const AppsListingTest = () => {
    return (
        <UploadTrackingProvider>
            <UserProfileProvider>
                <ListingTest />
            </UserProfileProvider>
        </UploadTrackingProvider>
    );
};

AppsListingTest.story = {
    parameters: {
        chromatic: { delay: AXIOS_DELAY * 2 + 500 },
    },
};
