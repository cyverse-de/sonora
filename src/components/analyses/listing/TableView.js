/**
 * @author sriram
 *
 * A tabular view of analyses
 *
 */
import React, { useState } from "react";
import { useTranslation } from "i18n";

import ids from "../ids";
import WrappedErrorHandler from "components/utils/error/WrappedErrorHandler";
import TableLoading from "components/utils/TableLoading";
import analysisFields from "../analysisFields";

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
    const { t } = useTranslation("analyses");
    const { analysis, handleRelaunch } = props;

    const interactiveUrls = analysis.interactive_urls;
    const handleInteractiveUrlClick = props.handleInteractiveUrlClick;
    const handleGoToOutputFolder = props.handleGoToOutputFolder;
    const handleBatchIconClick = props.handleBatchIconClick;
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
                aria-label={t("goOutputFolder")}
                title={t("goOutputFolder")}
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
                    aria-label={t("htDetails")}
                    title={t("htDetails")}
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
                    aria-label={t("relaunch")}
                    title={t("relaunch")}
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
                    aria-label={t("goToVice")}
                    title={t("goToVice")}
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
                    aria-label={t("extendTime")}
                    title={t("extendTime")}
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

const columnData = (t) => {
    const fields = analysisFields(t);
    return [
        {
            id: ids.NAME,
            name: fields.NAME.fieldName,
            numeric: false,
            enableSorting: true,
            key: fields.NAME.key,
        },
        {
            id: ids.OWNER,
            name: fields.OWNER.fieldName,
            numeric: false,
            enableSorting: false,
            key: fields.OWNER.key,
        },
        {
            id: ids.APP,
            name: fields.APP.fieldName,
            numeric: false,
            enableSorting: false,
            key: fields.APP.key,
        },
        {
            id: ids.START_DATE,
            name: fields.START_DATE.fieldName,
            numeric: false,
            enableSorting: true,
            key: fields.START_DATE.key,
        },
        {
            id: ids.END_DATE,
            name: fields.END_DATE.fieldName,
            numeric: false,
            enableSorting: true,
            key: fields.END_DATE.key,
        },
        {
            id: ids.STATUS,
            name: fields.STATUS.fieldName,
            numeric: false,
            enableSorting: true,
            key: fields.STATUS.key,
        },
        {
            id: ids.ACTIONS,
            name: fields.ACTIONS.fieldName,
            numeric: false,
            enableSorting: false,
            key: fields.ACTIONS.key,
        },
    ];
};

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
    } = props;

    const theme = useTheme();
    const { t } = useTranslation("analyses");

    const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
    let columns = columnData(t);
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
                aria-label={t("ariaTableListing")}
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
                                message={t("noAnalyses")}
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
                                                    "aria-label": t(
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
                                            />
                                        </TableCell>
                                        {!isSmall && (
                                            <TableCell>
                                                <Actions
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

export default TableView;
