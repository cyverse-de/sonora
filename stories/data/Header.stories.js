import React from "react";

import Header from "components/data/toolbar/Toolbar";
import { UploadTrackingProvider } from "contexts/uploadTracking";

import { mockAxios } from "../axiosMock";

import { dataRootsResp } from "./DataMocks";

export const HeaderTest = () => {
    mockAxios.onGet(/\/api\/filesystem\/root.*/).reply(200, dataRootsResp);

    const logger = (message) => {
        console.log(message);
    };
    return (
        <UploadTrackingProvider>
            <Header
                baseId="data.header"
                isGridView={false}
                toggleDisplay={() => logger("Toggle data display")}
                onDownloadSelected={() => logger("Download")}
                onMetadataSelected={() => logger("Metadata")}
                onDeleteSelected={() => logger("Delete")}
                handleDataNavError={console.log}
                handlePathChange={console.log}
                getSelectedResources={() => {
                    return [
                        {
                            infoType: null,
                            path: "/iplant/home/aramsey/TestData_qa",
                            "date-created": 1565225021000,
                            permission: "own",
                            "date-modified": 1568318834000,
                            "file-size": 0,
                            badName: false,
                            isFavorite: false,
                            label: "TestData_qa",
                            id: "9183e702-b975-11e9-80ce-d8d385e427d4",
                        },
                    ];
                }}
            />
        </UploadTrackingProvider>
    );
};

export default { title: "Data / Header" };
