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

function TableView(props) {
    const { baseId, error, intl, listing, loading } = props;
    const tableId = buildId(baseId, ids.LISTING_TABLE);

    const tools = listing?.tools;

    console.log(tools);

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
                    columnData={columnData(intl)}
                />
                {loading && (
                    <TableLoading
                        numColumns={columnData(intl).length}
                        numRows={25}
                        baseId={tableId}
                    />
                )}
                {!loading && (
                    <TableBody>
                        {(!tools || tools.length === 0) && !error && (
                            <EmptyTable
                                message={getMessage("noTools")}
                                numColumns={columnData(intl).length}
                            />
                        )}
                        {error && (
                            <EmptyTable
                                message={error.toString()}
                                numColumns={columnData(intl).length}
                            />
                        )}
                        {tools &&
                            tools.length > 0 &&
                            !error &&
                            tools.map((tool, index) => {
                                const id = tool.id;
                                const rowId = build(tableId, id);
                                console.log(`Tool ID: {id}`);
                                return (
                                    <TableRow
                                        tabIndex={-1}
                                        hover
                                        key={id}
                                        id={rowId}
                                    >
                                        <TableCell>{tool.name}</TableCell>
                                        <TableCell>
                                            {tool.container.image.name}
                                        </TableCell>
                                        <TableCell>
                                            {tool.container.image.tag}
                                        </TableCell>
                                        <TableCell>
                                            {tool.is_public
                                                ? getMessage("public")
                                                : tool.permission}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                )}
            </Table>
        </TableContainer>
    );
}

export default withI18N(injectIntl(TableView), messages);
