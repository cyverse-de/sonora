/**
 * @author sboleyn
 *
 * A tabular view of subscriptions
 *
 */
import React from "react";

import { useTranslation } from "i18n";

import TableLoading from "components/table/TableLoading";
import ids from "../ids";

import { DERow } from "components/table/DERow";
import DETableHead from "components/table/DETableHead";
import subscriptionFields from "../subscriptionsFields";

import buildID from "components/utils/DebugIDUtil";
import DECheckbox from "components/utils/DECheckbox";

import { formatDateObject } from "components/utils/DateFormatter";

import PageWrapper from "components/layout/PageWrapper";
import RowDotMenu from "./RowDotMenu";

import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    Typography,
} from "@material-ui/core";

function UserName(props) {
    const username = props.username;
    return <Typography>{username}</Typography>;
}

const columnData = (t) => {
    const fields = subscriptionFields(t);
    return [
        {
            name: "",
            numeric: false,
            enableSorting: false,
        },
        {
            id: ids.USERNAME,
            name: fields.USERNAME.fieldName,
            numeric: false,
            enableSorting: true,
            key: fields.USERNAME.key,
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
            id: ids.PLAN_NAME,
            name: fields.PLAN_NAME.fieldName,
            numeric: false,
            enableSorting: false,
            key: fields.PLAN_NAME.key,
        },
        {
            id: ids.ROW_DOT_MENU,
            name: "",
            enableSorting: false,
            key: fields.ROW_DOT_MENU.key,
            align: "right",
        },
    ];
};

function LoadingMask(props) {
    const { columns, tableId } = props;
    return (
        <TableLoading
            numColumns={columns.length + 1}
            numRows={25}
            baseId={tableId}
        />
    );
}

function TableView(props) {
    const {
        baseId,
        handleClick,
        handleRequestSort,
        isAdminView,
        listing,
        loading,
        onDetailsSelected,
        onEditQuotasSelected,
        onEditSubscriptionSelected,
        order,
        orderBy,
        selected,
    } = props;
    const { t } = useTranslation("subscriptions");
    let columns = columnData(t);

    const subscriptions = listing?.subscriptions;
    const tableId = buildID(baseId, ids.LISTING_TABLE);

    return (
        <PageWrapper appBarHeight={0}>
            {isAdminView && (
                <TableContainer component={Paper} style={{ overflow: "auto" }}>
                    <Table
                        id={tableId}
                        stickyHeader={true}
                        size="small"
                        aria-label={t("ariaTableListing")}
                    >
                        <DETableHead
                            baseId={baseId}
                            selectable={false}
                            columnData={columns}
                            onRequestSort={handleRequestSort}
                            order={order}
                            orderBy={orderBy}
                        />
                        {loading ? (
                            <LoadingMask columns={columns} tableId={tableId} />
                        ) : (
                            <TableBody>
                                {subscriptions &&
                                    subscriptions.length > 0 &&
                                    subscriptions.map((subscription, index) => {
                                        const subscriptionId = subscription.id;
                                        const rowId = buildID(
                                            baseId,
                                            tableId,
                                            subscriptionId
                                        );
                                        const user = subscription.user.username;
                                        const startDate =
                                            subscription.effective_start_date;
                                        const endDate =
                                            subscription.effective_end_date;
                                        const planName = subscription.plan.name;
                                        const isSelected =
                                            selected?.indexOf(
                                                subscriptionId
                                            ) !== -1;

                                        return (
                                            <DERow
                                                id={rowId}
                                                key={subscriptionId}
                                                role="checkbox"
                                                selected={isSelected}
                                                aria-checked={isSelected}
                                                hover
                                                onClick={(event) => {
                                                    if (handleClick) {
                                                        handleClick(
                                                            event,
                                                            subscriptionId
                                                        );
                                                    }
                                                }}
                                            >
                                                <TableCell padding="checkbox">
                                                    <DECheckbox />
                                                </TableCell>
                                                <TableCell
                                                    id={buildID(
                                                        rowId,
                                                        ids.USERNAME_CELL
                                                    )}
                                                >
                                                    <UserName username={user} />
                                                </TableCell>
                                                <TableCell
                                                    id={buildID(
                                                        rowId,
                                                        ids.START_DATE_CELL
                                                    )}
                                                >
                                                    <Typography variant="body2">
                                                        {formatDateObject(
                                                            startDate &&
                                                                new Date(
                                                                    startDate
                                                                )
                                                        )}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell
                                                    id={buildID(
                                                        rowId,
                                                        ids.END_DATE_CELL
                                                    )}
                                                >
                                                    <Typography variant="body2">
                                                        {formatDateObject(
                                                            endDate &&
                                                                new Date(
                                                                    endDate
                                                                )
                                                        )}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell
                                                    id={buildID(
                                                        rowId,
                                                        ids.PLAN_NAME_CELL
                                                    )}
                                                >
                                                    <Typography variant="body2">
                                                        {planName}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell
                                                    id={buildID(
                                                        rowId,
                                                        ids.ROW_DOT_MENU
                                                    )}
                                                    align="right"
                                                >
                                                    <RowDotMenu
                                                        baseId={baseId}
                                                        onDetailsSelected={
                                                            onDetailsSelected
                                                        }
                                                        onEditQuotasSelected={
                                                            onEditQuotasSelected
                                                        }
                                                        onEditSubscriptionSelected={
                                                            onEditSubscriptionSelected
                                                        }
                                                    />
                                                </TableCell>
                                            </DERow>
                                        );
                                    })}
                            </TableBody>
                        )}
                    </Table>
                </TableContainer>
            )}
        </PageWrapper>
    );
}

export default TableView;
