import React from "react";
import Listing from "../../src/components/tools/listing/Listing";
import { mockAxios } from "../axiosMock";
import { listing } from "./ToolMocks";

export default {
    title: "Tools",
};

function ListingTest(props) {
    return <Listing baseId="tableView" />;
}

export const ToolListingTest = () => {
    mockAxios.onGet(/\/api\/tools*/).reply(200, listing);
    return <ListingTest />;
};
