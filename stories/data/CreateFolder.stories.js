import React from "react";

import { createFolderFailResp, createFolderSuccessResp } from "./DataMocks";
import { mockAxios } from "../axiosMock";
import CreateResourceDialog from "../../src/components/data/CreateFolderDialog";

export const CreateFolderTest = ({ success }) => {
    const logger = (message) => {
        console.log(message);
    };

    mockAxios
        .onPost(/\/api\/filesystem\/directory\/create/)
        .reply(
            success ? 200 : 500,
            success ? createFolderSuccessResp : createFolderFailResp
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
    title: "Data / Create Folder",
    component: CreateResourceDialog,
    argTypes: {
        success: {
            control: {
                type: "boolean",
            },
        },
    },
};
