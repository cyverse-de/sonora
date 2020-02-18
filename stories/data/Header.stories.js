import React from "react";
import Header from "../../src/components/data/Header";

export const HeaderTest = () => {
    const logger = (message) => {
        console.log(message);
    };

    return (
        <Header
            baseId="data.header"
            isGridView={false}
            toggleDisplay={() => logger("Toggle data display")}
            onDownloadSelected={() => logger("Download")}
            onEditSelected={() => logger("Edit")}
            onMetadataSelected={() => logger("Metadata")}
            onDeleteSelected={() => logger("Delete")}
        />
    );
};

export default { title: "Data" };
