import React from "react";
import { mockAxios } from "../axiosMock";
import MoveDialog from "components/data/MoveDialog";

export const MoveDialogTest = () => {
    const logger = (message) => {
        console.log(message);
    };
    mockAxios.onPost(/\/api\/filesystem\/move/).reply(200, "");

    return (
        <MoveDialog
            open={true}
            path="/iplant/home/ipcdev"
            onClose={() => logger("Close Move Dialog")}
            onRemoveResource={() => logger("Remove this resource")}
            selectedResources={[
                {
                    infoType: "ht-analysis-path-list",
                    path: "/iplant/home/ipcdev/CORE-1346-path.list",
                    "date-created": 1512502386000,
                    permission: "own",
                    "date-modified": 1512502386000,
                    "file-size": 90046,
                    badName: false,
                    isFavorite: false,
                    label: "CORE-1346-path.list",
                    id: "1e7e91d4-d9f3-11e7-bf79-d8d385e427d4",
                },
                {
                    infoType: "unknown",
                    path: "/iplant/home/ipcdev/CORE-1346.txt",
                    "date-created": 1512516445000,
                    permission: "own",
                    "date-modified": 1512516445000,
                    "file-size": 10,
                    badName: false,
                    isFavorite: false,
                    label: "CORE-1346.txt",
                    id: "da63e3c0-da13-11e7-bf79-d8d385e427d4",
                },
                {
                    infoType: "unknown",
                    path:
                        "/iplant/home/ipcdev/Discovery Environment-CyVerse-blue.svg",
                    "date-created": 1562000527000,
                    permission: "own",
                    "date-modified": 1562000527000,
                    "file-size": 7526,
                    badName: false,
                    isFavorite: false,
                    label: "Discovery Environment-CyVerse-blue.svg",
                    id: "f5469f94-9c21-11e9-80c7-d8d385e427d4",
                },
            ]}
        />
    );
};
export default {
    title: "Data / Move",
};
