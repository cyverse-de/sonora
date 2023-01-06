/**
 * @author sriram
 *
 * A tabular view of analyses
 *
 */
import React from "react";
import { useTranslation } from "i18n";
import Link from "next/link";

import Actions from "./Actions";
import ids from "../ids";

import analysisStatus from "components/models/analysisStatus";
import WrappedErrorHandler from "components/error/WrappedErrorHandler";
import TableLoading from "components/table/TableLoading";
import { DERow } from "components/table/DERow";
import DETableHead from "components/table/DETableHead";

import useAnalysisRunTime from "../useAnalysisRunTime";
import analysisFields from "../analysisFields";

import { getAnalysisDetailsLinkRefs } from "../utils";

import buildID from "components/utils/DebugIDUtil";
import { formatDate } from "components/utils/DateFormatter";
import DECheckbox from "components/utils/DECheckbox";
import DELink from "components/utils/DELink";
import EmptyTable from "components/table/EmptyTable";

import {
    makeStyles,
    Link as MUILink,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    Typography,
    useMediaQuery,
    useTheme,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    name: {
        maxWidth: "12rem",
        overflowWrap: "break-word",
    },
}));

function AnalysisName(props) {
    const analysis = props.analysis;
    const name = analysis.name;
    const baseId = props.baseId;
    const [href, as] = getAnalysisDetailsLinkRefs(analysis.id);

    // Inserting the <wbr> tag at underscores allows browsers to wrap long
    // analysis names at those underscores.
    const linkText = name
        ?.split("_")
        ?.reduce((acc, cur, i) => [...acc, "_", <wbr key={i} />, cur]);

    return (
        <Link href={href} as={as} passHref>
            <DELink
                id={buildID(baseId, ids.ANALYSIS_NAME_CELL)}
                text={linkText}
                title={name}
            />
        </Link>
    );
}

function AnalysisDuration({ analysis }) {
    const { elapsedTime, totalRunTime } = useAnalysisRunTime(analysis);

    return (
        <Typography variant="body2">{totalRunTime || elapsedTime}</Typography>
    );
}

function Status(props) {
    const { analysis, baseId, onStatusClick } = props;

    let StatusDisplay = Typography,
        statusDisplayProps = {
            id: buildID(baseId, ids.STATUS),
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
        StatusDisplay = MUILink;
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
            id: ids.STATUS,
            name: fields.STATUS.fieldName,
            numeric: false,
            enableSorting: true,
            key: fields.STATUS.key,
        },
        {
            id: ids.START_DATE,
            name: fields.START_DATE.fieldName,
            numeric: false,
            enableSorting: true,
            key: fields.START_DATE.key,
        },
        {
            id: ids.DURATION,
            name: fields.DURATION.fieldName,
            numeric: false,
            enableSorting: false,
            key: fields.DURATION.key,
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
        handleTerminateSelected,
        handleBatchIconClick,
        handleDetailsClick,
        handleCheckboxClick,
        handleStatusClick,
        setPendingTerminationDlgOpen,
        handleTimeLimitExtnClick,
        setVICELogsDlgOpen,
    } = props;

    const theme = useTheme();
    const classes = useStyles();
    const { t } = useTranslation("analyses");

    const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
    let columns = columnData(t);
    //hide actions on small screens
    if (isSmall) {
        columns = columns.filter((column) => column.id !== ids.ACTIONS);
    }

    const analyses = listing?.analyses;
    const tableId = buildID(baseId, ids.LISTING_TABLE);

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
                                const isSelected = selected.indexOf(id) !== -1;
                                const rowId = buildID(baseId, tableId, id);

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
                                                id={buildID(
                                                    rowId,
                                                    ids.CHECKBOX
                                                )}
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
                                                            label: analysis.name,
                                                        }
                                                    ),
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell
                                            id={buildID(
                                                rowId + ids.ANALYSIS_NAME_CELL
                                            )}
                                            className={classes.name}
                                        >
                                            <AnalysisName
                                                analysis={analysis}
                                                baseId={buildID(
                                                    rowId +
                                                        ids.ANALYSIS_NAME_CELL
                                                )}
                                                parentId={parentId}
                                            />
                                        </TableCell>
                                        <TableCell
                                            id={buildID(
                                                rowId,
                                                ids.SUPPORT_CELL
                                            )}
                                        >
                                            <Status
                                                analysis={analysis}
                                                baseId={baseId}
                                                onStatusClick={
                                                    handleStatusClick
                                                }
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {formatDate(analysis.startdate)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <AnalysisDuration
                                                analysis={analysis}
                                            />
                                        </TableCell>
                                        {!isSmall && (
                                            <TableCell>
                                                <Actions
                                                    analysis={analysis}
                                                    username={username}
                                                    baseId={buildID(
                                                        rowId +
                                                            ids.ANALYSIS_ACTIONS_CELL
                                                    )}
                                                    handleInteractiveUrlClick={
                                                        handleInteractiveUrlClick
                                                    }
                                                    handleTerminateSelected={
                                                        handleTerminateSelected
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
                                                    handleTimeLimitExtnClick={
                                                        handleTimeLimitExtnClick
                                                    }
                                                    setVICELogsDlgOpen={
                                                        setVICELogsDlgOpen
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
