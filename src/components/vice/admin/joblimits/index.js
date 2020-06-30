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

import { useQuery } from "react-query";

import { id } from "./functions";
import ids from "./ids";

import { getUserJobLimit } from "../../../../serviceFacades/vice/admin";

const useStyles = makeStyles((theme) => ({
    root: {
        marginBottom: theme.spacing(4),
        width: "100%",
    },
}));

export default () => {
    const classes = useStyles();
    const [username, setUsername] = useState("");

    const {
        data,
        error,
        refetch,
        isIdle,
        isLoading,
        isError,
        isFetching,
    } = useQuery({
        queryKey: ["getJobLimits", username],
        queryFn: getUserJobLimit,
        config: {
            enabled: false,
        },
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

    console.log(username);
    console.log(data);

    return (
        <Card id={id(ids.CARD)} className={classes.root}>
            <CardHeader title={msg("jobLimits")} />

            <CardContent>
                <Typography>Username</Typography>

                <TextField
                    label={msg("username")}
                    id={id(ids.CARD, "textfield")}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            refetch();
                        }
                    }}
                />

                <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => refetch()}
                    id={id(ids.CARD, "search", "button")}
                >
                    {msg("search")}
                </Button>

                <TextField
                    label={msg("jobLimit")}
                    id={id(ids.CARD, "jobLimit")}
                    value={data?.concurrent_jobs || "not loaded"}
                />
            </CardContent>
        </Card>
    );
};
