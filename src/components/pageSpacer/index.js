import React from "react";

import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
    root: {
        width: "100%",
        height: "50px",
    },
}));

const PageSpacer = () => {
    const classes = useStyles();

    return <div className={classes.root} />;
};

export default PageSpacer;
