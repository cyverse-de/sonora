import React from "react";

import { withKnobs, boolean, select } from "@storybook/addon-knobs";
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

export const DetailsDrawerTest = () => {
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

    const resourceTypeSelect = select(
        "Resource Type",
        {
            dir: dirResource,
            file: fileResource,
        },
        dirResource
    );

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

    const userInfoResp = {
        batman: {
            email: "batman@iplantcollaborative.org",
            name: "Bruce Wayne",
            last_name: "Wayne",
            description: "He is the night",
            id: "batman",
            institution: "The Night",
            first_name: "Bruce",
            source_id: "ldap",
        },
        robin: {
            email: "nightwing@cyverse.org",
            name: "Richard Grayson",
            last_name: "Grayson",
            description: "Sidekick",
            id: "nightwing",
            institution: "The Night",
            first_name: "Richard",
            source_id: "ldap",
        },
        alfred: {
            email: "alfred@cyverse.org",
            name: "Alfred Pennyworth",
            last_name: "Pennyworth",
            description: "Unappreciated",
            id: "alfred",
            institution: "Bat Cave",
            first_name: "Alfred",
            source_id: "ldap",
        },
        catwoman: {
            email: "catwoman@cyverse.org",
            name: "Selina Kyle",
            last_name: "Kyle",
            description: "Sneaky",
            id: "catwoman",
            institution: "Catnip",
            first_name: "Selina",
            source_id: "ldap",
        },
        joker: {
            email: "joker@cyverse.org",
            name: "Jack Napier",
            last_name: "Napier",
            description: "Insane",
            id: "joker",
            institution: "Madness",
            first_name: "Jack",
            source_id: "ldap",
        },
        penguin: {
            email: "penguin@cyverse.org",
            name: "Oswald Cobblepot",
            last_name: "Cobblepot",
            description: "Waddler",
            id: "penguin",
            institution: "Penguins Inc",
            first_name: "Oswald",
            source_id: "ldap",
        },
        freeze: {
            email: "freeze@cyverse.org",
            name: "Victor Fries",
            last_name: "Fries",
            description: "Cold",
            id: "freeze",
            institution: "Ice To Meet You",
            first_name: "Victor",
            source_id: "ldap",
        },
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
    mockAxios.onPost(/\/api\/share/, sharingResp).reply(200, { delay: 1000 });

    return (
        <DetailsDrawer
            open={boolean("Open Drawer", true)}
            onClose={() => logger("Close Drawer")}
            baseId="data"
            infoTypes={fileTypesResp.types}
            resource={resourceTypeSelect}
        />
    );
};

export default {
    title: "Data",
    decorators: [withKnobs],
};
