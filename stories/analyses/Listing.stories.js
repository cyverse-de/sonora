import React from "react";
import Listing from "../../src/components/analyses/listing/Listing";
import { mockAxios } from "../axiosMock";
import { listing } from "./AnalysesMocks";

export default {
    title: "Analyses",
};

function ListingTest(props) {
    return <Listing baseId="tableView" />;
}

export const AnalysesListingTest = () => {
    mockAxios.onGet(/\/api\/analyses*/).reply(200, listing);
    return <ListingTest />;
};
