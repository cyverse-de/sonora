import React from "react";
import { mockAxios } from "../axiosMock";
import { details, appsUsingTool } from "./ToolMocks";
import Drawer from "../../src/components/tools/details/Drawer";
export default {
    title: "Tools / Details",
};

export function DetailsDrawerTest(props) {
    mockAxios
        .onGet(`/api/tools/602b013c-bfa9-11e5-8bd0-3f681b5dbaee`)
        .reply(200, details);
    mockAxios
        .onGet(`/api/tools/602b013c-bfa9-11e5-8bd0-3f681b5dbaee/apps`)
        .reply(200, appsUsingTool);

    return (
        <Drawer
            selectedTool={{ id: "602b013c-bfa9-11e5-8bd0-3f681b5dbaee" }}
            open={true}
            onClose={() => console.log("Shut up now!")}
        />
    );
}
