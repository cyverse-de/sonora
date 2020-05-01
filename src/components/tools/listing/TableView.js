import ids from "../ids";
import React from "react";
import {
    build,
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

const columnData = (intl) => [
    {
        id: ids.NAME,
        name: formatMessage(intl, "name"),
        numeric: false,
        enableSorting: false,
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

// The loading mask to display when we're waiting for a response from the API.
function LoadingMask(props) {
    const { columns, tableId } = props;
    return (
        <TableLoading
            numColumns={columns.length}
            numRows={25}
            baseId={tableId}
        />
    );
}

// The table Contents to display when the API returns an error.
function LoadingError(props) {
    const { columns, error } = props;
    return (
        <EmptyTable message={error.toString()} numColumns={columns.length} />
    );
}

// The table contents to return when the API returns an empty result set.
function NoTools(props) {
    const { columns } = props;
    return (
        <EmptyTable
            message={getMessage("noTools")}
            numColumns={columns.length}
        />
    );
}

// The table contents to display when the API call returns succesfully.
function ToolListing(props) {
    const { tableId, tools } = props;
    return tools.map((tool, _) => {
        const id = tool.id;
        const rowId = build(tableId, id);
        return (
            <TableRow tabIndex={-1} hover key={id} id={rowId}>
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

// The tool listing table body.
function ToolListingTableBody(props) {
    const { columns, error, tableId, tools } = props;
    return (
        <TableBody>
            {error ? (
                <LoadingError columns={columns} error={error} />
            ) : !tools || tools.length === 0 ? (
                <NoTools columns={columns} />
            ) : (
                <ToolListing tableId={tableId} tools={tools} />
            )}
        </TableBody>
    );
}

// The tool listing table view.
function TableView(props) {
    const { baseId, error, intl, listing, loading } = props;
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
                    selectable={false}
                    columnData={columns}
                />
                {loading ? (
                    <LoadingMask columns={columns} tableId={tableId} />
                ) : (
                    <ToolListingTableBody
                        columns={columns}
                        error={error}
                        tableId={tableId}
                        tools={tools}
                    />
                )}
            </Table>
        </TableContainer>
    );
}

export default withI18N(injectIntl(TableView), messages);
