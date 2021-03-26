import React from "react";

import { mockAxios } from "../axiosMock";
import {
    analysisPermissionResponse,
    analysisShareResponse,
    analysisUnshareResponse,
    appPermissionListResponse,
    appShareResponse,
    appUnshareResponse,
    dataShareResponse,
    dataUnshareResponse,
    dataUserPermResp,
    toolPermissionResponse,
    toolShareResponse,
    toolUnshareResponse,
} from "./SharingMocks";
import SharingView from "../../src/components/sharing";
import { userInfoResp } from "../UserInfoMocks";

export const SharingTest = () => {
    mockAxios.onGet(/\/api\/subjects.*/).reply(200, {
        subjects: [
            ...Object.values(userInfoResp),
            { id: "test_user", email: "test@test.com", name: "Testy Test" },
        ],
    });
    mockAxios.onGet(/\/api\/user-info.*/).reply(200, userInfoResp);
    mockAxios
        .onPost(/\/api\/filesystem\/user-permission/)
        .reply(200, dataUserPermResp);
    mockAxios.onPost(/\/api\/share/).reply(200, dataShareResponse);
    mockAxios.onPost(/\/api\/unshare/).reply(200, dataUnshareResponse);
    mockAxios
        .onPost(/\/api\/apps\/permission-lister/)
        .reply(200, appPermissionListResponse);
    mockAxios.onPost(/\/api\/apps\/sharing/).reply(200, appShareResponse);
    mockAxios.onPost(/\/api\/apps\/unsharing/).reply(200, appUnshareResponse);
    mockAxios
        .onPost(/\/api\/analyses\/permission-lister/)
        .reply(200, analysisPermissionResponse);
    mockAxios
        .onPost(/\/api\/analyses\/sharing/)
        .reply(200, analysisShareResponse);
    mockAxios
        .onPost(/\/api\/analyses\/unsharing/)
        .reply(200, analysisUnshareResponse);
    mockAxios
        .onPost(/\/api\/tools\/permission-lister/)
        .reply(200, toolPermissionResponse);
    mockAxios.onPost(/\/api\/tools\/sharing/).reply(200, toolShareResponse);
    mockAxios.onPost(/\/api\/tools\/unsharing/).reply(200, toolUnshareResponse);

    const resources = {
        paths: [
            {
                label: "CORE-9077-path.list",
                path: "/iplant/home/aramsey/CORE-9077-path.list",
                type: "file",
            },
            {
                label: "TestFolder",
                path: "/iplant/home/aramsey/TestFolder",
                type: "folder",
            },
        ],
        apps: [
            {
                name: "JupJup",
                system_id: "de",
                id: "e54bfc1a-f811-11e8-8a14-008cfa5ae621",
            },
        ],
        analyses: [
            {
                name: "MMTF Analysis",
                id: "07a3e96e-c21c-11ea-aa22-008cfa5ae621",
            },
        ],
        tools: [
            {
                name: "Test_Tool",
                id: "2609f8a8-e928-11e9-a2ea-008cfa5ae621",
            },
        ],
    };

    return (
        <SharingView
            open={true}
            onClose={() => console.log("Close sharing dialog")}
            resources={resources}
        />
    );
};

export default {
    title: "Sharing",
};
