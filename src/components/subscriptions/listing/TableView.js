/**
 * @author sboleyn
 *
 * A tabular view of subscriptions
 *
 */
import React from "react";

import { useTranslation } from "i18n";

import ids from "../ids";
// Columns
// Username
// Subscription start date
// Subscription end date
// Plan name
// ---- DETAILS
// Quotas
// -- CPU Usage
// -- Data Storage
// Usages
// -- CPU Usage
// -- Data Storage

import { DERow } from "components/table/DERow";
import DETableHead from "components/table/DETableHead";
import subscriptionFields from "../subscriptionFields";

import buildID from "components/utils/DebugIDUtil";

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
            enableSorting: true,
            key: fields.PLAN_NAME.key,
        },
    ];
};

function TableView(props) {
    const { baseId, listing } = props;
    const { t } = useTranslation("subscriptions");
    let columns = columnData(t);

    const subscriptions = listing?.subscriptions;
    const tableId = buildID(baseId, ids.LISTING_TABLE);
    console.log(subscriptions);
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
                    selectable={false}
                    columnData={columns}
                    order="asc"
                />

                <TableBody>
                    {subscriptions &&
                        subscriptions.length > 0 &&
                        subscriptions.map((subscription, index) => {
                            const id = subscription.id;
                            const rowId = buildID(baseId, tableId, id);
                            const user = subscription["user"].username;
                            const startDate = subscription.effective_start_date;
                            const endDate = subscription.effective_end_date;
                            const planName = subscription["plan"].name;
                            return (
                                <DERow>
                                    <TableCell
                                        id={buildID(rowId + ids.USERNAME_CELL)}
                                    >
                                        <UserName username={user} />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">
                                            {startDate}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">
                                            {endDate}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
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
    );
}

export default TableView;
