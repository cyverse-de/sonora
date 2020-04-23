import React from "react";

import { boolean, withKnobs } from "@storybook/addon-knobs";

import { createFolderFailResp, createFolderSuccessResp } from "./DataMocks";
import { mockAxios } from "../axiosMock";
import CreateResourceDialog from "../../src/components/data/CreateFolderDialog";

export const CreateFolderTest = () => {
    const logger = (message) => {
        console.log(message);
    };

    const successResp = boolean("Success Response", true);

    mockAxios
        .onPost(/\/api\/filesystem\/directory\/create/)
        .reply(
            successResp ? 200 : 500,
            successResp ? createFolderSuccessResp : createFolderFailResp
        );

    return (
        <CreateResourceDialog
            open={true}
            onFolderCreated={() => logger("Folder creation success")}
            onClose={() => logger("Close Create Folder Dialog")}
            path="/iplant/home/ipcdev"
        />
    );
};

export default {
    title: "Data",
    decorators: [withKnobs],
};
