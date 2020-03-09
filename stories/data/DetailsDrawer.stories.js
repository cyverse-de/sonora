import React from "react";

import fetchMock from "fetch-mock";
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
                path: resourceTypeSelect.type === "FOLDER" ? dirResource.path : fileResource.path,
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
        "sharing": [{
            "user": "alfred",
            "sharing": [{
                "path": resourceTypeSelect.type === "FOLDER" ? dirResource.path : fileResource.path,
                "permission": "read",
                "success": true,
            }]
        }]
    };

    fetchMock
        .restore()
        .post(
            /\/api\/filesystem\/stat/,
            resourceTypeSelect.type === "FOLDER" ? dirStatResp : fileStatResp
        )
        .get(/\/api\/tags\/suggestions.*/, tagResp)
        .post(/\/api\/filesystem\/user-permissions.*/, permissionsResp)
        .get(/\/api\/user-info.*/, userInfoResp)
        .patch(/\/api\/filesystem\/entry\/.*/, {})
        .get(/\/api\/filesystem\/entry\/.*/, resourceTagResp)
        .post(/\/api\/tags\/user/, addTagResp)
        .post(/\/api\/filetypes\/type/, resourceUpdatedInfoTypeResp)
        .post(/\/api\/share/, sharingResp);

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
