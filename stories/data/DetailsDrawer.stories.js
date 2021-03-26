import React from "react";

import DetailsDrawer from "../../src/components/data/details/Drawer";
import {
    fileTypesResp,
    dirResource,
    dirStatResp,
    fileResource,
    fileStatResp,
    resourceTagResp,
    resourceUpdatedInfoTypeResp,
} from "./DataMocks";
import { mockAxios } from "../axiosMock";
import { userInfoResp } from "../UserInfoMocks";

const resType = ["FILE", "FOLDER"];

export const DetailsDrawerTest = ({ resourceType, open }) => {
    const logger = (message) => {
        console.log(message);
    };

    const addTagResp = {
        id: "10122fe0-5816-11ea-8180-c2a97b34bb42",
    };

    const tagResp = {
        tags: [
            {
                id: "631334a4-52a9-11ea-b48d-008cfa5ae621",
                value: "tag1",
                description: "",
            },
            {
                id: "631334a4-52a9-11ea-b48d-008cfa5ae721",
                value: "tag2",
                description: "",
            },
            {
                id: "631334a4-52a9-11ea-b48d-008cfa5ae821",
                value: "tag3",
                description: "",
            },
            {
                id: "631334a4-52a9-11ea-b48d-008cfa5af621",
                value: "tag4",
                description: "",
            },
            {
                id: "631334a4-52a9-11ea-b48d-008cfa5ag621",
                value: "tag5",
                description: "",
            },
            {
                id: "631334a4-52a9-11ea-b48d-008cfa5ah621",
                value: "tag6",
                description: "",
            },
        ],
    };

    let resourceTypeSelect;

    if (resourceType === "FILE") {
        resourceTypeSelect = fileResource;
    } else {
        resourceTypeSelect = dirResource;
    }

    const permissionsResp = {
        paths: [
            {
                path:
                    resourceTypeSelect.type === "FOLDER"
                        ? dirResource.path
                        : fileResource.path,
                "user-permissions": [
                    { user: "batman", permission: "read" },
                    { user: "robin", permission: "write" },
                    { user: "alfred", permission: "own" },
                    { user: "catwoman", permission: "read" },
                    { user: "joker", permission: "read" },
                    { user: "penguin", permission: "write" },
                    { user: "freeze", permission: "read" },
                ],
            },
        ],
    };

    const sharingResp = {
        sharing: [
            {
                user: "alfred",
                sharing: [
                    {
                        path:
                            resourceTypeSelect.type === "FOLDER"
                                ? dirResource.path
                                : fileResource.path,
                        permission: "read",
                        success: true,
                    },
                ],
            },
        ],
    };

    mockAxios
        .onPost(/\/api\/filesystem\/stat/)
        .reply(
            200,
            resourceTypeSelect.type === "FOLDER" ? dirStatResp : fileStatResp
        );
    mockAxios.onGet(/\/api\/tags\/suggestions.*/).reply(200, tagResp);
    mockAxios
        .onPost(/\/api\/filesystem\/user-permissions.*/)
        .reply(200, permissionsResp);
    mockAxios.onGet(/\/api\/user-info.*/).reply(200, userInfoResp);
    mockAxios.onPatch(/\/api\/filesystem\/entry\/.*/).reply(200, {});
    mockAxios.onGet(/\/api\/filesystem\/entry\/.*/).reply(200, resourceTagResp);
    mockAxios.onPost(/\/api\/tags\/user/).reply(200, addTagResp);
    mockAxios
        .onPost(/\/api\/filetypes\/type/)
        .reply(200, resourceUpdatedInfoTypeResp);
    mockAxios.onPost(/\/api\/share/).reply(200, sharingResp);

    return (
        <DetailsDrawer
            open={open}
            onClose={() => logger("Close Drawer")}
            baseId="data"
            infoTypes={fileTypesResp.types}
            resource={resourceTypeSelect}
        />
    );
};

export default {
    title: "Data / Details",
    component: DetailsDrawer,
    argTypes: {
        resourceType: {
            control: {
                type: "select",
                options: resType,
            },
        },
        open: {
            control: {
                type: "boolean",
            },
        },
    },
};
