import React, { useEffect, useState } from "react";
import { useInfiniteQuery } from "react-query";

import { useTable } from "react-table";

import { build } from "@cyverse-de/ui-lib";

import ids from "./ids";
import constants from "../../constants";
import TableLoading from "../utils/TableLoading";
import {
    searhAppsInfiniteQuery,
    APPS_SEARCH_QUERY_KEY,
} from "serviceFacades/apps";
import AppFields from "../apps/AppFields";
import PageWrapper from "components/layout/PageWrapper";

import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import Paper from "@material-ui/core/Paper";

import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import { CircularProgress, Toolbar } from "@material-ui/core";

const EnhancedTable = ({
    baseId,
    columns,
    data,
    ref,
    fetchMore,
    canFetchMore,
    isFetchingMore,
}) => {
    const { getTableProps, headerGroups, rows, prepareRow } = useTable({
        columns,
        data,
    });
    const tableId = build(baseId, ids.TABLE_VIEW);
    return (
        <>
            <TableContainer
                component={Paper}
                style={{ overflow: "auto" }}
                id={tableId}
            >
                <Table size="small" stickyHeader {...getTableProps()}>
                    <TableHead>
                        {headerGroups.map((headerGroup) => (
                            <TableRow {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => (
                                    <TableCell {...column.getHeaderProps()}>
                                        {column.render("Header")}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableHead>
                    <TableBody>
                        {rows.map((row, index) => {
                            prepareRow(row);
                            return (
                                <TableRow {...row.getRowProps()}>
                                    {row.cells.map((cell) => {
                                        return (
                                            <TableCell {...cell.getCellProps()}>
                                                {cell.render("Cell")}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <Toolbar>
                <Button
                    variant="outlined"
                    color="primary"
                    style={{ flex: 1 }}
                    ref={ref}
                    onClick={() => fetchMore()}
                    disabled={!canFetchMore || isFetchingMore}
                >
                    Load More
                </Button>
            </Toolbar>
        </>
    );
};

export function AppSearchResults(props) {
    const { searchTerm, updateResultCount } = props;
    const [appsSearchKey, setAppsSearchKey] = useState(APPS_SEARCH_QUERY_KEY);
    const [appsSearchQueryEnabled, setAppsSearchQueryEnabled] = useState(false);

    const {
        status,
        data,
        isFetchingMore,
        fetchMore,
        canFetchMore,
    } = useInfiniteQuery(appsSearchKey, searhAppsInfiniteQuery, {
        enabled: appsSearchQueryEnabled,
        getFetchMore: (lastGroup, allGroups) => {
            console.log("lastGroup=>" + lastGroup?.total);
            const totalPage = Math.ceil(lastGroup?.total / 100);
            if (allGroups.length < totalPage) {
                return allGroups.length;
            } else {
                return false;
            }
        },
    });

    const loadMoreButtonRef = React.useRef();

    useEffect(() => {
        if (searchTerm && searchTerm.length > 2) {
            setAppsSearchKey([
                APPS_SEARCH_QUERY_KEY,
                {
                    rowsPerPage: 100,
                    orderBy: AppFields.NAME.key,
                    order: constants.SORT_ASCENDING,
                    search: searchTerm,
                },
            ]);
            setAppsSearchQueryEnabled(true);
        } else {
            setAppsSearchQueryEnabled(false);
        }
    }, [searchTerm]);

    const columns = React.useMemo(
        () => [
            {
                Header: "Name",
                accessor: AppFields.NAME.key,
            },
            {
                Header: "Integrator",
                accessor: AppFields.INTEGRATOR.key,
            },
            {
                Header: "System",
                accessor: AppFields.SYSTEM.key,
            },
        ],
        []
    );
    if (status === "loading") {
        return (
            <TableLoading
                numColumns={5}
                numRows={100}
                baseId="appSearchResults"
            />
        );
    }
    if (isFetchingMore) {
    }
    if (!data) {
        return <Typography> No apps. </Typography>;
    }
    let flatdata = [];
    data.forEach((page) => {
        flatdata = [...flatdata, ...page.apps];
    });

    if (status === "success") {
        updateResultCount(data[0].total);
    }

    return (
        <PageWrapper appBarHeight={150}>
            {isFetchingMore && (
                <CircularProgress
                    size={20}
                    color="primary"
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                    }}
                />
            )}
            <EnhancedTable
                columns={columns}
                data={flatdata}
                baseId="appSearchResults"
                fetchMore={fetchMore}
                ref={loadMoreButtonRef}
                isFetchingMore={isFetchingMore}
                canFetchMore={canFetchMore}
            />
        </PageWrapper>
    );
}
