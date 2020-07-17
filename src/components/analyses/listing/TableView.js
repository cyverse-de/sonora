/**
 * @author sriram
 *
 * A tabular view of analyses
 *
 */
import React, { useState } from "react";

import { injectIntl } from "react-intl";

import ids from "../ids";
import messages from "../messages";
import WrappedErrorHandler from "../../utils/error/WrappedErrorHandler";
import TableLoading from "../../utils/TableLoading";
import {
    getAnalysisUser,
    isInteractive,
    allowAnalysisTimeExtn,
    isBatchAnalysis,
} from "../utils";

import {
    build,
    DECheckbox,
    EmptyTable,
    EnhancedTableHead,
    formatDate,
    formatMessage,
    getMessage,
    withI18N,
} from "@cyverse-de/ui-lib";

import {
    IconButton,
    makeStyles,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Tooltip,
    Typography,
    useMediaQuery,
    useTheme,
} from "@material-ui/core";

import {
    HourglassEmptyRounded as HourGlass,
    Launch as LaunchIcon,
    PermMedia as OutputFolderIcon,
    Repeat as RelaunchIcon,
    UnfoldMore as UnfoldMoreIcon,
} from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
    name: {
        paddingLeft: theme.spacing(1),
    },
    action: {
        color: theme.palette.info.main,
        margin: theme.spacing(0.5),
        "&:hover": {
            color: theme.palette.primary.main,
        },
    },
    actionHover: {
        margin: theme.spacing(0.5),
        color: theme.palette.primary.main,
    },
}));

function AnalysisName(props) {
    const classes = useStyles();
    const analysis = props.analysis;
    const name = analysis.name;
    const baseId = props.baseId;
    return (
        <Tooltip
            id={build(baseId, ids.ANALYSIS_NAME_CELL, ids.TOOLTIP)}
            aria-label={name}
            title={name}
        >
            <Typography
                id={build(baseId, ids.ANALYSIS_NAME_CELL)}
                className={classes.name}
                variant="body2"
            >
                {name}
            </Typography>
        </Tooltip>
    );
}

function AppName(props) {
    const analysis = props.analysis;
    const name = analysis.app_name;
    return <Typography variant="body2">{name}</Typography>;
}

function Status(props) {
    const { analysis, baseId } = props;
    return (
        <Typography variant="body2" id={build(baseId, ids.STATUS)}>
            {analysis.status}
        </Typography>
    );
}

