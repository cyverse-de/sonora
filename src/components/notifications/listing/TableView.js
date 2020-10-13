/**
 * A table view of paginated notification messages.
 *
 * @author Sriram, psarando
 *
 **/
import React from "react";

import classnames from "classnames";

import ids from "../ids";
import styles from "../styles";

import { useTranslation } from "i18n";

import notificationCategory from "components/models/notificationCategory";

import TableLoading from "components/utils/TableLoading";

import {
    DECheckbox,
    EnhancedTableHead,
    formatDate,
    TablePaginationActions,
} from "@cyverse-de/ui-lib";

import {
    makeStyles,
    Table,
    TableBody,
    TableCell,
    TablePagination,
    TableRow,
    Typography,
} from "@material-ui/core";

const useStyles = makeStyles(styles);

const getColumns = (t) => [
    {
        id: ids.CATEGORY,
        key: ids.CATEGORY,
        name: t("category"),
        numeric: false,
        enableSorting: false,
    },
    {
        id: ids.MESSAGE,
        key: ids.MESSAGE,
        name: t("message"),
        numeric: false,
        enableSorting: false,
    },
    {
        id: ids.CREATED_DATE,
        key: ids.CREATED_DATE,
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
        loading,
        order,
        orderBy,
        rowsPerPage,
        selected,
        total,
        onMessageClicked,
        onSelectionChanged,
        setOffset,
        setOrder,
        setOrderBy,
        setRowsPerPage,
    } = props;

    const [page, setPage] = React.useState(0);

    const classes = useStyles();

    const { t } = useTranslation("notifications");
    const columnData = getColumns(t);

    const handleChangePage = (event, page) => {
        setPage(page);
        setOffset(rowsPerPage * page);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(event.target.value);
    };

    const handleRowClick = (event, id) => {
        onSelectionChanged(
            selected.includes(id)
                ? selected.filter((selection) => id !== selection)
                : [...selected, id]
        );
    };

    const handleSelectAllClick = (event, checked) => {
        onSelectionChanged(
            checked && !selected.length ? data.map((n) => n.message.id) : []
        );
    };

    const handleRequestSort = (event, property) => {
        let newOrder = "desc";

        if (orderBy === property && order === "desc") {
            newOrder = "asc";
        }

        setOrder(newOrder);
        setOrderBy(property);
    };

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
                        {data.map((n) => {
                            const isSelected = selected.includes(n.message.id);

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
                    rowsInPage={data.length}
                />
            </Table>
            <TablePagination
                colSpan={3}
                component="div"
                count={total}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
                rowsPerPageOptions={[25, 100, 500, 1000]}
            />
        </>
    );
};

export default TableView;
