import React from "react";
import Listing from "../../src/components/tools/listing/Listing";
import { mockAxios } from "../axiosMock";
import {
    emptyListing,
    erroredListing,
    invalidSortField,
    listing,
} from "./ToolMocks";

const toolListingUriRegexp = /\/api\/tools.*/;

export default {
    title: "Tools",
};

/**
 * This is the base wrapper for all of the listing tests.
 * @param {Object} props - the component properties
 */
function ListingTest(props) {
    return <Listing baseId="tableView" />;
}

/**
 * Returns a function that can be used to compare tools by name. A higher-order
 * function is used here so that we can easily determine the sort order.
 * @param {Boolean} ascending - true if the tools should be sorted in ascending order
 */
function toolNameComparisonFunction(ascending) {
    const applyDirection = (n) => (ascending ? n : -n);
    return function(a, b) {
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
 * @param {Array} listing - the tool listing to sort
 * @param {Boolean} ascending - true if the tools should be sorted in ascending order
 */
function sortToolsByName(listing, ascending) {
    const compareTools = toolNameComparisonFunction(ascending);
    const result = {
        tools: listing.tools.sort(compareTools),
        total: listing.total,
    };
    console.warn(`Result: ${result}`);
    return result;
}

/**
 * Returns a potentially sorted tool listing. This function retrieves the
 * query parameters from the Axios config and adjusts the result so that we
 * can test sorting in Storybook.
 * @param {Object} config - the Axios config
 */
function sortedToolListing(config) {
    console.warn(config);

    // Determine whether and how to sort the response.
    const sortField = config?.query["sort-field"];
    const sortDir = config?.query["sort-dir"];

    // Sort the results if we're supposed to.
    if (sortField !== null && sortField !== undefined) {
        return sortField === "name"
            ? [
                  200,
                  sortToolsByName(
                      listing,
                      sortDir !== null &&
                          sortDir !== undefined &&
                          sortDir === "ASC"
                  ),
              ]
            : [400, invalidSortField];
    }

    // Return the unsorted listing.
    return [200, listing];
}

/**
 * Covers the usual case for tool listing, where everything works correctly.
 */
export const ToolListingTest = () => {
    mockAxios.onGet(toolListingUriRegexp).reply(sortedToolListing);
    return <ListingTest />;
};

/**
 * Covers the case where there are no tools to be displayed.
 */
export const EmptyToolListingTest = () => {
    mockAxios.onGet(toolListingUriRegexp).reply(200, emptyListing);
    return <ListingTest />;
};

/**
 * Coverse the case where the tool listing endpoint returns an error.
 */
export const ErroredListingTest = () => {
    mockAxios.onGet(toolListingUriRegexp).reply(400, erroredListing);
    return <ListingTest />;
};
