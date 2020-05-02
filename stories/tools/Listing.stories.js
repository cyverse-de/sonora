import React from "react";
import Listing from "../../src/components/tools/listing/Listing";
import { mockAxios } from "../axiosMock";
import { emptyListing, erroredListing, listing } from "./ToolMocks";

const toolListingUriRegexp = /\/api\/tools.*/;

export default {
    title: "Tools",
};

function ListingTest(props) {
    return <Listing baseId="tableView" />;
}

export const ToolListingTest = () => {
    mockAxios.onGet(toolListingUriRegexp).reply(200, listing);
    return <ListingTest />;
};

export const EmptyToolListingTest = () => {
    mockAxios.onGet(toolListingUriRegexp).reply(200, emptyListing);
    return <ListingTest />;
};

export const ErroredListingTest = () => {
    mockAxios.onGet(toolListingUriRegexp).reply(400, erroredListing);
    return <ListingTest />;
};
