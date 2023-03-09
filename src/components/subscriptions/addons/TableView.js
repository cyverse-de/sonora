/**
 * @author sboleyn
 *
 * A tabular view of subscriptions add-ons
 *
 */

import React from "react";

import { useTranslation } from "i18n";
import ids from "../ids";

import TableLoading from "components/table/TableLoading";
import { formatFileSize } from "components/data/utils";
import { DERow } from "components/table/DERow";
import DETableHead from "components/table/DETableHead";
import buildID from "components/utils/DebugIDUtil";
import DECheckbox from "components/utils/DECheckbox";
import PageWrapper from "components/layout/PageWrapper";
import WrappedErrorHandler from "components/error/WrappedErrorHandler";

import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    Typography,
} from "@material-ui/core";

const columnData = (t) => {
    return [
        {
            name: "",
            numeric: false,
            enableSorting: false,
        },
        {
            id: ids.ADDONS.NAME,
            name: t("name"),
            numeric: false,
            enableSorting: false,
            key: "name",
        },
        {
            id: ids.ADDONS.DESCRIPTION,
            name: t("description"),
            numeric: false,
            enableSorting: false,
            key: "description",
        },
        {
            id: ids.ADDONS.DEFAULT_AMOUNT,
            name: t("defaultAmount"),
            numeric: false,
            enableSorting: false,
            key: "defaultAmount",
        },
        {
            id: ids.ADDONS.DEFAULT_PAID,
            name: t("defaultPaid"),
            numeric: false,
            enableSorting: false,
            key: "defaultPaid",
        },
        {
            id: ids.ADDONS.RESOURCE_TYPE,
            name: t("resourceType"),
            numeric: false,
            enableSorting: false,
            key: "resourceType",
        },
    ];
};

function AddOnListing(props) {
    const {
        addons,
        baseId,
        handleCheckboxClick,
        handleClick,
        selected,
        t,
        tableId,
    } = props;

    return (
        addons &&
        addons.length > 0 &&
        addons.map((addon) => {
            const addonUUID = addon.uuid;
            const rowId = buildID(baseId, tableId, addonUUID);
            const isSelected = selected?.indexOf(addonUUID) !== -1;
            const resourceInBytes =
                addon.resource_type.unit.toLowerCase() === "bytes";
            return (
                <DERow
                    hover
                    id={rowId}
                    key={addonUUID}
                    role="checkbox"
                    selected={isSelected}
                    aria-checked={isSelected}
                    onClick={(event) => {
                        if (handleClick) {
                            handleClick(event, addonUUID);
                        }
                    }}
                >
                    <TableCell padding="checkbox">
                        <DECheckbox
                            checked={isSelected}
                            onChange={(event) =>
                                handleCheckboxClick(event, addonUUID)
                            }
                        />
                    </TableCell>
                    <TableCell id={buildID(rowId, ids.ADDONS.NAME_CELL)}>
                        <Typography variant="body2">{addon.name}</Typography>
                    </TableCell>
                    <TableCell id={buildID(rowId, ids.ADDONS.DESCRIPTION_CELL)}>
                        <Typography variant="body2">
                            {addon.description}
                        </Typography>
                    </TableCell>
                    <TableCell
                        id={buildID(rowId, ids.ADDONS.DEFAULT_AMOUNT_CELL)}
                    >
                        <Typography variant="body2">
                            {resourceInBytes
                                ? formatFileSize(addon.default_amount)
                                : `${addon.default_amount}`}
                        </Typography>
                    </TableCell>
                    <TableCell
                        id={buildID(rowId, ids.ADDONS.DEFAULT_PAID_CELL)}
                    >
                        <Typography variant="body2">
                            {addon.default_paid ? t("true") : t("false")}
                        </Typography>
                    </TableCell>
                    <TableCell
                        id={buildID(rowId, ids.ADDONS.RESOURCE_TYPE_CELL)}
                    >
                        <Typography variant="body2">
                            {addon.resource_type.unit}
                        </Typography>
                    </TableCell>
                </DERow>
            );
        })
    );
}

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
        error,
        handleCheckboxClick,
        handleClick,
        isAdminView,
        listing,
        loading,
        selected,
    } = props;
    const { t } = useTranslation("subscriptions");

    const tableId = buildID(baseId, ids.ADDONS.LISTING_TABLE);
    const addons = listing?.addons;

    const columns = columnData(t);

    if (error) {
        return <WrappedErrorHandler errorObject={error} baseId={baseId} />;
    }

    return (
        <PageWrapper appbarheight={0}>
            {isAdminView && (
                <TableContainer component={Paper} style={{ overflow: "auto" }}>
                    <Table
                        stickyHeader={true}
                        size="small"
                        aria-label={t("ariaAddonsTableListing")}
                        id={tableId}
                    >
                        <DETableHead
                            baseId={baseId}
                            selectable={false}
                            columnData={columns}
                        />

                        {loading ? (
                            <LoadingMask columns={columns} tableId={tableId} />
                        ) : (
                            <TableBody>
                                {addons?.length && (
                                    <AddOnListing
                                        addons={addons}
                                        baseId={baseId}
                                        handleCheckboxClick={
                                            handleCheckboxClick
                                        }
                                        handleClick={handleClick}
                                        selected={selected}
                                        t={t}
                                        tableId={tableId}
                                    />
                                )}
                            </TableBody>
                        )}
                    </Table>
                </TableContainer>
            )}
        </PageWrapper>
    );
}

export default TableView;
