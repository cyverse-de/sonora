import React from "react";
import { mockAxios } from "../axiosMock";
import constants from "../../src/constants";
import { requests } from "./doiRequestMocks";
import Listing from "components/doi/Listing";

export default {
    title: "DOI / Listing",
};

export const DOIRequestsListingTest = () => {
    mockAxios
        .onGet(/\/api\/admin\/permanent-id-requests.*/)
        .reply(200, requests);
    return (
        <Listing
            page={0}
            rowsPerPage={100}
            order={constants.SORT_DESCENDING}
            orderBy="date_submitted"
        />
    );
};
