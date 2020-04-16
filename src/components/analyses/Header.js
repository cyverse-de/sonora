/**
 * @author sriram
 *
 * A component that acts as a header to the analyses listing view.
 * It contains the primary actions a user would want to accomplish with
 * analyses and also allows toggling the table or grid view.
 */

import React from "react";

import { build, formatMessage, getMessage, withI18N } from "@cyverse-de/ui-lib";
import {
    IconButton,
    makeStyles,
    TextField,
    Toolbar,
    Tooltip,
    Typography,
} from "@material-ui/core";
import {
    Apps as GridIcon,
    FormatListBulleted as TableIcon,
} from "@material-ui/icons";
import { injectIntl } from "react-intl";
import ids from "./ids";
import messages from "./messages";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { getAppTypeFilters } from "../apps/AppNavigation";
import ownershipFilter from "./model/ownershipFilter";
import ClearIcon from "@material-ui/icons/Clear";

const useStyles = makeStyles((theme) => ({
    toolbar: {
        backgroundColor: theme.palette.primary.main,
    },
    menuButton: {
        color: theme.palette.primary.contrastText,
    },
    divider: {
        flexGrow: 1,
    },
    filter: {
        backgroundColor: theme.palette.primary.contrastText,
        [theme.breakpoints.down("xs")]: {
            width: 130,
        },
        [theme.breakpoints.up("sm")]: {
            width: 150,
        },
        padding: theme.spacing(0.2),
        margin: theme.spacing(1.5),
    },
    batchFilter: {
        color: theme.palette.primary.contrastText,
    },
}));

function getOwnershipFilters() {
    return Object.keys(ownershipFilter).map((filter) => {
        return {
            name: ownershipFilter[filter],
        };
    });
}

function Header(props) {
    const classes = useStyles();
    const {
        baseId,
        appTypeFilter,
        ownershipFilter,
        isGridView,
        toggleDisplay,
        handleAppTypeFilterChange,
        handleOwnershipFilterChange,
        viewBatch,
        onClearBatch,
        intl,
    } = props;

    let headerId = build(baseId, ids.HEADER);

    return (
        <Toolbar
            variant="dense"
            classes={{ root: classes.toolbar }}
            id={headerId}
        >
            {isGridView && (
                <Tooltip
                    id={build(headerId, ids.TABLE_VIEW_BTN, ids.TOOLTIP)}
                    title={getMessage("tableView")}
                    aria-label={formatMessage(intl, "tableView")}
                >
                    <IconButton
                        id={build(headerId, ids.TABLE_VIEW_BTN)}
                        edge="start"
                        className={classes.menuButton}
                        onClick={() => toggleDisplay()}
                    >
                        <TableIcon />
                    </IconButton>
                </Tooltip>
            )}
            {!isGridView && (
                <Tooltip
                    id={build(headerId, ids.GRID_VIEW_BTN, ids.TOOLTIP)}
                    title={getMessage("gridView")}
                    aria-label={formatMessage(intl, "gridView")}
                >
                    <IconButton
                        id={build(headerId, ids.GRID_VIEW_BTN)}
                        edge="start"
                        className={classes.menuButton}
                        onClick={() => toggleDisplay()}
                    >
                        <GridIcon />
                    </IconButton>
                </Tooltip>
            )}
            {viewBatch && (
                <>
                    <Typography className={classes.batchFilter}>
                        {getMessage("viewingBatch")}: {viewBatch.name}
                    </Typography>
                    <Tooltip title={getMessage("clearBatch")}>
                        <IconButton
                            size="small"
                            color="secondary"
                            onClick={onClearBatch}
                        >
                            <ClearIcon />
                        </IconButton>
                    </Tooltip>
                </>
            )}
            <div className={classes.divider} />
            <Autocomplete
                disabled={false}
                value={ownershipFilter}
                options={getOwnershipFilters()}
                size="small"
                onChange={(event, newValue) => {
                    handleOwnershipFilterChange(newValue);
                }}
                getOptionLabel={(option) => option.name}
                getOptionSelected={(option, value) =>
                    option.name === value.name
                }
                className={classes.filter}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={formatMessage(intl, "viewFilter")}
                        variant="outlined"
                    />
                )}
            />

            <Autocomplete
                disabled={false}
                value={appTypeFilter}
                options={getAppTypeFilters()}
                size="small"
                onChange={(event, newValue) => {
                    handleAppTypeFilterChange(newValue);
                }}
                getOptionLabel={(option) => option.name}
                getOptionSelected={(option, value) =>
                    option.name === value.name
                }
                className={classes.filter}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={formatMessage(intl, "filterLbl")}
                        variant="outlined"
                    />
                )}
            />
        </Toolbar>
    );
}

export { getOwnershipFilters };
export default withI18N(injectIntl(Header), messages);
