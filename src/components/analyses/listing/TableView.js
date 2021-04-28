/**
 * @author sriram
 *
 * A tabular view of analyses
 *
 */
import React from "react";
import { useTranslation } from "i18n";

import Actions from "./Actions";
import ids from "../ids";

import analysisStatus from "components/models/analysisStatus";
import WrappedErrorHandler from "components/utils/error/WrappedErrorHandler";
import TableLoading from "components/utils/TableLoading";
import { DERow } from "components/utils/DERow";
import DETableHead from "components/utils/DETableHead";

import analysisFields from "../analysisFields";

import { getAnalysisUser } from "../utils";

import { build, DECheckbox, EmptyTable, formatDate } from "@cyverse-de/ui-lib";

import {
    makeStyles,
    Link,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    Tooltip,
    Typography,
    useMediaQuery,
    useTheme,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    name: {
        paddingLeft: theme.spacing(1),
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
    const { analysis, baseId, onStatusClick } = props;

    let StatusDisplay = Typography,
        statusDisplayProps = {
            id: build(baseId, ids.STATUS),
            variant: "body2",
        };

    if (
        [
            analysisStatus.SUBMITTED,
            analysisStatus.RUNNING,
            analysisStatus.COMPLETED,
            analysisStatus.FAILED,
        ].includes(analysis.status)
    ) {
        StatusDisplay = Link;
        statusDisplayProps.component = "button";
        statusDisplayProps.onClick = () => onStatusClick(analysis);
    }

    return (
        <StatusDisplay {...statusDisplayProps}>{analysis.status}</StatusDisplay>
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
        handleBatchIconClick,
        handleDetailsClick,
        handleCheckboxClick,
        handleStatusClick,
        setPendingTerminationDlgOpen,
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
                <DETableHead
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
                                    <DERow
                                        onClick={(event) =>
                                            handleClick(event, id, index)
                                        }
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
                                                onChange={(event) =>
                                                    handleCheckboxClick(
                                                        event,
                                                        id,
                                                        index
                                                    )
                                                }
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
                                                onStatusClick={
                                                    handleStatusClick
                                                }
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
                                                    handleBatchIconClick={
                                                        handleBatchIconClick
                                                    }
                                                    handleDetailsClick={
                                                        handleDetailsClick
                                                    }
                                                    setPendingTerminationDlgOpen={
                                                        setPendingTerminationDlgOpen
                                                    }
                                                />
                                            </TableCell>
                                        )}
                                    </DERow>
                                );
                            })}
                    </TableBody>
                )}
            </Table>
        </TableContainer>
    );
}

export default TableView;
