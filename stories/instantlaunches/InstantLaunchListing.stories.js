import React from "react";

import { mockAxios } from "../axiosMock";
import { testFullInstantLaunchList } from "./admin/SavedLaunchListData";
import InstantLaunchListing from "../../src/components/instantlaunches/listing/index";

export default {
    title: "Instant Launches / Instant Launch Listing",
};

export const InstantLaunchListTest = () => {
    mockAxios
        .onGet("/api/instantlaunches/metadata/full", {
            params: { attribute: "ui_location", value: "listing", unit: "" },
        })
        .reply(200, testFullInstantLaunchList);

    return <InstantLaunchListing />;
};
