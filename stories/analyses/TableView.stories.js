import React from "react";
import TableView from "../../src/components/analyses/listing/TableView";
import { listing } from "./AnalysesMocks";

export const AnalysesTableViewTest = () => {
    const logger = (message) => {
        console.log(message);
    };

    return (
        <TableView
            listing={listing}
            username="ipcdev"
            parentId=""
            baseId="analysesTable"
            order="desc"
            orderBy="startdate"
            selected={[]}
            handleRequestSort={() => logger("Sort requested!")}
            handleSelectAllClick={() => logger("Select all clicked")}
            handleClick={() => logger("Row clicked")}
            handleInteractiveUrlClick={() => logger("Open VICE Analyses")}
            handleGoToOutputFolder={() => logger("Go to output folder")}
            handleBatchIconClick={() => logger("Expand batch analyses")}
        />
    );
};

export default {
    title: "Analyses",
};
