import React, { useState } from "react";

import {
    Card,
    CardContent,
    TextField,
    Typography,
    CardHeader,
    makeStyles,
    Button,
} from "@material-ui/core";

import { getMessage as msg } from "@cyverse-de/ui-lib";

import { useMutation } from "react-query";

import { id } from "./functions";
import ids from "./ids";

import {
    getUserJobLimit,
    setUserJobLimit,
} from "../../../../serviceFacades/vice/admin";

const useStyles = makeStyles((theme) => ({
    root: {
        marginBottom: theme.spacing(4),
        width: "100%",
    },
}));

export default () => {
    const classes = useStyles();
    const [username, setUsername] = useState("");
    const [newLimit, setNewLimit] = useState("");
    const [currentLimit, setCurrentLimit] = useState("");

    // We're using a mutation instead of a query here because of a bug in
    // how react-query handles the 'enabled' flag in the config. It's fixed
    // in the latest version, but that version makes backwards-breaking changes
    // to the queryCache.refetchQueries() call that breaks most pages. The
    // upgrade to react-query will need to happen in another PR.
    const [
        getJobLimit,
        { isError, isLoading, isIdle, isFetching, error },
    ] = useMutation(getUserJobLimit, {
        onSuccess: (data) => setCurrentLimit(data?.concurrent_jobs),
    });

    const [setLimitMutation] = useMutation(setUserJobLimit, {
        onSuccess: () => getJobLimit({ username }),
    });

    if (isError) {
        console.log(error.message); // temporary
    }

    if (isLoading) {
        console.log("loading data"); // temporary
    }

    if (isIdle) {
        console.log("is idle"); // temporary
    }

    if (isFetching) {
        console.log("is fetching"); //temporary
    }

    return (
        <Card id={id(ids.CARD)} className={classes.root}>
            <CardHeader title={msg("jobLimits")} />

            <CardContent>
                <TextField
                    label={msg("username")}
                    id={id(ids.CARD, "textfield")}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            getJobLimit({ username });
                        }
                    }}
                />

                <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => getJobLimit({ username })}
                    id={id(ids.CARD, "search", "button")}
                >
                    {msg("search")}
                </Button>

                <Typography>
                    {`Concurrent Jobs Limit: ${currentLimit}`}
                </Typography>

                <TextField
                    label={msg("newJobLimit")}
                    id={id(ids.CARD, "newjobLimit")}
                    value={newLimit}
                    onChange={(e) => setNewLimit(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            setLimitMutation({ username, newLimit });
                        }
                    }}
                />

                <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => setLimitMutation({ username, newLimit })}
                    id={id(ids.CARD, "setLimit", "button")}
                >
                    {msg("set")}
                </Button>
            </CardContent>
        </Card>
    );
};
