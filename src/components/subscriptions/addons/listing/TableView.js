/**
 * @author sboleyn
 *
 * A tabular view of subscriptions add-ons
 *
 */

import React from "react";

import { useTranslation } from "i18n";
import ids from "../../ids";
import RowDotMenu from "./RowDotMenu";

import TableLoading from "components/table/TableLoading";
import { formatFileSize } from "components/data/utils";
import { DERow } from "components/table/DERow";
import DETableHead from "components/table/DETableHead";
import buildID from "components/utils/DebugIDUtil";
import DECheckbox from "components/utils/DECheckbox";
import PageWrapper from "components/layout/PageWrapper";
import WrappedErrorHandler from "components/error/WrappedErrorHandler";
import EmptyTable from "components/table/EmptyTable";

import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    Typography,
} from "@mui/material";

import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles()(() => ({
    container: {
        overflow: "auto",
    },
    // Prevent row text from being highlighted when in a multiselection
    row: {
        userSelect: "none",
    },
}));

const columnData = (t) => {
    return [
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
            id: ids.ADDONS.RESOURCE_TYPE,
            name: t("resourceType"),
            numeric: false,
            enableSorting: false,
            key: "resourceType",
        },
        {
            id: ids.ADDONS.DEFAULT_PAID,
            name: t("defaultPaid"),
            numeric: false,
            enableSorting: false,
            key: "defaultPaid",
        },
        {
            id: ids.ROW_DOT_MENU,
            name: "",
            enableSorting: false,
            key: "dotMenu",
            align: "right",
        },
    ];
};

function AddOnListing(props) {
    const {
        addons,
        baseId,
        handleCheckboxClick,
        handleClick,
        onDeleteSelected,
        onEditSelected,
        selected,
        t,
        tableId,
    } = props;

    const { classes } = useStyles();

    return (
        addons &&
        addons.length > 0 &&
        addons.map((addon, index) => {
            const addonUUID = addon.uuid;
            const rowId = buildID(baseId, tableId, addonUUID);
            const isSelected = selected.includes(addonUUID);
            const resourceInBytes =
                addon.resource_type.unit.toLowerCase() === "bytes";

            return (
                <DERow
                    hover
                    id={rowId}
                    key={addonUUID}
                    role="checkbox"
                    selected={isSelected}
                    tabIndex={-1}
                    aria-checked={isSelected}
                    className={classes.row}
                    onClick={(event) => {
                        if (handleClick) {
                            handleClick(event, addonUUID, index);
                        }
                    }}
                >
                    <TableCell padding="checkbox">
                        <DECheckbox
                            checked={isSelected}
                            tabIndex={0}
                            onChange={(event) =>
                                handleCheckboxClick(event, addonUUID, index)
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
                        id={buildID(rowId, ids.ADDONS.RESOURCE_TYPE_CELL)}
                    >
                        <Typography variant="body2">
                            {addon.resource_type.unit}
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
                        id={buildID(rowId, ids.ROW_DOT_MENU)}
                        align="right"
                    >
                        <RowDotMenu
                            baseId={baseId}
                            onEditSelected={onEditSelected}
                            onDeleteSelected={onDeleteSelected}
                        />
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

function NoAvailableAddons(props) {
    const { columns, t } = props;
    return (
        <EmptyTable message={t("noAddons")} numColumns={columns.length + 1} />
    );
}

function TableView(props) {
    const {
        baseId,
        error,
        handleCheckboxClick,
        handleClick,
        handleSelectAllClick,
        isAdminView,
        listing,
        loading,
        onDeleteSelected,
        onEditSelected,
        selected,
    } = props;
    const { t } = useTranslation("subscriptions");

    const tableId = buildID(baseId, ids.ADDONS.LISTING_TABLE);
    const addons = listing?.addons;
    const columns = columnData(t);
    const { classes } = useStyles();
    if (error) {
        return <WrappedErrorHandler errorObject={error} baseId={baseId} />;
    }

    return (
        <PageWrapper>
            {isAdminView && (
                <TableContainer component={Paper} className={classes.container}>
                    <Table
                        stickyHeader={true}
                        size="small"
                        aria-label={t("ariaAddonsTableListing")}
                        id={tableId}
                    >
                        <DETableHead
                            selectable={true}
                            baseId={baseId}
                            columnData={columns}
                            numSelected={selected?.length}
                            onSelectAllClick={handleSelectAllClick}
                            rowsInPage={!!addons ? listing.addons.length : 0}
                        />

                        {loading ? (
                            <LoadingMask columns={columns} tableId={tableId} />
                        ) : (
                            <TableBody>
                                {addons?.length ? (
                                    <AddOnListing
                                        addons={addons}
                                        baseId={baseId}
                                        handleCheckboxClick={
                                            handleCheckboxClick
                                        }
                                        handleClick={handleClick}
                                        onDeleteSelected={onDeleteSelected}
                                        onEditSelected={onEditSelected}
                                        selected={selected}
                                        t={t}
                                        tableId={tableId}
                                    />
                                ) : (
                                    <NoAvailableAddons
                                        columns={columns}
                                        t={t}
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
