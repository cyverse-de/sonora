import React from "react";

import { useQueryClient } from "react-query";

import { useTranslation } from "i18n";

import constants from "../../src/constants";

import { mockAxios } from "../axiosMock";

import {
    usageSummaryResponse,
    usageSummaryBasicSubscriptionResponse,
    usageSummaryBasicSubscriptionAddonsResponse,
} from "../usageSummaryMock";

import { info, listing } from "./AnalysesMocks";
import { convertTimeLimitArgType, TimeLimitArgType } from "./ArgTypes";

import Listing from "components/analyses/listing/Listing";
import analysisFields from "components/analyses/analysisFields";

import { NotificationsProvider } from "contexts/pushNotifications";
import { VICE_TIME_LIMIT_QUERY_KEY } from "serviceFacades/analyses";

export default {
    title: "Analyses / Listing",
};

function ListingTest(props) {
    const selectedPage = 0;
    const selectedRowsPerPage = 25;
    const selectedOrder = constants.SORT_DESCENDING;
    const { t } = useTranslation("analyses");
    const analysesRecordFields = analysisFields(t);
    const selectedOrderBy = analysesRecordFields.START_DATE.key;
    const selectedPermFilter = null;
    const selectedTypeFilter = null;

    return (
        <NotificationsProvider wsEnabled={false}>
            <Listing
                baseId="tableView"
                page={selectedPage}
                rowsPerPage={selectedRowsPerPage}
                order={selectedOrder}
                orderBy={selectedOrderBy}
                permFilter={selectedPermFilter}
                typeFilter={selectedTypeFilter}
                onRouteToListing={(
                    order,
                    orderBy,
                    page,
                    rowsPerPage,
                    permFilter,
                    appTypeFilter,
                    idFilter
                ) => {
                    console.log(
                        "onRouteToListing",
                        order,
                        orderBy,
                        page,
                        rowsPerPage,
                        permFilter,
                        appTypeFilter,
                        idFilter
                    );
                }}
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

const AnalysesListingTemplate = ({ timeLimit, usageSummaryResponse }) => {
    const queryClient = useQueryClient();

    React.useEffect(() => {
        queryClient.invalidateQueries(VICE_TIME_LIMIT_QUERY_KEY);
    }, [timeLimit, queryClient]);

    mockAxios.onGet(new RegExp("/api/analyses/.*/history")).reply(200, info);
    mockAxios.onGet(new RegExp("/api/analyses/.*/time-limit")).reply(200, {
        time_limit: convertTimeLimitArgType(timeLimit),
    });

    mockAxios.onGet("/api/analyses").reply(200, listing);

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
        console.log("Stop analysis", config.url, config.params);

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

    const sharingResponse = (success) => (config) => {
        const req = JSON.parse(config.data);
        console.log("Share analysis", config.url, req);

        return [
            200,
            {
                sharing: req.sharing.map((share) => ({
                    ...share,
                    analyses: share.analyses.map((analysis) => ({
                        ...analysis,
                        success,
                    })),
                })),
            },
        ];
    };

    // Return an unsuccessful share twice, since the first one will be ignored
    // due to the initial support-email 500 response below.
    mockAxios.onPost("/api/analyses/sharing").replyOnce(sharingResponse(false));
    mockAxios.onPost("/api/analyses/sharing").replyOnce(sharingResponse(false));
    mockAxios.onPost("/api/analyses/sharing").reply(sharingResponse(true));

    mockAxios.onPost("/api/support-email").replyOnce(500, errorResponse);
    mockAxios.onPost("/api/support-email").reply((config) => {
        console.log("Support Email", config.url, JSON.parse(config.data));
        return [200];
    });
    mockAxios
        .onGet(new RegExp("/api/resource-usage/summary.*"))
        .reply(200, usageSummaryResponse);

    return <ListingTest />;
};

export const NormalListing = AnalysesListingTemplate.bind({});
NormalListing.args = {
    timeLimit: "null",
    usageSummaryResponse,
};
NormalListing.argTypes = TimeLimitArgType;

export const BasicSubscriptionListing = AnalysesListingTemplate.bind({});
BasicSubscriptionListing.args = {
    timeLimit: "null",
    usageSummaryResponse: usageSummaryBasicSubscriptionResponse,
};
BasicSubscriptionListing.argTypes = TimeLimitArgType;

export const BasicSubscriptionWithAddonsListing = AnalysesListingTemplate.bind(
    {}
);
BasicSubscriptionWithAddonsListing.args = {
    timeLimit: "null",
    usageSummaryResponse: usageSummaryBasicSubscriptionAddonsResponse,
};
BasicSubscriptionWithAddonsListing.argTypes = TimeLimitArgType;
