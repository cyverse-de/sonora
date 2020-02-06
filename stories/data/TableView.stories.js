import React from "react";
import TableView from "../../src/components/data/listing/TableView";

function PathLink(props) {
    const { children } = props;
    return <>{children}</>;
}

export const DataTableViewTest = () => {
    const logger = (message) => {
        console.log(message);
    };

    const listing = [
        {
            id: "b7d737ac-7f70-11e6-bf34-d8d385e427d4",
            label: "analyses_qa-3",
            path: "/iplant/home/ipcdev/analyses_qa-3",
            dateModified: 1474403277000,
            permission: "READ",
            type: "FOLDER",
        },
        {
            id: "3c1aeb2e-920c-11e5-81de-3c4a92e4a804",
            label: "test",
            path: "/iplant/home/ipcdev/test",
            dateModified: 1530226175000,
            permission: "OWN",
            type: "FOLDER",
        },
        {
            id: "07ffbe2c-ed92-11e6-bf47-d8d385e427d4",
            label: "CORE-8424.txt",
            path: "/iplant/home/ipcdev/CORE-8424.txt",
            dateModified: 1486512213000,
            permission: "READ",
            type: "FILE",
            fileSize: 9,
        },
        {
            id: "a4a681ca-6072-11e4-9d04-3c4a92e4a804",
            label: "sample.csv",
            path: "/iplant/home/ipcdev/sample.csv",
            dateModified: 1414700623000,
            permission: "READ",
            type: "FILE",
            fileSize: 15,
        },
    ];

    return (
        <TableView
            path="/iplant/home/ipcdev"
            PathLink={PathLink}
            listing={listing}
            isMedium={true}
            isLarge={true}
            baseId="tableView"
            onDownloadSelected={(resourceId) => logger("Download")}
            onEditSelected={(resourceId) => logger("Edit")}
            onMetadataSelected={(resourceId) => logger("Metadata")}
            onDeleteSelected={(resourceId) => logger("Delete")}
            handleRequestSort={(event, property) => logger("Request Sort")}
            handleSelectAllClick={(event) => logger("Select All Clicked")}
            handleClick={(event, resourceId, index) => logger("Row Clicked")}
            order="asc"
            orderBy="label"
            selected={[]}
        />
    );
};

export default { title: "Data" };
