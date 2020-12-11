import React from "react";
import PathListAutomation from "../../src/components/data/PathListAutomation";
import { mockAxios } from "../axiosMock";
import { initMockAxiosFileFolderSelector } from "./DataMocks";

export const PathListAutomationTest = () => {
    initMockAxiosFileFolderSelector();

    mockAxios.onPost(/\/api\/filesystem\/path-list-creator.*/).reply(200, {
        file: {
            infoType: "ht-analysis-path-list",
            path: "/iplant/home/ipctest/test-auto123",
            "share-count": 0,
            "date-created": 1606836093000,
            md5: "36070bb856e2effd4c556115c1428f04",
            permission: "own",
            "date-modified": 1606836093000,
            type: "file",
            "file-size": 527,
            label: "test-auto123",
            id: "e55a4788-33e8-11eb-93a1-90e2ba675364",
            "content-type": "text/plain",
        },
    });
    return (
        <PathListAutomation
            baseId="path-list-auto"
            requestedInfoType="ht-analysis-path-list"
            onCancel={() => console.log("request cancelled.")}
            startingPath="/iplant/home/ipctest"
            onCreatePathList={(id, path) =>
                console.log("Path list file created =>" + path + " id=>" + id)
            }
        />
    );
};

export default { title: "Data / Path List Automation" };
