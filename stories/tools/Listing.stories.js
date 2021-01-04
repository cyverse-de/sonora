import React from "react";
import Listing from "../../src/components/tools/listing/Listing";
import { mockAxios } from "../axiosMock";
import {
    emptyListing,
    erroredListing,
    invalidSortField,
    listing,
} from "./ToolMocks";

import constants from "../../src/constants";

const toolListingUriRegexp = /\/api\/tools.*/;
const adminToolListingUriRegexp = /\/api\/admin\/tools.*/;

/**
 * This is the base wrapper for all of the listing tests.
 * @param {Object} props - the component properties
 */
function ListingTest(props) {
    return (
        <Listing
            baseId="tableView"
            selectedPage={0}
            selectedRowsPerPage={25}
            selectedOrder={constants.SORT_ASCENDING}
            selectedOrderBy={"name"}
            selectedPermFilter=""
            selectedSearchTerm=""
            isAdmin={props.admin}
            onRouteToListing={(
                order,
                orderBy,
                page,
                rowsPerPage,
                permFilter,
                searchTerm
            ) =>
                console.log(
                    "route to page with=>" +
                        order +
                        " " +
                        orderBy +
                        " " +
                        page +
                        " " +
                        rowsPerPage +
                        " " +
                        permFilter +
                        " " +
                        searchTerm
                )
            }
        />
    );
}

/**
 * Returns a function that can be used to compare tools by name. A higher-order
 * function is used here so that we can easily determine the sort order.
 * @param {Boolean} ascending - true if the tools should be sorted in ascending order
 */
function toolNameComparisonFunction(ascending) {
    const applyDirection = (n) => (ascending ? n : -n);
    return function (a, b) {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        return nameA < nameB
            ? applyDirection(-1)
            : nameA > nameB
            ? applyDirection(1)
            : 0;
    };
}

/**
 * Sorts tools by name in either ascending or descending order.
 * @param {Array} tools - the tool listing to sort
 * @param {Boolean} ascending - true if the tools should be sorted in ascending order
 */
function sortToolsByName(tools, ascending) {
    const compareTools = toolNameComparisonFunction(ascending);
    return tools.sort(compareTools);
}

/**
 * The tool listing for a parameterized API call. This function retrieves the
 * query parameters from the Axios config and adjusts the result so that we
 * can test sorting and paging in Storybook.
 * @param {Object} config - the Axios config
 */
function parameterizedToolListing(config) {
    // Determine whether and how to sort the response.
    const sortField = config?.params["sort-field"];
    const sortDir = config?.params["sort-dir"] || "ASC";

    // Determine if the response should be paged.
    const limit = config?.params["limit"];
    const offset = config?.params["offset"] || 0;

    // We return the entire unsorted listing by default.
    const result = {
        tools: listing.tools,
        total: listing.total,
    };

    // Sort the listing if we're supposed to.
    if (sortField !== null && sortField !== undefined) {
        if (sortField !== "name") {
            return [400, invalidSortField];
        }
        result.tools = sortToolsByName(
            result.tools,
            sortDir !== null && sortDir !== undefined && sortDir === "ASC"
        );
    }

    // Page the listing if we're supposed to.
    if (limit !== null && limit !== undefined) {
        result.tools = result.tools.slice(offset, offset + limit);
    }

    // Return the updated listing.
    return [200, result];
}

/**
 * Export the story title.
 */
export default {
    title: "Tools / Listing",
};

/**
 * Covers the usual case for tool listing, where everything works correctly.
 */
export const ToolListingTest = ({ admin }) => {
    mockAxios
        .onGet(admin ? adminToolListingUriRegexp : toolListingUriRegexp)
        .reply(parameterizedToolListing);
    return <ListingTest admin={admin} />;
};

/**
 * Covers the case where there are no tools to be displayed.
 */
export const EmptyToolListingTest = ({ admin }) => {
    mockAxios
        .onGet(admin ? adminToolListingUriRegexp : toolListingUriRegexp)
        .reply(200, emptyListing);
    return <ListingTest admin={admin} />;
};

/**
 * Covers the case where the tool listing endpoint returns an error.
 */
export const ErroredListingTest = ({ admin }) => {
    mockAxios
        .onGet(admin ? adminToolListingUriRegexp : toolListingUriRegexp)
        .reply(400, erroredListing);
    return <ListingTest admin={admin} />;
};

ToolListingTest.argTypes = {
    admin: {
        control: {
            type: "boolean",
        },
    },
};

EmptyToolListingTest.argTypes = {
    admin: {
        control: {
            type: "boolean",
        },
    },
};

ErroredListingTest.argTypes = {
    admin: {
        control: {
            type: "boolean",
        },
    },
};