function Actions(props) {
    const classes = useStyles();
    const { analysis, handleRelaunch } = props;

    const interactiveUrls = analysis.interactive_urls;
    const handleInteractiveUrlClick = props.handleInteractiveUrlClick;
    const handleGoToOutputFolder = props.handleGoToOutputFolder;
    const handleBatchIconClick = props.handleBatchIconClick;
    const intl = props.intl;
    const baseId = props.baseId;
    const mouseOverId = props.mouseOverId;
    const username = props.username;
    const isDisabled = analysis.app_disabled;
    const className =
        mouseOverId === analysis.id ? classes.actionHover : classes.action;

    const isBatch = isBatchAnalysis(analysis);
    const isVICE = isInteractive(analysis);
    const allowTimeExtn = allowAnalysisTimeExtn(analysis, username);

    return (
        <>
            <Tooltip
                aria-label={formatMessage(intl, "goOutputFolder")}
                title={getMessage("goOutputFolder")}
                id={build(baseId, ids.ICONS.OUTPUT, ids.TOOLTIP)}
            >
                <IconButton
                    size="small"
                    onClick={() => handleGoToOutputFolder(analysis)}
                    id={build(baseId, ids.ICONS.OUTPUT, ids.BUTTON)}
                    className={className}
                >
                    <OutputFolderIcon />
                </IconButton>
            </Tooltip>

            {isBatch && (
                <Tooltip
                    aria-label={formatMessage(intl, "htDetails")}
                    title={getMessage("htDetails")}
                    id={build(baseId, ids.ICONS.BATCH, ids.TOOLTIP)}
                >
                    <IconButton
                        size="small"
                        onClick={() => handleBatchIconClick(analysis)}
                        id={build(baseId, ids.ICONS.BATCH, ids.BUTTON)}
                        className={className}
                    >
                        <UnfoldMoreIcon />
                    </IconButton>
                </Tooltip>
            )}
            {!isDisabled && !isVICE && (
                <Tooltip
                    aria-label={formatMessage(intl, "relaunch")}
                    title={getMessage("relaunch")}
                    id={build(baseId, ids.ICONS.RELAUNCH, ids.TOOLTIP)}
                >
                    <IconButton
                        size="small"
                        onClick={() => handleRelaunch([analysis])}
                        id={build(baseId, ids.ICONS.RELAUNCH, ids.BUTTON)}
                        className={className}
                    >
                        <RelaunchIcon />
                    </IconButton>
                </Tooltip>
            )}
            {isVICE && (
                <Tooltip
                    id={build(baseId, ids.ICONS.INTERACTIVE, ids.TOOLTIP)}
                    aria-label={formatMessage(intl, "goToVice")}
                    title={getMessage("goToVice")}
                >
                    <IconButton
                        onClick={() =>
                            handleInteractiveUrlClick(interactiveUrls[0])
                        }
                        size="small"
                        id={build(baseId, ids.ICONS.INTERACTIVE, ids.BUTTON)}
                        className={className}
                    >
                        <LaunchIcon />
                    </IconButton>
                </Tooltip>
            )}
            {allowTimeExtn && (
                <Tooltip
                    aria-label={formatMessage(intl, "extendTime")}
                    title={getMessage("extendTime")}
                    id={build(baseId, ids.ICONS.TIME_LIMIT, ids.TOOLTIP)}
                >
                    <IconButton
                        id={build(baseId, ids.ICONS.TIME_LIMIT)}
                        size="small"
                        className={className}
                    >
                        <HourGlass />
                    </IconButton>
                </Tooltip>
            )}
        </>
    );
}

const columnData = (intl) => [
    {
        id: ids.NAME,
        name: formatMessage(intl, "name"),
        numeric: false,
        enableSorting: true,
        key: "name",
    },
    {
        id: ids.OWNER,
        name: formatMessage(intl, "owner"),
        numeric: false,
        enableSorting: false,
        key: "owner",
    },
    {
        id: ids.APP,
        name: formatMessage(intl, "app"),
        numeric: false,
        enableSorting: false,
        key: "app",
    },
    {
        id: ids.START_DATE,
        name: formatMessage(intl, "startDate"),
        numeric: false,
        enableSorting: true,
        key: "startdate",
    },
    {
        id: ids.END_DATE,
        name: formatMessage(intl, "endDate"),
        numeric: false,
        enableSorting: true,
        key: "enddate",
    },
    {
        id: ids.STATUS,
        name: formatMessage(intl, "status"),
        numeric: false,
        enableSorting: true,
        key: "status",
    },
    {
        id: ids.ACTIONS,
        name: "",
        numeric: false,
        enableSorting: false,
        key: "actions",
    },
];

