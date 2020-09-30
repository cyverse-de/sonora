import React from "react";
import { Typography } from "@material-ui/core";

const LINE_NUMBER_ACCESSOR = "lineNumber";

/**
 *
 * Get columns array definition to use with react-table in PathListViewer and StructuredTextViewer
 *
 * @param {string} data - data to be displayed in react table.
 * @param {boolean} firstRowHeader - first row to be used as header or not
 * @param {string} pathLabel - optional label for path column for pathListViewers
 */
function getColumns(data, firstRowHeader, pathLabel) {
    let cols = [
        {
            Header: "#",
            accessor: LINE_NUMBER_ACCESSOR,
            disableSortBy: true,
            Cell: ({ row }) => {
                return (
                    <Typography color="primary">
                        {row.original[LINE_NUMBER_ACCESSOR]}
                    </Typography>
                );
            },
        },
    ];

    if (!data || data.length === 0) {
        return cols;
    }

    if (pathLabel) {
        cols.push({
            Header: pathLabel,
            accessor: Object.keys(data[0])[0],
            disableSortBy: true,
        });
        return cols;
    }

    let colHeaders = null;
    if (firstRowHeader) {
        colHeaders = data[0];
    }
    Object.keys(data[0]).forEach((colId) => {
        if (colId !== LINE_NUMBER_ACCESSOR) {
            if (colHeaders) {
                cols.push({
                    Header: colHeaders[colId],
                    accessor: colId,
                    disableSortBy: true,
                });
            } else {
                cols.push({
                    Header: colId,
                    accessor: colId,
                    disableSortBy: true,
                });
            }
        }
    });
    return cols;
}

function flattenStructureData(data) {
    let flatData = [];
    data.forEach((page) => {
        flatData = [...flatData, ...page.csv];
    });
    return flatData;
}
export { LINE_NUMBER_ACCESSOR, getColumns, flattenStructureData };
