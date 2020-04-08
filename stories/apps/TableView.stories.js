import React from "react";
import TableView from "../../src/components/apps/listing/TableView";
import { appListing } from "./AppMocks";

export const AppsTableViewTest = () => {
    const logger = (message) => {
        console.log(message);
    };

    return (
        <TableView
            listing={appListing}
            order="asc"
            orderBy="name"
            baseId="tableView"
            handleSelectAllClick={(event) => logger("Select All Clicked")}
            handleClick={(event, resourceId, index) => logger("Row Clicked")}
            selected={[]}
        />
    );
};

export default {
    title: "Apps",
};
