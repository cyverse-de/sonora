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
    IconButton,
    useTheme,
    useMediaQuery,
    Button,
    Popper,
} from "@material-ui/core";

import { Skeleton } from "@material-ui/lab";

import { KeyboardArrowUp, KeyboardArrowDown } from "@material-ui/icons";

import { useQuery } from "react-query";

import {
    asyncData,
    ASYNC_DATA_QUERY_KEY,
} from "../../../../serviceFacades/vice/admin";

import messages from "./messages";
import ids from "./ids";
import useStyles from "./styles";

// Constructs an ID for an element.
const id = (...names) => buildID(ids.BASE, ...names);

const ActionButtonsSkeleton = () => {
    return (
        <Skeleton variant="rect" animation="wave" height={75} width="100%" />
    );
};

const ActionButton = ({ baseID, name, handler, onClick, popperMsgKey }) => {
    const classes = useStyles();
    return (
        <Button
            id={id(baseID, "button", name)}
            variant="contained"
            color="primary"
            onClick={(event) => onClick(event, handler, popperMsgKey)}
            className={classes.actionButton}
        >
            {msg(name)}
        </Button>
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
        [ASYNC_DATA_QUERY_KEY, row.externalID],
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
                    <ActionButton
                        baseID={row.externalID}
                        name="extendTimeLimit"
                        handler={handleExtendTimeLimit}
                        popperMsgKey="timeLimitExtended"
                        onClick={onClick}
                    />

                    <ActionButton
                        baseID={row.externalID}
                        name="downloadInputs"
                        handler={handleDownloadInputs}
                        popperMsgKey="downloadInputsCommandSent"
                        onClick={onClick}
                    />

                    <ActionButton
                        baseID={row.externalID}
                        name="uploadOutputs"
                        handler={handleUploadOutputs}
                        popperMsgKey="uploadOutputsCommandSent"
                        onClick={onClick}
                    />

                    <ActionButton
                        baseID={row.externalID}
                        name="exit"
                        handler={handleExit}
                        popperMsgKey="exitCommandSent"
                        onClick={onClick}
                    />

                    <ActionButton
                        baseID={row.externalID}
                        name="saveAndExit"
                        handler={handleExit}
                        popperMsgKey="saveAndExitCommandSent"
                        onClick={onClick}
                    />

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
