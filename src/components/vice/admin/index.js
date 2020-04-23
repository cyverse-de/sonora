import React from "react";

import { makeStyles } from "@material-ui/styles";

import {
    build as buildID,
    //getMessage as msg,
    withI18N,
} from "@cyverse-de/ui-lib";

import ids from "./ids";
import messages from "./messages";

const id = (value) => buildID(ids.ROOT, value);

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        flexDirection: "column",
        flexWrap: "wrap",
        justifyContent: "center",
    },
}));

const VICEAdmin = () => {
    const classes = useStyles();

    return <div id={id(ids.ROOT)} className={classes.root}></div>;
};

export default withI18N(VICEAdmin, messages);
