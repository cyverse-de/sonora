import React from "react";
import { mockAxios } from "../axiosMock";
import AddOnsListing from "components/subscriptions/addons/listing/Listing";

import {
    availableAddons,
    emptyAddons,
    resourceTypes,
} from "./SubscriptionAddonsMocks";
import { erroredListing } from "./SubscriptionMocks";

export default {
    title: "Subscriptions/ Addons",
};

const baseId = "addonsListingTest";

const mockCalls = () => {
    mockAxios.onGet("api/qms/resource-types").reply(200, resourceTypes);
    mockAxios.onDelete(/api\/admin\/qms\/addons\/.*/).reply((config) => {
        console.log("Add-on(s) deleted", config.url);
        return [200];
    });
};

export function AvailableAddonsListingTest({ isAdminView }) {
    mockCalls();
    return (
        <AddOnsListing
            availableAddons={availableAddons}
            baseId={baseId}
            isAdminView={isAdminView}
        />
    );
}

export function EmptyListingTest({ isAdminView }) {
    mockCalls();
    return (
        <AddOnsListing
            availableAddons={emptyAddons}
            baseId={baseId}
            isAdminView={isAdminView}
        />
    );
}

export function ErroredListingTest({ isAdminView }) {
    mockCalls();
    return (
        <AddOnsListing
            baseId={baseId}
            isAdminView={isAdminView}
            errorFetchingAvailableAddons={erroredListing}
        />
    );
}

AvailableAddonsListingTest.argTypes = {
    isAdminView: {
        control: {
            type: "boolean",
        },
    },
};

AvailableAddonsListingTest.args = {
    isAdminView: true,
};

EmptyListingTest.argTypes = {
    isAdminView: {
        control: {
            type: "boolean",
        },
    },
};

EmptyListingTest.args = {
    isAdminView: true,
};

ErroredListingTest.argTypes = {
    isAdminView: {
        control: {
            type: "boolean",
        },
    },
};

ErroredListingTest.args = {
    isAdminView: true,
};
