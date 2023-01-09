/**
 * @author sboleyn
 *
 * A tabular view of subscriptions
 *
 */
import React from "react";

import { useTranslation } from "i18n";

import ids from "../ids";

import { DERow } from "components/table/DERow";
import DETableHead from "components/table/DETableHead";
import subscriptionFields from "../subscriptionFields";

import buildID from "components/utils/DebugIDUtil";
import { formatDate } from "components/utils/DateFormatter";

import PageWrapper from "components/layout/PageWrapper";

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
    ];
};

function TableView(props) {
    const { baseId, handleRequestSort, isAdminView, listing, order, orderBy } =
        props;
    const { t } = useTranslation("subscriptions");
    let columns = columnData(t);

    const subscriptions = listing;
    const tableId = buildID(baseId, ids.LISTING_TABLE);
    // console.log(subscriptions?.length)
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
                        <TableBody>
                            {subscriptions &&
                                subscriptions.length > 0 &&
                                subscriptions.map((subscription, index) => {
                                    const id = subscription.id;
                                    const rowId = buildID(baseId, tableId, id);
                                    const user = subscription.user.username;
                                    const startDate =
                                        subscription.effective_start_date;
                                    const endDate =
                                        subscription.effective_end_date;
                                    const planName = subscription.plan.name;
                                    return (
                                        <DERow id={rowId} key={id} hover>
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
                                                    {formatDate(startDate)}
                                                </Typography>
                                            </TableCell>
                                            <TableCell
                                                id={buildID(
                                                    rowId,
                                                    ids.END_DATE_CELL
                                                )}
                                            >
                                                <Typography variant="body2">
                                                    {formatDate(endDate)}
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
                                        </DERow>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </PageWrapper>
    );
}

export default TableView;
