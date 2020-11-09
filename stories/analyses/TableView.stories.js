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
            handleGoToOutputFolder={(analysis) =>
                console.log("Go to output folder", analysis?.resultfolderid)
            }
            handleRelaunch={(analyses) =>
                console.log("Relaunch Analysis", analyses[0]?.id)
            }
            handleBatchIconClick={() => logger("Expand batch analyses")}
        />
    );
};

export default {
    title: "Analyses / Table view",
};
