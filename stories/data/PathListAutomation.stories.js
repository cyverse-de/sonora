import React from "react";
import PathListAutomation from "../../src/components/data/PathListAutomation";
import { fileTypesResp } from "./DataMocks";
import { mockAxios } from "../axiosMock";

export const PathListAutomationTest = () => {
    mockAxios.onGet(/\/api\/filetypes\/type-list/).reply(200, fileTypesResp);
    return <PathListAutomation />;
};

export default { title: "Data / Path List Automation" };
