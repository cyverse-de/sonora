import React from "react";

import { useQueryClient } from "react-query";

import Dashboard from "components/dashboard";
import { VICE_TIME_LIMIT_QUERY_KEY } from "serviceFacades/analyses";

import { mockAxios } from "../axiosMock";

import { appDetails, listingById } from "./appDetails";

import {
    convertTimeLimitArgType,
    TimeLimitArgType,
} from "../analyses/ArgTypes";
import { instantLaunchAppInfo } from "../data/DataMocksInstantLaunch";
import {
    usageSummaryResponse,
    usageSummaryComputeLimitExceededResponse,
} from "../usageSummaryMock";

import testData from "./data";

export default {
    title: "Dashboard / Display",
};

const DashboardTestTemplate = ({
    instantLaunchAppInfoResponse,
    usageSummaryResponseBody,
    timeLimit,
}) => {
    const queryClient = useQueryClient();

    React.useEffect(() => {
        queryClient.invalidateQueries(VICE_TIME_LIMIT_QUERY_KEY);
    }, [timeLimit, queryClient]);

    const favoriteUriRegexp = /\/api\/apps\/[^/]+\/[^/]+\/favorite/;
    mockAxios
        .onGet(/\/api\/apps\/[^/]+\/[^/]+\/details/)
        .reply(200, appDetails);
    mockAxios
        .onGet(/\/api\/apps\/[^/]+\/[^/]+\/listing/)
        .reply(200, listingById);
    mockAxios.onGet("/api/dashboard?limit=8").reply(200, testData);
    mockAxios.onPut(favoriteUriRegexp).reply(200);
    mockAxios.onDelete(favoriteUriRegexp).reply(200);
    mockAxios
        .onGet(new RegExp("/api/quicklaunches/.*app-info"))
        .reply(200, instantLaunchAppInfoResponse);
    mockAxios
        .onGet(/\/api\/resource-usage\/summary.*/)
        .reply(200, usageSummaryResponseBody);

    mockAxios.onGet(new RegExp("/api/analyses/.*/time-limit")).reply(200, {
        time_limit: convertTimeLimitArgType(timeLimit),
    });

    return <Dashboard />;
};

export const NoLimitsExceeded = DashboardTestTemplate.bind({});
NoLimitsExceeded.args = {
    timeLimit: "null",
    instantLaunchAppInfoResponse: instantLaunchAppInfo,
    usageSummaryResponseBody: usageSummaryResponse,
};
NoLimitsExceeded.argTypes = TimeLimitArgType;

export const ComputeLimitExceeded = DashboardTestTemplate.bind({});
ComputeLimitExceeded.args = {
    timeLimit: "null",
    instantLaunchAppInfoResponse: instantLaunchAppInfo,
    usageSummaryResponseBody: usageSummaryComputeLimitExceededResponse,
};
ComputeLimitExceeded.argTypes = TimeLimitArgType;

export const InstantLaunchLimitReached = DashboardTestTemplate.bind({});
InstantLaunchLimitReached.args = {
    timeLimit: "null",
    instantLaunchAppInfoResponse: {
        ...instantLaunchAppInfo,
        limitChecks: {
            canRun: false,
            results: [
                {
                    limitCheckID: "CONCURRENT_VICE_ANALYSES",
                    reasonCodes: ["ERR_LIMIT_REACHED"],
                    additionalInfo: {
                        runningJobs: 2,
                        maxJobs: 2,
                        usingDefaultSetting: false,
                        pendingRequest: false,
                    },
                },
            ],
        },
    },
    usageSummaryResponse: usageSummaryResponse,
};
InstantLaunchLimitReached.argTypes = TimeLimitArgType;

export const InstantLaunchVICEForbidden = DashboardTestTemplate.bind({});
InstantLaunchVICEForbidden.args = {
    timeLimit: "null",
    instantLaunchAppInfoResponse: {
        ...instantLaunchAppInfo,
        limitChecks: {
            canRun: false,
            results: [
                {
                    limitCheckID: "CONCURRENT_VICE_ANALYSES",
                    reasonCodes: ["ERR_FORBIDDEN"],
                    additionalInfo: {
                        runningJobs: 0,
                        maxJobs: 0,
                        usingDefaultSetting: false,
                        pendingRequest: false,
                    },
                },
            ],
        },
    },
    usageSummaryResponse: usageSummaryResponse,
};
InstantLaunchVICEForbidden.argTypes = TimeLimitArgType;

export const InstantLaunchPermissionNeeded = DashboardTestTemplate.bind({});
InstantLaunchPermissionNeeded.args = {
    timeLimit: "null",
    instantLaunchAppInfoResponse: {
        ...instantLaunchAppInfo,
        limitChecks: {
            canRun: false,
            results: [
                {
                    limitCheckID: "CONCURRENT_VICE_ANALYSES",
                    reasonCodes: ["ERR_PERMISSION_NEEDED"],
                    additionalInfo: {
                        runningJobs: 0,
                        maxJobs: 0,
                        usingDefaultSetting: false,
                        pendingRequest: false,
                    },
                },
            ],
        },
    },
    usageSummaryResponse: usageSummaryResponse,
};
InstantLaunchPermissionNeeded.argTypes = TimeLimitArgType;

export const InstantLaunchPermissionPending = DashboardTestTemplate.bind({});
InstantLaunchPermissionPending.args = {
    timeLimit: "null",
    instantLaunchAppInfoResponse: {
        ...instantLaunchAppInfo,
        limitChecks: {
            canRun: false,
            results: [
                {
                    limitCheckID: "CONCURRENT_VICE_ANALYSES",
                    reasonCodes: ["ERR_PERMISSION_NEEDED"],
                    additionalInfo: {
                        runningJobs: 0,
                        maxJobs: 0,
                        usingDefaultSetting: false,
                        pendingRequest: true,
                    },
                },
            ],
        },
    },
    usageSummaryResponse: usageSummaryResponse,
};
InstantLaunchPermissionPending.argTypes = TimeLimitArgType;
