import React, { useState } from "react";

import { useQuery } from "react-query";

import { makeStyles } from "@material-ui/styles";

import {
    build as buildID,
    //getMessage as msg,
    withI18N,
} from "@cyverse-de/ui-lib";

import getData from "../../../serviceFacades/vice/admin";

import AnalysesFilter from "./filter";
import AnalysisTable from "./analyses";

import ids from "./ids";
import messages from "./messages";
import { Skeleton } from "@material-ui/lab";

const id = (value) => buildID(ids.ROOT, value);

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        flexDirection: "column",
        flexWrap: "wrap",
        justifyContent: "center",
    },
    filterSkeleton: {
        marginBottom: theme.spacing(5),
    },
}));

// const testData = {
//     deployments: [
//         {
//             group: 1000,
//             appName: "jupyter-lab-scipy-notebook-latest",
//             analysisName: "jupyter-lab-scipy-notebook-latest-analysis",
//             creationTimestamp: "2020-03-26 10:28:39 -0700 MST",
//             name: "0f809627-361a-4ab6-97ea-76bf7b6f19a3",
//             username: "ipctest",
//             command: [],
//             appID: "bc93504c-d584-11e9-8413-008cfa5ae621",
//             port: 8888,
//             externalID: "0f809627-361a-4ab6-97ea-76bf7b6f19a3",
//             userID: "843c85dc-3629-11ea-93db-008cfa5ae621",
//             image: "cyversevice/jupyterlab-scipy:latest",
//             namespace: "vice-apps",
//             user: 1000,
//         },
//         {
//             group: 1000,
//             appName: "copy-of-nanodj",
//             analysisName: "copy-of-nanodj-analysis",
//             creationTimestamp: "2020-03-26 10:20:29 -0700 MST",
//             name: "28655b9a-5959-4157-baf1-2436a83d19e7",
//             username: "ipcdev",
//             command: [],
//             appID: "57712906-d5e7-11e9-869a-008cfa5ae621",
//             port: 8888,
//             externalID: "28655b9a-5959-4157-baf1-2436a83d19e7",
//             userID: "6c04cd3e-854a-11e4-8fa0-1fbef07e6168",
//             image: "cyverse/jupyterlab-nanodj:latest",
//             namespace: "vice-apps",
//             user: 1000,
//         },
//         {
//             group: 1000,
//             appName: "jupyter-lab-scipy-google-earth-engine",
//             analysisName: "jupyter-lab-scipy-google-earth-engine-analysis",
//             creationTimestamp: "2020-01-31 18:35:21 -0700 MST",
//             name: "e112629a-67ec-4018-bf28-30b244e940c3",
//             username: "not-a-user",
//             command: [],
//             appID: "1f5e7f3a-e46c-11e9-870d-008cfa5ae621",
//             port: 8888,
//             externalID: "e112629a-67ec-4018-bf28-30b244e940c3",
//             userID: "6bec60d2-854a-11e4-b87e-1f417f9dbc81",
//             image: "cyversevice/jupyterlab-scipy:gee-latest",
//             namespace: "vice-apps",
//             user: 1000,
//         },
//     ],
// };

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

    return (
        <div id={id(ids.ROOT)} className={classes.root}>
            {isLoading ? (
                <VICEAdminSkeleton />
            ) : (
                <>
                    <AnalysesFilter
                        filters={filters}
                        addToFilters={addToFilters}
                        deleteFromFilters={deleteFromFilters}
                    />
                    <AnalysisTable data={data} />
                </>
            )}
        </div>
    );
};

export default withI18N(VICEAdmin, messages);
