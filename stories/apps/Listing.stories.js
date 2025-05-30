import React from "react";

import { useTranslation } from "i18n";

import { AXIOS_DELAY, errorResponseJSON, mockAxios } from "../axiosMock";
import userProfileMock from "../userProfileMock";
import {
    usageSummaryBasicSubscriptionResponse,
    usageSummaryResponse,
} from "../usageSummaryMock";

import {
    adminDetails,
    appDetails,
    appDocumentation,
    appListing,
    categories,
} from "./AppMocks";
import {
    appPermissionListResponse,
    appShareResponse,
    appUnshareResponse,
} from "../sharing/SharingMocks";
import {
    collabListMemberResp,
    userInfoMemberResp,
    userInfoResp,
} from "../UserInfoMocks";

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

function ListingTest({ isAdminView, usageSummaryResponse }) {
    //Note: the params must exactly with original call made by react-query
    mockAxios.reset();
    mockAxios.onGet("/api/apps/categories?public=false").reply(200, categories);

    mockAxios.onGet(/\/api\/apps\/de\/.*details/).reply(200, appDetails);
    mockAxios
        .onGet(/\/api\/admin\/apps\/de\/.*details/)
        .reply(200, adminDetails);

    mockAxios
        .onGet(
            new RegExp(
                `/api/apps/de/${appDocumentation.app_id}/.*documentation`
            )
        )
        .reply(200, appDocumentation);

    mockAxios.onGet(/\/api\/admin\/apps*/).reply((config) => {
        console.log("Admin Get Apps", config.url);
        const adminAppListing = {
            total: appListing.total,
            apps: [{ ...adminDetails, deleted: true }, ...appListing.apps],
        };

        return [200, adminAppListing];
    });
    mockAxios.onPatch(/\/api\/admin\/apps\/de\/.*/).reply((config) => {
        console.log("Admin Update App", config.url, JSON.parse(config.data));
        return [200, {}];
    });

    mockAxios.onGet(/\/api\/apps*/).reply((config) => {
        console.log("Get Apps", config.url);
        return [200, appListing];
    });

    mockAxios.onPost(/\/api\/apps\/.*\/copy/).replyOnce(500, errorResponseJSON);
    mockAxios.onPost(/\/api\/apps\/.*\/copy/).reply((config) => {
        console.log("Copy App", config.url);
        const url = config.url.split("/");
        return [200, { system_id: url[3], id: url[4], version_id: url[6] }];
    });

    mockAxios.onDelete(/\/api\/apps\/.*/).replyOnce(500, errorResponseJSON);
    mockAxios.onDelete(/\/api\/apps\/.*/).reply((config) => {
        console.log("Delete App", config.url);
        return [200];
    });
    mockAxios.onGet("/api/communities").reply(200, myCollectionList);

    mockAxios.onGet(/\/api\/subjects.*/).reply(200, {
        subjects: [
            ...Object.values(userInfoResp),
            { id: "test_user", email: "test@test.com", name: "Testy Test" },
        ],
    });
    mockAxios
        .onGet(/\/api\/user-info.*username=alfred.*/)
        .reply(200, userInfoResp);
    mockAxios
        .onPost(/\/api\/apps\/permission-lister/)
        .reply(200, appPermissionListResponse);
    mockAxios.onPost(/\/api(\/admin)?\/apps\/sharing/).reply((config) => {
        console.log("Sharing request", config.url, JSON.parse(config.data));
        return [200, appShareResponse];
    });
    mockAxios.onPost(/\/api(\/admin)?\/apps\/unsharing/).reply((config) => {
        console.log("Unshare request", config.url, JSON.parse(config.data));
        return [200, appUnshareResponse];
    });

    mockAxios
        .onGet("/api/collaborator-lists/default/members")
        .reply(200, collabListMemberResp);
    mockAxios
        .onGet(/\/api\/user-info.*username=superman.*/)
        .reply(200, userInfoMemberResp);
    mockAxios
        .onGet(new RegExp("/api/resource-usage/summary.*"))
        .reply(200, usageSummaryResponse);

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
            isAdminView={isAdminView}
        />
    );
}

const AppsListingTemplate = ({ isAdminView, usageSummaryResponse }) => {
    return (
        <UploadTrackingProvider>
            <UserProfileProvider>
                <ListingTest
                    isAdminView={isAdminView}
                    usageSummaryResponse={usageSummaryResponse}
                />
            </UserProfileProvider>
        </UploadTrackingProvider>
    );
};

const args = {
    isAdminView: false,
};

const argTypes = {
    isAdminView: {
        name: "Admin View",
        control: {
            type: "boolean",
        },
    },
};

const parameters = {
    chromatic: { delay: AXIOS_DELAY * 2 + 500 },
};

export const NormalListing = AppsListingTemplate.bind({});
NormalListing.args = { ...args, usageSummaryResponse };
NormalListing.argTypes = argTypes;
NormalListing.parameters = parameters;

export const BasicSubscriptionListing = AppsListingTemplate.bind({});
BasicSubscriptionListing.args = {
    ...args,
    usageSummaryResponse: usageSummaryBasicSubscriptionResponse,
};
BasicSubscriptionListing.argTypes = argTypes;
BasicSubscriptionListing.parameters = parameters;
