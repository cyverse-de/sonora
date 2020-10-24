/**
 * A table view of paginated notification messages.
 *
 * @author Sriram, psarando
 *
 **/
import React from "react";

import constants from "../../../constants";

import ids from "../ids";
import styles from "../styles";
import Message from "../Message";

import { useTranslation } from "i18n";

import { notificationTypeToCategory } from "components/models/NotificationCategory";

import DEPagination from "components/utils/DEPagination";
import TableLoading from "components/utils/TableLoading";
import WrappedErrorHandler from "components/utils/error/WrappedErrorHandler";

import {
    build as buildId,
    DECheckbox,
    EnhancedTableHead,
    EmptyTable,
    formatDate,
} from "@cyverse-de/ui-lib";

import {
    makeStyles,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Typography,
} from "@material-ui/core";

const useStyles = makeStyles(styles);

// Currently the API only supports sorting by the `timestamp` field.
const getColumns = (t) => [
    {
        id: ids.CATEGORY,
        key: "type",
        name: t("category"),
        numeric: false,
        enableSorting: false,
    },
    {
        id: ids.MESSAGE,
        key: "text",
        name: t("message"),
        numeric: false,
        enableSorting: false,
    },
    {
        id: ids.CREATED_DATE,
        key: "timestamp",
        name: t("created_date"),
        numeric: false,
        enableSorting: true,
    },
];

const TableView = (props) => {
    const {
        baseId,
        data,
        error,
        loading,
        order,
        orderBy,
        rowsPerPage,
        selected,
        total,
        setOffset,
        setOrder,
        setOrderBy,
        setRowsPerPage,
        setSelected,
    } = props;

    const [page, setPage] = React.useState(0);
    const [lastSelectedIndex, setLastSelectedIndex] = React.useState(-1);

    const classes = useStyles();

    const { t } = useTranslation("notifications");
    const columnData = getColumns(t);

    const handleChangePage = (event, newPage) => {
        const page = newPage - 1;

        setPage(page);
        setOffset(rowsPerPage * page);
        setSelected([]);
    };

    const handleChangeRowsPerPage = (pageSize) => {
        setRowsPerPage(pageSize);
        setPage(0);
        setOffset(0);
        setSelected([]);
    };

    const isSelected = (id) => selected.includes(id);

    const select = (ids) => {
        setSelected([...new Set([...selected, ...ids])]);
    };

    const deselect = (ids) => {
        setSelected(selected.filter((id) => !ids.includes(id)));
    };

    const toggleSelection = (id) => {
        isSelected(id) ? deselect([id]) : select([id]);
    };

    // Selects all ids in an index range.
    const rangeSelect = (start, end, targetId) => {
        // Ensure that the start index comes before the end index.
        if (start > end) {
            [start, end] = [end, start];
        }

        // Get the IDs for the range that the user selected.
        const rangeIds = data.slice(start, end + 1).map((n) => n.message.id);

        // Toggle the selection based on the last row clicked.
        isSelected(targetId) ? deselect(rangeIds) : select(rangeIds);
    };

    const handleRowClick = (event, id, index) => {
        if (event.shiftKey && lastSelectedIndex > -1) {
            rangeSelect(lastSelectedIndex, index, id);
        } else {
            setSelected([id]);
        }
        setLastSelectedIndex(index);
    };

    const handleCheckboxClick = (event, id, index) => {
        event.stopPropagation();

        if (event.shiftKey && lastSelectedIndex > -1) {
            handleRowClick(event, id, index);
        } else {
            toggleSelection(id);
            setLastSelectedIndex(index);
        }
    };

    const handleSelectAllClick = (event, checked) => {
        if (data) {
            setSelected(
                checked && !selected.length ? data.map((n) => n.message.id) : []
            );
        }
    };

    const handleRequestSort = (event, property) => {
        let newOrder = constants.SORT_DESCENDING;

        if (orderBy === property && order === constants.SORT_DESCENDING) {
            newOrder = constants.SORT_ASCENDING;
        }

        setOrder(newOrder);
        setOrderBy(property);
    };

    if (error) {
        return <WrappedErrorHandler errorObject={error} baseId={baseId} />;
    }

    return (
        <>
            <TableContainer component={Paper} style={{ overflow: "auto" }}>
                <Table stickyHeader={true} size="small">
                    {loading ? (
                        <TableLoading
                            baseId={baseId}
                            numColumns={columnData.length + 1}
                            numRows={25}
                        />
                    ) : (
                        <TableBody>
                            {(!data || data.length === 0) && (
                                <EmptyTable
                                    message={t("noNotifications")}
                                    numColumns={columnData.length}
                                />
                            )}
                            {data?.length > 0 &&
                                data.map((n, index) => {
                                    const checked = isSelected(n.message.id);

                                    const className = n.seen
                                        ? null
                                        : classes.unSeenNotificationBackground;

                                    return (
                                        <TableRow
                                            onClick={(event) =>
                                                handleRowClick(
                                                    event,
                                                    n.message.id,
                                                    index
                                                )
                                            }
                                            role="checkbox"
                                            aria-checked={checked}
                                            tabIndex={-1}
                                            selected={checked}
                                            hover
                                            key={n.message.id}
                                        >
                                            <TableCell
                                                className={className}
                                                padding="checkbox"
                                            >
                                                <DECheckbox
                                                    checked={checked}
                                                    onClick={(event) =>
                                                        handleCheckboxClick(
                                                            event,
                                                            n.message.id,
                                                            index
                                                        )
                                                    }
                                                />
                                            </TableCell>
                                            <TableCell className={className}>
                                                <Typography>
                                                    {notificationTypeToCategory(
                                                        n.type
                                                    )}
                                                </Typography>
                                            </TableCell>
                                            <TableCell className={className}>
                                                <Message
                                                    baseId={buildId(
                                                        baseId,
                                                        ids.MESSAGE,
                                                        n.id
                                                    )}
                                                    notification={n}
                                                />
                                            </TableCell>
                                            <TableCell className={className}>
                                                <Typography variant="body2">
                                                    {formatDate(
                                                        n.message.timestamp
                                                    )}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                        </TableBody>
                    )}
                    <EnhancedTableHead
                        selectable={true}
                        numSelected={selected.length}
                        order={order}
                        orderBy={orderBy}
                        onSelectAllClick={handleSelectAllClick}
                        onRequestSort={handleRequestSort}
                        columnData={columnData}
                        baseId={baseId}
                        rowsInPage={data?.length || 0}
                    />
                </Table>
            </TableContainer>
            <DEPagination
                baseId={baseId}
                totalPages={Math.ceil(total / rowsPerPage)}
                pageSize={rowsPerPage}
                page={page + 1}
                onChange={handleChangePage}
                onPageSizeChange={handleChangeRowsPerPage}
            />
        </>
    );
};

export default TableView;
