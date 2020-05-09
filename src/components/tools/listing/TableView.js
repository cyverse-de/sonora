import ids from "../ids";
import React from "react";
import {
    build,
    DECheckbox,
    EmptyTable,
    EnhancedTableHead,
    formatMessage,
    getMessage,
    withI18N,
} from "@cyverse-de/ui-lib";
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
} from "@material-ui/core";
import { injectIntl } from "react-intl";
import messages from "../Messages";
import TableLoading from "../../utils/TableLoading";

const buildId = build;

/**
 * Returns localized column header information for the tool listing table.
 * @param {Object} intl - the internationalization object
 */
const columnData = (intl) => [
    {
        id: ids.NAME,
        name: formatMessage(intl, "name"),
        numeric: false,
        enableSorting: true,
        key: "name",
    },
    {
        id: ids.IMAGE_NAME,
        name: formatMessage(intl, "imageName"),
        numeric: false,
        enableSorting: false,
        key: "image-name",
    },
    {
        id: ids.TAG,
        name: formatMessage(intl, "tag"),
        numeric: false,
        enableSorting: false,
        key: "tag",
    },
    {
        id: ids.STATUS,
        name: formatMessage(intl, "status"),
        numeric: false,
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
    const { columns } = props;
    return (
        <EmptyTable
            message={getMessage("noTools")}
            numColumns={columns.length + 1}
        />
    );
}

/**
 * Returns the table contents to display when the API call returns succesfully.
 * @param {Object} props - the component properties
 */
function ToolListing(props) {
    const { handleClick, intl, selected, tableId, tools } = props;
    return tools.map((tool, index) => {
        const id = tool.id;
        const rowId = buildId(tableId, id);
        const handleRowClick = (event) => handleClick(event, id, index);
        const isSelected = selected.includes(id);
        return (
            <TableRow
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
                            "aria-label": formatMessage(intl, "ariaCheckbox", {
                                label: tool.name,
                            }),
                        }}
                    />
                </TableCell>
                <TableCell>{tool.name}</TableCell>
                <TableCell>{tool.container.image.name}</TableCell>
                <TableCell>{tool.container.image.tag}</TableCell>
                <TableCell>
                    {tool.is_public ? getMessage("public") : tool.permission}
                </TableCell>
            </TableRow>
        );
    });
}

/**
 * Returns the tool listing table body.
 * @param {Object} props - the component properties
 */
function ToolListingTableBody(props) {
    const {
        columns,
        error,
        handleClick,
        intl,
        selected,
        tableId,
        tools,
    } = props;
    return (
        <TableBody>
            {error ? (
                <LoadingError columns={columns} error={error} />
            ) : !(tools?.length) ? (
                <NoTools columns={columns} />
            ) : (
                <ToolListing
                    handleClick={handleClick}
                    intl={intl}
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
        intl,
        listing,
        loading,
        order,
        orderBy,
        selected,
    } = props;
    const tableId = buildId(baseId, ids.LISTING_TABLE);

    const columns = columnData(intl);

    const tools = listing?.tools;

    console.log(tools);

    // Build and return the table.
    return (
        <TableContainer
            component={Paper}
            style={{
                height: "60vh",
            }}
        >
            <Table
                id={tableId}
                stickyHeader={true}
                size="small"
                aria-label={formatMessage(intl, "ariaTableListing")}
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
                        intl={intl}
                        selected={selected}
                        tableId={tableId}
                        tools={tools}
                    />
                )}
            </Table>
        </TableContainer>
    );
}

export default withI18N(injectIntl(TableView), messages);
