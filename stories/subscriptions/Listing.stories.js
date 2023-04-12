import React from "react";
import { mockAxios } from "../axiosMock";
import Listing from "../../src/components/subscriptions/listing/Listing";
import {
    emptyListing,
    erroredListing,
    invalidSortField,
    listing,
    planTypes,
} from "./SubscriptionMocks";

import { availableAddons } from "./SubscriptionAddonsMocks";
import constants from "../../src/constants";

export default {
    title: "Subscriptions / Listing",
};

const subscriptionListingUriRegexp = /\/api\/admin\/qms\/subscriptions.*/;

function ListingTest(props) {
    return (
        <Listing
            availableAddons={availableAddons}
            baseId="subscriptions"
            isAdminView={props.isAdminView}
            order={constants.SORT_ASCENDING}
            orderBy={"username"}
            page={0}
            rowsPerPage={25}
            searchTerm=""
            onRouteToListing={(order, orderBy, page, rowsPerPage, searchTerm) =>
                console.log(`Route to listing: 
                order: ${order},
                orderBy: ${orderBy},
                page: ${page},
                rowsPerPage: ${rowsPerPage}
                searchTerm: ${searchTerm} `)
            }
        />
    );
}
/**
 * The subscription listing for a parameterized API call. This function retrieves the
 * query parameters from the Axios config and adjusts the result so that we
 * can test sorting and paging in Storybook.
 * @param {Object} config - the Axios config
 */
function parameterizedSubscriptionListing(config) {
    // // Determine whether and how to sort the response.
    const sortField = config?.params["sort-field"];
    const sortDir = config?.params["sort-dir"] || "ASC";

    // // Determine if the response should be paged.
    const limit = config?.params["limit"];
    const offset = config?.params["offset"] || 0;

    // Return the entire unsorted listing by default.
    //const subscriptions = listing.result.subscriptions
    let res = {
        result: {
            subscriptions: listing.result.subscriptions,
            total: listing.result.total,
        },
    };

    // // Sort the listing if we're supposed to.
    if (sortField !== null && sortField !== undefined) {
        if (sortField !== "username") {
            return [400, invalidSortField];
        }
        res.result.subscriptions = sortSubscriptionsByUsername(
            listing.result.subscriptions,
            sortDir !== null && sortDir !== undefined && sortDir === "ASC"
        );
        res.result.total = res.result.subscriptions.length;
    }

    //Page the listing if we're supposed to.
    if (limit !== null && limit !== undefined) {
        res.result.subscriptions = res.result.subscriptions.slice(
            offset,
            offset + limit
        );
    }

    return [200, res];
}

/**
 * Sorts subscriptions by username in either ascending or descending order.
 * @param {Array} subscriptions - the subscriptions listing to sort
 * @param {Boolean} sortAscending - true if the subscriptions should be sorted in ascending order
 */
function sortSubscriptionsByUsername(subscriptions, sortAscending) {
    const compareSubscriptions = subscriptionUsernameComparison(sortAscending);
    return subscriptions.sort(compareSubscriptions);
}

export const SubscriptionListingTest = ({ isAdminView }) => {
    mockAxios.onGet("api/qms/plans").reply(200, planTypes);
    mockAxios
        .onGet(subscriptionListingUriRegexp)
        .reply(parameterizedSubscriptionListing);
    return <ListingTest isAdminView={isAdminView} />;
};

/**
 * Covers the case where there are no subscriptions to be displayed.
 */
export const EmptySubscriptionListingTest = ({ isAdminView }) => {
    mockAxios.onGet("api/qms/plans").reply(200, planTypes);
    mockAxios.onGet(subscriptionListingUriRegexp).reply(200, emptyListing);
    return <ListingTest isAdminView={isAdminView} />;
};

/**
 * Covers the case where the subscription listing endpoint returns an error.
 */
export const ErroredListingTest = ({ isAdminView }) => {
    mockAxios.onGet(subscriptionListingUriRegexp).reply(400, erroredListing);
    return <ListingTest isAdminView={isAdminView} />;
};

/**
 * Returns a function that can be used to compare subscriptions by username. A higher-order
 * function is used here so that we can easily determine the sort order.
 * @param {Boolean} sortAscending - true if the subscriptions should be sorted in ascending order
 */
function subscriptionUsernameComparison(sortAscending) {
    const applyDirection = (n) => (sortAscending ? n : -n);
    return function (a, b) {
        const userA = a.user.username.toLowerCase();
        const userB = b.user.username.toLowerCase();
        return userA < userB
            ? applyDirection(-1)
            : userA > userB
            ? applyDirection(1)
            : 0;
    };
}

SubscriptionListingTest.argTypes = {
    isAdminView: {
        control: {
            type: "boolean",
        },
    },
};

SubscriptionListingTest.args = {
    isAdminView: true,
};

EmptySubscriptionListingTest.argTypes = {
    isAdminView: {
        control: {
            type: "boolean",
        },
    },
};

EmptySubscriptionListingTest.args = {
    isAdminView: true,
};
