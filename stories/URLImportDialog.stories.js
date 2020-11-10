import React from "react";
import URLImportDialog from "../src/components/urlImport";
import { mockAxios } from "./axiosMock";

export const URLImportDialogTest = ({ success }) => {
    mockAxios.onPost(/\/api\/fileio\/urlupload/).reply(
        success ? 200 : 500,
        success
            ? {}
            : {
                  path: "/iplant/home/ipcdev/urlImport",
                  error_code: "ERR_EXISTS",
              }
    );

    return (
        <URLImportDialog
            open={true}
            onClose={() => {
                console.log("Close URL Import Dialog");
            }}
            path="/iplant/home/ipcdev"
        />
    );
};

export default {
    title: "Uploads and Imports",
    component: URLImportDialog,
    argTypes: {
        success: {
            control: {
                type: "boolean",
            },
        },
    },
};
