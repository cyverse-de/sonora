import React, { useState } from "react";

import { useQuery } from "react-query";

import { makeStyles } from "@material-ui/styles";

import {
    build as buildID,
    //getMessage as msg,
    withI18N,
} from "@cyverse-de/ui-lib";

import getData from "../../../serviceFacades/vice/admin";

import RowFilter from "./filter";
import CollapsibleTable from "./table";

import ids from "./ids";
import messages from "./messages";
import { DEPLOYMENT_COLUMNS, COMMON_COLUMNS } from "./constants";
import { Skeleton } from "@material-ui/lab";

import { JSONPath } from "jsonpath-plus";
import efcs from "./filter/efcs";

const id = (...values) => buildID(ids.ROOT, ...values);

const useStyles = makeStyles((theme) => ({
    root: {
        paddingLeft: theme.spacing(3),
        paddingRight: theme.spacing(3),
        paddingTop: theme.spacing(3),
        paddingBottom: 0,
        overflow: "auto",
        height: "90vh",
    },
    filterSkeleton: {
        marginBottom: theme.spacing(5),
    },
    footer: {
        width: "100%",
        height: theme.spacing(5),

        [theme.breakpoints.down("sm")]: {
            height: 32,
        },
    },
}));

const defineColumn = (
    name,
    keyID,
    field,
    align = "left",
    enableSorting = true
) => ({
    name,
    align,
    enableSorting,
    key: keyID,
    id: keyID,
    field,
});

// The column definitions for the table.
const commonColumns = [
    defineColumn("", COMMON_COLUMNS.EXPAND, "", "left", false),
    defineColumn("Username", COMMON_COLUMNS.USERNAME, "username"),
    defineColumn("Analysis Name", COMMON_COLUMNS.ANALYSIS_NAME, "analysisName"),
    defineColumn("App Name", COMMON_COLUMNS.APP_NAME, "appName"),
    defineColumn(
        "Date Created",
        COMMON_COLUMNS.CREATION_TIMESTAMP,
        "creationTimestamp"
    ),
    defineColumn("External ID", COMMON_COLUMNS.EXTERNAL_ID, "externalID"),
    defineColumn("App ID", COMMON_COLUMNS.APP_ID, "appID"),
    defineColumn("User ID", COMMON_COLUMNS.USER_ID, "userID"),
    defineColumn("Namespace", COMMON_COLUMNS.NAMESPACE, "namespace"),
];

const analysisColumns = [...commonColumns];

const deploymentColumns = [
    ...commonColumns,
    defineColumn("Image", DEPLOYMENT_COLUMNS.IMAGE, "image"),
    defineColumn("Port", DEPLOYMENT_COLUMNS.PORT, "port"),
    defineColumn("UID", DEPLOYMENT_COLUMNS.UID, "uid"),
    defineColumn("GID", DEPLOYMENT_COLUMNS.GID, "gid"),
];

const getAnalyses = ({ deployments }) => {
    let analyses = {};

    // Should only need to interate through the deployments to find the
    // list of analyses in the data.
    deployments.forEach((element) => {
        if (!analyses.hasOwnProperty(element.externalID)) {
            analyses[element.externalID] = {
                externalID: element.externalID,
                username: element.username,
                analysisName: element.analysisName,
                appName: element.appName,
                creationTimestamp: element.creationTimestamp,
                appID: element.appID,
                userID: element.userID,
                namespace: element.namespace,
            };
        }
    });

    return Object.values(analyses);
};

const VICEAdminSkeleton = () => {
    const classes = useStyles();
    return (
        <>
            <Skeleton
                variant="rect"
                animation="wave"
                height={100}
                width="100%"
                classes={{ root: classes.filterSkeleton }}
            />
            <Skeleton
                variant="rect"
                animation="wave"
                height={300}
                width="100%"
            />
        </>
    );
};

const VICEAdmin = () => {
    const classes = useStyles();

    const { status, data, error } = useQuery("vice-admin", getData);
    const isLoading = status === "loading";
    const hasErrored = status === "error";

    if (hasErrored) {
        console.log(error.message);
    }

    const [filters, setFilters] = useState({});

    const addToFilters = (key, value) =>
        setFilters({ ...filters, [key]: value });

    const deleteFromFilters = (key) => {
        const { [key]: _, ...deletedFrom } = filters;
        setFilters(deletedFrom);
    };

    console.log(filters);

    const filteredData = Object.entries(filters).reduce(
        (acc, [mappingSelector, value]) => {
            // grab the correct ExtractFilterCompare instance from the efcs
            // mapping.
            const result = JSONPath({
                path: mappingSelector,
                json: efcs,
            });
            if (result.length > 0) {
                // Use the EFC to filter for the value. Return it as the new value
                // of the accumulator.
                return result[0].filterIt(acc, value);
            }
            return acc;
        },
        data
    );

    let analysisRows;
    if (filteredData) {
        analysisRows = getAnalyses(filteredData);
    } else {
        analysisRows = [];
    }

    return (
        <div id={id(ids.ROOT)} className={classes.root}>
            {isLoading ? (
                <VICEAdminSkeleton />
            ) : (
                <>
                    <RowFilter
                        filters={filters}
                        addToFilters={addToFilters}
                        deleteFromFilters={deleteFromFilters}
                    />
                    <CollapsibleTable
                        rows={analysisRows}
                        columns={analysisColumns}
                    />
                    <CollapsibleTable
                        rows={filteredData.deployments}
                        columns={deploymentColumns}
                    />
                </>
            )}
            <div className={classes.footer} />
        </div>
    );
};

export default withI18N(VICEAdmin, messages);
