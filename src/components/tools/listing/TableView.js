import ids from "../ids";
import React from "react";

import { useTranslation } from "i18n";

import TableLoading from "../../utils/TableLoading";
import { DERow } from "components/utils/DERow";

import {
    build,
    DECheckbox,
    EmptyTable,
    EnhancedTableHead,
} from "@cyverse-de/ui-lib";
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    Typography,
} from "@material-ui/core";

const buildId = build;

/**
 * Returns localized column header information for the tool listing table.
 * @param {Object} t - the internationalization function
 */
const columnData = (t) => [
    {
        id: ids.NAME,
        name: t("name"),
        enableSorting: true,
        key: "name",
    },
    {
        id: ids.IMAGE_NAME,
        name: t("imageName"),
        enableSorting: false,
        key: "image-name",
    },
    {
        id: ids.TAG,
        name: t("tag"),
        enableSorting: false,
        key: "tag",
    },
    {
        id: ids.STATUS,
        name: t("status"),
        enableSorting: false,
        key: "status",
    },
];

/**
 * Returns the loading mask to display when we're waiting for a response from the API.
 * @param {Object} props - the component properties
 */
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

/**
 * Returns the table contents to display when the API returns an error.
 * @param {Object} props - the component properties
 */
function LoadingError(props) {
    const { columns, error } = props;
    return (
        <EmptyTable
            message={error.toString()}
            numColumns={columns.length + 1}
        />
    );
}

/**
 * Returns the table contents to return when the API returns an empty result set.
 * @param {Object} props - the component properties
 */
function NoTools(props) {
    const { columns, t } = props;
    return (
        <EmptyTable message={t("noTools")} numColumns={columns.length + 1} />
    );
}

/**
 * Returns the table contents to display when the API call returns successfully.
 * @param {Object} props - the component properties
 */
function ToolListing(props) {
    const { handleClick, t, selected, tableId, tools } = props;
    return tools.map((tool, index) => {
        const id = tool.id;
        const rowId = buildId(tableId, id);
        const handleRowClick = (event) => handleClick(event, id, index);
        const isSelected = selected.includes(id);
        return (
            <DERow
                aria-checked={isSelected}
                hover
                id={rowId}
                key={id}
                onClick={handleRowClick}
                role="checkbox"
                selected={isSelected}
                tabIndex={-1}
            >
                <TableCell padding="checkbox">
                    <DECheckbox
                        checked={isSelected}
                        id={buildId(rowId, ids.CHECKBOX)}
                        tabIndex={0}
                        inputProps={{
                            "aria-label": t("ariaCheckbox", {
                                label: tool.name,
                            }),
                        }}
                    />
                </TableCell>
                <TableCell>
                    <Typography>{tool.name}</Typography>
                </TableCell>
                <TableCell>
                    <Typography>{tool.container.image.name}</Typography>
                </TableCell>
                <TableCell>
                    <Typography>{tool.container.image.tag}</Typography>
                </TableCell>
                <TableCell>
                    <Typography>
                        {tool.is_public ? t("public") : tool.permission}
                    </Typography>
                </TableCell>
            </DERow>
        );
    });
}

/**
 * Returns the tool listing table body.
 * @param {Object} props - the component properties
 */
function ToolListingTableBody(props) {
    const { columns, error, handleClick, t, selected, tableId, tools } = props;
    return (
        <TableBody>
            {error ? (
                <LoadingError columns={columns} error={error} />
            ) : !tools?.length ? (
                <NoTools columns={columns} t={t} />
            ) : (
                <ToolListing
                    handleClick={handleClick}
                    t={t}
                    selected={selected}
                    tableId={tableId}
                    tools={tools}
                />
            )}
        </TableBody>
    );
}

/**
 * Returns the tool listing table view.
 * @param {Object} props - the component properties
 */
function TableView(props) {
    const {
        baseId,
        error,
        handleClick,
        handleRequestSort,
        handleSelectAllClick,
        listing,
        loading,
        order,
        orderBy,
        selected,
    } = props;
    const tableId = buildId(baseId, ids.LISTING_TABLE);
    const { t } = useTranslation("tools");

    const columns = columnData(t);

    const tools = listing?.tools;

    // Build and return the table.
    return (
        <TableContainer component={Paper} style={{ overflow: "auto" }}>
            <Table
                id={tableId}
                stickyHeader={true}
                size="small"
                aria-label={t("ariaTableListing")}
            >
                <EnhancedTableHead
                    baseId={baseId}
                    columnData={columns}
                    numSelected={selected.length}
                    onRequestSort={handleRequestSort}
                    onSelectAllClick={handleSelectAllClick}
                    order={order}
                    orderBy={orderBy}
                    rowsInPage={listing?.tools?.length || 0}
                    selectable={true}
                />
                {loading ? (
                    <LoadingMask columns={columns} tableId={tableId} />
                ) : (
                    <ToolListingTableBody
                        columns={columns}
                        error={error}
                        handleClick={handleClick}
                        t={t}
                        selected={selected}
                        tableId={tableId}
                        tools={tools}
                    />
                )}
            </Table>
        </TableContainer>
    );
}

export default TableView;
