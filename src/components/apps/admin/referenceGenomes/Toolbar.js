import React from "react";

import GlobalFilter from "./GlobalFilter";

import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import { Button } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";

const useToolbarStyles = makeStyles((theme) => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
    },
    toolbarItems: {
        [theme.breakpoints.down("xs")]: {
            margin: theme.spacing(0.5),
        },
        [theme.breakpoints.up("sm")]: {
            margin: theme.spacing(1),
        },
    },
}));

const TableToolbar = (props) => {
    const classes = useToolbarStyles();
    const {
        preGlobalFilteredRows,
        setGlobalFilter,
        globalFilter,
        onAddClicked,
    } = props;
    return (
        <Toolbar className={classes.root}>
            <Button
                variant="outlined"
                color="primary"
                startIcon={<AddIcon />}
                onClick={onAddClicked}
            >
                Add
            </Button>
            <GlobalFilter
                preGlobalFilteredRows={preGlobalFilteredRows}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
            />
        </Toolbar>
    );
};

export default TableToolbar;
