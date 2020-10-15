/**
 * A table view of paginated notification messages.
 *
 * @author Sriram, psarando
 *
 **/
import React from "react";

import classnames from "classnames";

import constants from "../../../constants";

import ids from "../ids";
import styles from "../styles";

import { useTranslation } from "i18n";

import notificationCategory from "components/models/notificationCategory";

import DEPagination from "components/utils/DEPagination";
import TableLoading from "components/utils/TableLoading";
import WrappedErrorHandler from "components/utils/error/WrappedErrorHandler";

import {
    DECheckbox,
    EnhancedTableHead,
    EmptyTable,
    formatDate,
} from "@cyverse-de/ui-lib";

import {
    makeStyles,
    Table,
    TableBody,
    TableCell,
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

function Message(props) {
    const { className, message, onMessageClicked } = props;

    return (
        <TableCell className={className}>
            <Typography onClick={(event) => onMessageClicked(message)}>
                {message.text}
            </Typography>
        </TableCell>
    );
}

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
        onMessageClicked,
        setOffset,
        setOrder,
        setOrderBy,
        setRowsPerPage,
        setSelected,
    } = props;

    const [page, setPage] = React.useState(0);

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

    const handleRowClick = (event, id) => {
        setSelected(
            selected.includes(id)
                ? selected.filter((selection) => id !== selection)
                : [...selected, id]
        );
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
                            data.map((n) => {
                                const isSelected = selected.includes(
                                    n.message.id
                                );

                                const className = n.seen
                                    ? null
                                    : classes.unSeenNotificationBackground;

                                return (
                                    <TableRow
                                        onClick={(event) =>
                                            handleRowClick(event, n.message.id)
                                        }
                                        role="checkbox"
                                        aria-checked={isSelected}
                                        tabIndex={-1}
                                        selected={isSelected}
                                        hover
                                        key={n.message.id}
                                    >
                                        <TableCell
                                            className={className}
                                            padding="checkbox"
                                        >
                                            <DECheckbox checked={isSelected} />
                                        </TableCell>
                                        <TableCell className={className}>
                                            {
                                                notificationCategory[
                                                    n.type
                                                        .replace(/\s/g, "_")
                                                        .toLowerCase()
                                                ]
                                            }
                                        </TableCell>
                                        <Message
                                            className={classnames(
                                                classes.notification,
                                                className
                                            )}
                                            message={n.message}
                                            onMessageClicked={onMessageClicked}
                                        />
                                        <TableCell className={className}>
                                            {formatDate(n.message.timestamp)}
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
