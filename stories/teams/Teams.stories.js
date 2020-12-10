import React from "react";
import { mockAxios } from "../axiosMock";

import Teams from "components/teams";
import { teamList } from "./TeamMocks";

export const Listing = () => {
    mockAxios.onGet(/\/api\/teams*/).reply(200, teamList);
    return <Teams />;
};

export default { title: "Teams" };
