import React, { useState, useEffect } from "react";

import {
    build as buildID,
    withI18N,
    EnhancedTableHead,
    getMessage as msg,
} from "@cyverse-de/ui-lib";

import {
    Box,
    Collapse,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    Paper,
    TableRow,
    Typography,
    makeStyles,
    IconButton,
    useTheme,
    useMediaQuery,
    Button,
    Popper,
} from "@material-ui/core";

import { Skeleton } from "@material-ui/lab";

import { useQuery } from "react-query";

import { asyncData } from "../../../../serviceFacades/vice/admin";

import messages from "./messages";
import ids from "./ids";
import { KeyboardArrowUp, KeyboardArrowDown } from "@material-ui/icons";

// Constructs an ID for an element.
const id = (...names) => buildID(ids.BASE, ...names);

const useStyles = makeStyles((theme) => ({
    root: {
        width: "100%",
    },
    paper: {
        width: "100%",
        marginBottom: theme.spacing(5),
    },
    title: {
        padding: theme.spacing(2),
    },
    table: {
        height: "100%",
    },
    extended: {
        display: "flex",
        flexWrap: "wrap",
        flexShrink: 0,
        flexGrow: 0,
    },
    row: {
        "& > *": {
            borderBottom: "unset",
        },
    },
    dataEntry: {
        [theme.breakpoints.up("xs")]: {
            width: "100%",
            marginLeft: 0,
            marginRight: 0,
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(1),
        },
        [theme.breakpoints.up("sm")]: {
            width: 300,
            marginLeft: 0,
            marginRight: 0,
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(1),
        },
        [theme.breakpoints.up("lg")]: {
            width: 350,
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(2),
            marginRight: theme.spacing(2),
        },
    },
    dataEntryLabel: {
        marginRight: theme.spacing(1),
        fontWeight: 500,
    },
    actionButton: {
        marginRight: theme.spacing(1),
        marginBottom: theme.spacing(1),
        marginTop: theme.spacing(1),
    },
    actions: {
        marginLeft: theme.spacing(11),
        marginRight: theme.spacing(11),

        [theme.breakpoints.down("sm")]: {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
        },
    },
    paperPopper: {
        border: "1px solid",
        padding: theme.spacing(1),
        backgroundColor: theme.palette.background.paper,
    },
}));

const ActionButtonsSkeleton = () => {
    return (
        <>
            <Skeleton
                variant="rect"
                animation="wave"
                height={75}
                width="100%"
            />
        </>
    );
};

