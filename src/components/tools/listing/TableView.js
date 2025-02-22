import ids from "../ids";
import React from "react";

import { useTranslation } from "i18n";

import TableLoading from "components/table/TableLoading";
import { DERow } from "components/table/DERow";
import WrappedErrorHandler from "components/error/WrappedErrorHandler";
import DETableHead from "components/table/DETableHead";
import PageWrapper from "components/layout/PageWrapper";

import buildID from "components/utils/DebugIDUtil";
import DECheckbox from "components/utils/DECheckbox";
import EmptyTable from "components/table/EmptyTable";
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Typography,
} from "@mui/material";

/**
 * Returns localized column header information for the tool listing table.
 * @param {Object} t - the internationalization function
 */
const columnData = (t, isAdmin) => {
    const cols = [
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
    ];
    if (isAdmin) {
        cols.push(
            {
                id: ids.EDIT_TOOL_DLG.DESCRIPTION,
                name: t("descriptionLabel"),
                enableSorting: false,
                key: "description",
            },
            {
                id: ids.EDIT_TOOL_DLG.LOCATION,
                name: t("location"),
                enableSorting: true,
                key: "location",
            },
            {
                id: ids.EDIT_TOOL_DLG.TYPE,
                name: t("type"),
                enableSorting: false,
                key: "type",
            },
            {
                id: ids.EDIT_TOOL_DLG.ATTRIBUTION,
                name: t("attribution"),
                enableSorting: true,
                key: "attribution",
            },
            {
                id: ids.EDIT_TOOL_DLG.VERSION,
                name: t("versionLbl"),
                enableSorting: true,
                key: "version",
            }
        );
    } else {
        cols.push({
            id: ids.STATUS,
            name: t("status"),
            enableSorting: false,
            key: "status",
        });
    }
    return cols;
};

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
    const { handleClick, t, multiSelect, selected, tableId, tools, isAdmin } =
        props;

    return tools.map((tool, index) => {
        const id = tool.id;
        const rowId = buildID(tableId, id);
        const handleRowClick = (event) => handleClick(event, id, index);
        const isSelected = selected.includes(id);

        // DERow styling will override selected-row highlight styling.
        const Row = isSelected ? TableRow : DERow;

        return (
            <Row
                aria-checked={isSelected}
                hover
                id={rowId}
                key={id}
                onClick={handleRowClick}
                role="checkbox"
                selected={isSelected}
                tabIndex={-1}
            >
                {multiSelect && (
                    <TableCell padding="checkbox">
                        <DECheckbox
                            checked={isSelected}
                            id={buildID(rowId, ids.CHECKBOX)}
                            tabIndex={0}
                            inputProps={{
                                "aria-label": t("ariaCheckbox", {
                                    label: tool.name,
                                }),
                            }}
                        />
                    </TableCell>
                )}
                <TableCell>
                    <Typography>{tool.name}</Typography>
                </TableCell>
                <TableCell>
                    <Typography>{tool.container.image.name}</Typography>
                </TableCell>
                <TableCell>
                    <Typography>{tool.container.image.tag}</Typography>
                </TableCell>
                {!isAdmin && (
                    <TableCell>
                        <Typography>
                            {tool.is_public ? t("public") : tool.permission}
                        </Typography>
                    </TableCell>
                )}
                {isAdmin && [
                    <TableCell key={tool.description}>
                        <Typography>{tool.description}</Typography>
                    </TableCell>,
                    <TableCell key={tool.location}>
                        <Typography>{tool.location}</Typography>
                    </TableCell>,
                    <TableCell key={tool.type}>
                        <Typography>{tool.type}</Typography>
                    </TableCell>,
                    <TableCell key={tool.attribution}>
                        <Typography>{tool.attribution}</Typography>
                    </TableCell>,
                    <TableCell key={tool.version}>
                        <Typography>{tool.version}</Typography>
                    </TableCell>,
                ]}
            </Row>
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
        handleClick,
        t,
        multiSelect,
        selected,
        tableId,
        tools,
        isAdmin,
    } = props;
    return (
        <TableBody>
            {!tools?.length ? (
                <NoTools columns={columns} t={t} />
            ) : (
                <ToolListing
                    handleClick={handleClick}
                    t={t}
                    multiSelect={multiSelect}
                    selected={selected}
                    tableId={tableId}
                    tools={tools}
                    isAdmin={isAdmin}
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
        multiSelect,
        selected,
        isAdmin,
    } = props;
    const tableId = buildID(baseId, ids.LISTING_TABLE);
    const { t } = useTranslation("tools");
    const columns = columnData(t, isAdmin);
    const tools = listing?.tools;

    if (error) {
        return <WrappedErrorHandler errorObject={error} baseId={tableId} />;
    }

    // Build and return the table.
    return (
        <PageWrapper appBarHeight={isAdmin ? 280 : 0}>
            <TableContainer component={Paper} style={{ overflow: "auto" }}>
                <Table
                    id={tableId}
                    stickyHeader={true}
                    size="small"
                    aria-label={t("ariaTableListing")}
                >
                    <DETableHead
                        baseId={baseId}
                        columnData={columns}
                        numSelected={selected.length}
                        onRequestSort={handleRequestSort}
                        onSelectAllClick={handleSelectAllClick}
                        order={order}
                        orderBy={orderBy}
                        rowsInPage={listing?.tools?.length || 0}
                        selectable={multiSelect}
                    />
                    {loading ? (
                        <LoadingMask columns={columns} tableId={tableId} />
                    ) : (
                        <ToolListingTableBody
                            columns={columns}
                            handleClick={handleClick}
                            t={t}
                            multiSelect={multiSelect}
                            selected={selected}
                            tableId={tableId}
                            tools={tools}
                            isAdmin={isAdmin}
                        />
                    )}
                </Table>
            </TableContainer>
        </PageWrapper>
    );
}

export default TableView;
