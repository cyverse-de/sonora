import React from "react";
import { mockAxios } from "../axiosMock";
import constants from "../../src/constants";
import { requests } from "./ToolRequestMocks";
import Listing from "components/tools/requests/Listing";

export default {
    title: "Tools / Requests",
};

export const ToolRequestsListingTest = () => {
    mockAxios.onGet(/\/api\/admin\/tool-request.*/).reply(200, requests);
    return (
        <Listing
            page={0}
            rowsPerPage={100}
            order={constants.SORT_DESCENDING}
            orderBy="date_submitted"
        />
    );
};
