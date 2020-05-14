import React from "react";
import URLImportDialog from "../src/components/URLImportDialog";
import { boolean, withKnobs } from "@storybook/addon-knobs";
import { mockAxios } from "./axiosMock";

export const URLImportDialogTest = () => {
    const successResp = boolean("Success Response", true);

    mockAxios.onPost(/\/api\/fileio\/urlupload/).reply(
        successResp ? 200 : 500,
        successResp
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
    decorators: [withKnobs],
};