function TableView(props) {
    const {
        loading,
        error,
        username,
        listing,
        parentId,
        baseId,
        order,
        orderBy,
        selected,
        handleRequestSort,
        handleSelectAllClick,
        handleClick,
        handleInteractiveUrlClick,
        handleGoToOutputFolder,
        handleRelaunch,
        handleBatchIconClick,
        intl,
    } = props;

    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
    let columns = columnData(intl);
    //hide actions on small screens
    if (isSmall) {
        columns = columns.filter((column) => column.id !== ids.ACTIONS);
    }

    const analyses = listing?.analyses;
    const tableId = build(baseId, ids.LISTING_TABLE);
    const [mouseOverId, setMouseOverId] = useState("");

    if (error) {
        return <WrappedErrorHandler errorObject={error} baseId={baseId} />;
    }

    return (
        <TableContainer component={Paper} style={{ overflow: "auto" }}>
            <Table
                id={tableId}
                stickyHeader={true}
                size="small"
                aria-label={formatMessage(intl, "ariaTableListing")}
            >
                <EnhancedTableHead
                    baseId={baseId}
                    selectable={true}
                    numSelected={selected.length}
                    rowsInPage={listing?.analyses?.length || 0}
                    order={order}
                    orderBy={orderBy}
                    columnData={columns}
                    onRequestSort={handleRequestSort}
                    onSelectAllClick={handleSelectAllClick}
                />
                {loading && (
                    <TableLoading
                        numColumns={columns.length + 2}
                        numRows={25}
                        baseId={tableId}
                    />
                )}
                {!loading && (
                    <TableBody>
                        {(!analyses || analyses.length === 0) && !error && (
                            <EmptyTable
                                message={getMessage("noAnalyses")}
                                numColumns={columns.length}
                            />
                        )}
                        {analyses &&
                            analyses.length > 0 &&
                            analyses.map((analysis, index) => {
                                const id = analysis.id;
                                const user = getAnalysisUser(analysis);
                                const isSelected = selected.indexOf(id) !== -1;
                                const rowId = build(baseId, tableId, id);
                                return (
                                    <TableRow
                                        onClick={(event) =>
                                            handleClick(event, id, index)
                                        }
                                        onMouseOver={() => {
                                            setMouseOverId(id);
                                        }}
                                        onMouseOut={() => {
                                            setMouseOverId("");
                                        }}
                                        onFocus={() => setMouseOverId(id)}
                                        onBlur={() => setMouseOverId("")}
                                        role="checkbox"
                                        aria-checked={isSelected}
                                        tabIndex={-1}
                                        selected={isSelected}
                                        hover
                                        key={id}
                                        id={rowId}
                                    >
                                        <TableCell padding="checkbox">
                                            <DECheckbox
                                                id={build(rowId, ids.CHECKBOX)}
                                                checked={isSelected}
                                                tabIndex={0}
                                                inputProps={{
                                                    "aria-label": formatMessage(
                                                        intl,
                                                        "ariaCheckbox",
                                                        {
                                                            label:
                                                                analysis.name,
                                                        }
                                                    ),
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell
                                            id={build(
                                                rowId + ids.ANALYSIS_NAME_CELL
                                            )}
                                        >
                                            <AnalysisName
                                                intl={intl}
                                                analysis={analysis}
                                                baseId={build(
                                                    rowId +
                                                        ids.ANALYSIS_NAME_CELL
                                                )}
                                                parentId={parentId}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {user}
                                            </Typography>
                                        </TableCell>
                                        <TableCell
                                            id={build(rowId, ids.APP_NAME_CELL)}
                                        >
                                            <AppName analysis={analysis} />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {formatDate(analysis.startdate)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {formatDate(analysis.enddate)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell
                                            id={build(rowId, ids.SUPPORT_CELL)}
                                        >
                                            <Status
                                                analysis={analysis}
                                                baseId={baseId}
                                                intl={intl}
                                            />
                                        </TableCell>
                                        {!isSmall && (
                                            <TableCell>
                                                <Actions
                                                    intl={intl}
                                                    analysis={analysis}
                                                    username={username}
                                                    baseId={build(
                                                        rowId +
                                                            ids.ANALYSIS_ACTIONS_CELL
                                                    )}
                                                    handleInteractiveUrlClick={
                                                        handleInteractiveUrlClick
                                                    }
                                                    handleGoToOutputFolder={
                                                        handleGoToOutputFolder
                                                    }
                                                    handleRelaunch={
                                                        handleRelaunch
                                                    }
                                                    handleBatchIconClick={
                                                        handleBatchIconClick
                                                    }
                                                    mouseOverId={mouseOverId}
                                                />
                                            </TableCell>
                                        )}
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                )}
            </Table>
        </TableContainer>
    );
}

export default withI18N(injectIntl(TableView), messages);
