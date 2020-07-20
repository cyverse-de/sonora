/**
 * @author sriram
 *
 * A Filter filed for admin Reference Genome Listing
 *
 */

import React from "react";

import { injectIntl } from "react-intl";

import ids from "./ids";
import messages from "./messages";

import { build, formatMessage, withI18N } from "@cyverse-de/ui-lib";

import InputBase from "@material-ui/core/InputBase";
import { makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";

const useStyles = makeStyles((theme) => ({
    search: {
        position: "relative",
        borderRadius: theme.shape.borderRadius,
        marginRight: theme.spacing(2),
        marginLeft: 0,
        [theme.breakpoints.up("sm")]: {
            marginLeft: theme.spacing(3),
            width: "auto",
        },
    },
    searchIcon: {
        width: theme.spacing(7),
        height: "100%",
        position: "absolute",
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    inputRoot: {
        color: "inherit",
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 7),
        transition: theme.transitions.create("width"),
        width: "100%",
        [theme.breakpoints.up("md")]: {
            width: 200,
        },
    },
}));

const GlobalFilter = ({
    baseId,
    preGlobalFilteredRows,
    globalFilter,
    setGlobalFilter,
    intl,
}) => {
    const classes = useStyles();
    const count = preGlobalFilteredRows.length;

    // Global filter only works with pagination from the first page.
    // This may not be a problem for server side pagination when
    // only the current page is downloaded.

    return (
        <div className={classes.search}>
            <div className={classes.searchIcon}>
                <SearchIcon />
            </div>
            <InputBase
                id={build(baseId, ids.FILTER_FIELD)}
                value={globalFilter || ""}
                onChange={(e) => {
                    setGlobalFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
                }}
                placeholder={`${count} ${formatMessage(intl, "genomes")}`}
                classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput,
                }}
                inputProps={{ "aria-label": formatMessage(intl, "search") }}
            />
        </div>
    );
};

export default withI18N(injectIntl(GlobalFilter), messages);
