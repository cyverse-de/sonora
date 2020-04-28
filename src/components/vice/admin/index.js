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
        flexWrap: "nowrap",
        justifyContent: "flex-start",
        overflow: "auto",
        height: "90vh",
        paddingLeft: theme.spacing(3),
        paddingRight: theme.spacing(3),
        paddingTop: theme.spacing(3),
        paddingBottom: 0,
    },
    filterSkeleton: {
        marginBottom: theme.spacing(5),
    },
    footer: {
        width: "100%",
        height: 128,

        [theme.breakpoints.down("sm")]: {
            height: 32,
        },
    },
}));

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
            <div className={classes.footer} />
        </div>
    );
};

export default withI18N(VICEAdmin, messages);