const ActionButtons = ({
    row,
    handleExtendTimeLimit = (_) => {},
    handleDownloadInputs = (_) => {},
    handleUploadOutputs = (_) => {},
    handleExit = (_) => {},
    handleSaveAndExit = (_) => {},
}) => {
    const classes = useStyles();

    const [anchorEl, setAnchorEl] = useState(null);
    const [open, setOpen] = useState(false);
    const [popperMessage, setPopperMessage] = useState("");

    const { status, data, error } = useQuery(
        ["async-data", row.externalID],
        asyncData
    );
    const isLoading = status === "loading";
    const hasErrored = status === "error";

    if (hasErrored) {
        console.log(error);
    }

    const onClick = (event, dataFn, msgKey) => {
        let tlErr;
        let tlData;
        try {
            tlData = dataFn(data.analysisID, row.externalID);
        } catch (err) {
            tlErr = err;
        }
        setAnchorEl(event.currentTarget);
        setPopperMessage(tlErr ? tlErr.message : msg(msgKey));
        setOpen(true);
        return tlData;
    };

    useEffect(() => {
        const timerID = setInterval(() => {
            if (open) {
                setOpen(false);
            }
        }, 3000);
        return () => clearInterval(timerID);
    });

    return (
        <div className={classes.actions}>
            {isLoading ? (
                <ActionButtonsSkeleton />
            ) : (
                <>
                    <Button
                        id={id(row.externalID, "button", "extendTimeLimit")}
                        variant="contained"
                        color="primary"
                        onClick={(event) =>
                            onClick(
                                event,
                                handleExtendTimeLimit,
                                "timeLimitExtended"
                            )
                        }
                        className={classes.actionButton}
                    >
                        {msg("extendTimeLimit")}
                    </Button>

                    <Button
                        id={id(row.externalID, "button", "downloadInputs")}
                        variant="contained"
                        color="primary"
                        onClick={(event) =>
                            onClick(
                                event,
                                handleDownloadInputs,
                                "downloadInputsCommandSent"
                            )
                        }
                        className={classes.actionButton}
                    >
                        {msg("downloadInputs")}
                    </Button>

                    <Button
                        id={id(row.externalID, "button", "uploadOutputs")}
                        variant="contained"
                        color="primary"
                        onClick={(event) =>
                            onClick(
                                event,
                                handleUploadOutputs,
                                "uploadOutputsCommandSent"
                            )
                        }
                        className={classes.actionButton}
                    >
                        {msg("uploadOutputs")}
                    </Button>

                    <Button
                        id={id(row.externalID, "button", "exit")}
                        variant="contained"
                        color="primary"
                        onClick={() =>
                            handleExit(data.analysisID, row.externalID)
                        }
                        className={classes.actionButton}
                    >
                        {msg("exit")}
                    </Button>

                    <Button
                        id={id(row.externalID, "button", "saveAndExit")}
                        variant="contained"
                        color="primary"
                        onClick={() =>
                            handleSaveAndExit(data.analysisID, row.externalID)
                        }
                        className={classes.actionButton}
                    >
                        {msg("saveAndExit")}
                    </Button>

                    <Popper
                        id={id(row.externalID, "popper")}
                        open={open}
                        anchorEl={anchorEl}
                        placement="top"
                    >
                        <div className={classes.paperPopper}>
                            {popperMessage}
                        </div>
                    </Popper>
                </>
            )}
        </div>
    );
};

const ExtendedDataCard = ({
    columns,
    row,
    collapseID,
    showActions = false,
    handleExit,
    handleSaveAndExit,
    handleExtendTimeLimit,
    handleUploadOutputs,
    handleDownloadInputs,
}) => {
    const classes = useStyles();
    const theme = useTheme();
    const isMedium = useMediaQuery(theme.breakpoints.down("md"));

    let display = "inline";
    if (isMedium) {
        display = "block";
    }

    return (
        <Box margin={1}>
            <div className={`${classes.extended} ${classes.actions}`}>
                {columns.map((column) => {
                    return (
                        <div
                            className={classes.dataEntry}
                            id={id(collapseID, column.field)}
                            key={id(collapseID, column.field)}
                        >
                            <Typography
                                variant="body2"
                                align="left"
                                display={display}
                                id={id(collapseID, column.field, "label")}
                                classes={{ root: classes.dataEntryLabel }}
                            >
                                {column.name && `${column.name}:`}
                            </Typography>
                            <Typography
                                variant="body2"
                                align="left"
                                display={display}
                                id={id(collapseID, column.field, "value")}
                            >
                                {row &&
                                    row.hasOwnProperty(column.field) &&
                                    row[column.field]}
                            </Typography>
                        </div>
                    );
                })}
            </div>
            {showActions && (
                <ActionButtons
                    row={row}
                    handleDownloadInputs={handleDownloadInputs}
                    handleUploadOutputs={handleUploadOutputs}
                    handleExtendTimeLimit={handleExtendTimeLimit}
                    handleExit={handleExit}
                    handleSaveAndExit={handleSaveAndExit}
                />
            )}
        </Box>
    );
};

