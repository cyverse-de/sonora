import React from "react";
import { mockAxios } from "../axiosMock";
import { myCommunityList } from "./CommunityMocks";
import CommunityView from "components/communities";

export const View = () => {
    mockAxios.onGet("/api/communities").reply(200, myCommunityList);
    return <CommunityView baseId="communities" />;
};

export default {
    title: "Communities",
};
