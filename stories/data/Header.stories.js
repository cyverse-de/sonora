import React from "react";
import Header from "../../src/components/data/toolbar/Toolbar";
import { UploadTrackingProvider } from "../../src/contexts/uploadTracking";

export const HeaderTest = () => {
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
                onEditSelected={() => logger("Edit")}
                onMetadataSelected={() => logger("Metadata")}
                onDeleteSelected={() => logger("Delete")}
                handleDataNavError={console.log}
                handlePathChange={console.log}
            />
        </UploadTrackingProvider>
    );
};

export default { title: "Data" };