const CollapsibleTableRow = ({
    row,
    columns,
    baseID,
    startColumn,
    endColumn,
    showActions,
    handleExit,
    handleSaveAndExit,
    handleExtendTimeLimit,
    handleUploadOutputs,
    handleDownloadInputs,
}) => {
    const defaultOpen = false;

    const [open, setOpen] = useState(defaultOpen);
    const classes = useStyles();

    const expanderID = id(baseID, "row", "expander");
    const rowID = id(baseID, "row");
    const collapseID = id(rowID, "collapse");

    return (
        <>
            <TableRow className={classes.row} key={rowID} id={rowID}>
                <TableCell key={expanderID} id={expanderID}>
                    <IconButton
                        aria-label={msg("expandRow")}
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                </TableCell>

                {columns.slice(startColumn, endColumn).map((column) => {
                    const fieldID = id(rowID, column.field);
                    return (
                        <TableCell key={fieldID} id={fieldID}>
                            {row[column.field]}
                        </TableCell>
                    );
                })}
            </TableRow>

            <TableRow key={collapseID} id={collapseID}>
                <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0, width: "90%" }}
                    colSpan={endColumn}
                >
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <ExtendedDataCard
                            columns={columns.slice(endColumn)}
                            row={row}
                            collapseID={collapseID}
                            showActions={showActions}
                            handleExit={(analysisID, externalID) => {
                                setOpen(defaultOpen);
                                return handleExit(analysisID, externalID);
                            }}
                            handleSaveAndExit={(analysisID, externalID) => {
                                setOpen(defaultOpen);
                                return handleSaveAndExit(
                                    analysisID,
                                    externalID
                                );
                            }}
                            handleExtendTimeLimit={handleExtendTimeLimit}
                            handleUploadOutputs={handleUploadOutputs}
                            handleDownloadInputs={handleDownloadInputs}
                        />
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
};

const CollapsibleTable = ({
    columns,
    rows,
    title,
    showActions = false,
    handleExit,
    handleSaveAndExit,
    handleExtendTimeLimit,
    handleDownloadInputs,
    handleUploadOutputs,
}) => {
    const classes = useStyles();
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.up("xs"));
    const isMedium = useMediaQuery(theme.breakpoints.up("sm"));
    const isLarge = useMediaQuery(theme.breakpoints.up("lg"));
    const isXL = useMediaQuery(theme.breakpoints.up("xl"));

    let startColumn;
    let endColumn;

    if (isXL) {
        startColumn = 1;
        endColumn = 7;
    } else if (isLarge) {
        startColumn = 1;
        endColumn = 6;
    } else if (isMedium) {
        startColumn = 1;
        endColumn = 4;
    } else if (isSmall) {
        startColumn = 1;
        endColumn = 2;
    } else {
        startColumn = 1;
        endColumn = 7;
    }

    // The first entry in columns should be the expander columns,
    // so default to the second entry for sorting. The field is the
    // actual name of the column.
    const defaultOrderColumn = columns[1].field;
    const [orderColumn, setOrderColumn] = useState(defaultOrderColumn);

    const defaultOrder = "asc";
    const [order, setOrder] = useState(defaultOrder);

    const tableID = id(ids.ROOT);

    const sortAscending = (one, two) =>
        one[orderColumn].localeCompare(two[orderColumn]) * -1;

    const sortDescending = (one, two) =>
        one[orderColumn].localeCompare(two[orderColumn]);

    const handleRequestSort = (_event, columnName) => {
        const isAscending = orderColumn === columnName && order === "asc";
        setOrder(isAscending ? "desc" : "asc");
        setOrderColumn(columnName);

        if (isAscending) {
            rows.sort(sortAscending);
        } else {
            rows.sort(sortDescending);
        }
    };

    return (
        <Paper className={classes.paper}>
            <Typography
                variant="h5"
                id={id(tableID, "title")}
                className={classes.title}
            >
                {title}
            </Typography>
            <TableContainer classes={{ root: classes.root }}>
                <Table id={tableID} classes={{ root: classes.table }}>
                    <EnhancedTableHead
                        selectable={false}
                        baseId={tableID}
                        order={order}
                        orderBy={orderColumn}
                        columnData={columns.slice(0, endColumn)}
                        onRequestSort={handleRequestSort}
                    ></EnhancedTableHead>
                    <TableBody>
                        {rows?.map((row, index) => (
                            <CollapsibleTableRow
                                row={row}
                                key={row.externalID}
                                baseID={row.externalID}
                                columns={columns}
                                startColumn={startColumn}
                                endColumn={endColumn}
                                showActions={showActions}
                                handleExit={handleExit}
                                handleSaveAndExit={handleSaveAndExit}
                                handleExtendTimeLimit={handleExtendTimeLimit}
                                handleDownloadInputs={handleDownloadInputs}
                                handleUploadOutputs={handleUploadOutputs}
                            />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

export default withI18N(CollapsibleTable, messages);
