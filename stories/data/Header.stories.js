import React from "react";
import Header from "../../src/components/data/toolbar/Toolbar";
import { UploadTrackingProvider } from "../../src/contexts/uploadTracking";
import { ConfigProvider } from "contexts/config";

export const HeaderTest = () => {
    const logger = (message) => {
        console.log(message);
    };
    return (
        <ConfigProvider>
            <UploadTrackingProvider>
                <Header
                    baseId="data.header"
                    isGridView={false}
                    toggleDisplay={() => logger("Toggle data display")}
                    onDownloadSelected={() => logger("Download")}
                    onEditSelected={() => logger("Edit")}
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
        </ConfigProvider>
    );
};

export default { title: "Data/Header" };
