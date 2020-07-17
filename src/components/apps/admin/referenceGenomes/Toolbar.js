import React from "react";

import PropTypes from "prop-types";
import GlobalFilter from "./GlobalFilter";

import {makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import { IconButton } from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";

const useToolbarStyles = makeStyles((theme) => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
    },
}));

const TableToolbar = (props) => {
    const classes = useToolbarStyles();
    const { preGlobalFilteredRows, setGlobalFilter, globalFilter } = props;
    return (
        <Toolbar className={classes.root}>
            <IconButton color="primary">
                <AddCircleIcon />
            </IconButton>
            <GlobalFilter
                preGlobalFilteredRows={preGlobalFilteredRows}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
            />
        </Toolbar>
    );
};

TableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
    addUserHandler: PropTypes.func.isRequired,
    deleteUserHandler: PropTypes.func.isRequired,
    setGlobalFilter: PropTypes.func.isRequired,
    preGlobalFilteredRows: PropTypes.array.isRequired,
    globalFilter: PropTypes.string.isRequired,
};

export default TableToolbar;
