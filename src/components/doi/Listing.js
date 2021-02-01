/**
 * @author sriram
 *
 * A component intended to list all the DOI requests in a table view.
 *
 */
import React, { useState } from "react";
import { useQuery } from "react-query";

import DEPagination from "components/utils/DEPagination";
import globalConstants from "../../constants";
import { adminGetDOIRequests, DOI_LISTING_QUERY_KEY } from "serviceFacades/doi";
import TableView from "./TableView";

export default function Listing(props) {
    const {
        baseId,
        order,
        orderBy,
        page,
        rowsPerPage,
        onRouteToListing,
    } = props;
    const [data, setData] = useState(null);
    const [selected, setSelected] = useState([]);
    const [lastSelectIndex, setLastSelectIndex] = useState(-1);
    const { isFetching, error } = useQuery({
        queryKey: [
            DOI_LISTING_QUERY_KEY,
            { order, orderBy, page, rowsPerPage },
        ],
        queryFn: adminGetDOIRequests,
        config: {
            enabled: true,
            onSuccess: setData,
        },
    });

    const handleRequestSort = (event, property) => {
        const isAsc =
            orderBy === property && order === globalConstants.SORT_ASCENDING;
        onRouteToListing &&
            onRouteToListing(
                isAsc
                    ? globalConstants.SORT_DESCENDING
                    : globalConstants.SORT_ASCENDING,
                property,
                page,
                rowsPerPage
            );
    };

    const deselect = (analysisId) => {
        const newSelected = selected.filter(
            (selectedID) => !analysisId.includes(selectedID)
        );

        setSelected(newSelected);
    };

    const select = (analysesIds) => {
        let newSelected = [...new Set([...selected, ...analysesIds])];
        setSelected(newSelected);
    };

    const rangeSelect = (start, end, targetId) => {
        // when a user first click on a row with shift key pressed,
        // start is -1 (which is lastSelectIndex) and
        // results in an error (data.analyses[-1].id)
        if (start > -1) {
            const rangeIds = [];
            for (let i = start; i <= end; i++) {
                rangeIds.push(data?.analyses[i].id);
            }
            let isTargetSelected = selected.includes(targetId);
            isTargetSelected ? deselect(rangeIds) : select(rangeIds);
        }
    };

    const handleClick = (event, id, index) => {
        if (event.shiftKey) {
            lastSelectIndex > index
                ? rangeSelect(index, lastSelectIndex, id)
                : rangeSelect(lastSelectIndex, index, id);
        } else {
            setSelected([id]);
        }

        setLastSelectIndex(index);
    };

    const handleChangePage = (event, newPage) => {
        onRouteToListing &&
            onRouteToListing(order, orderBy, newPage - 1, rowsPerPage);
    };

    const handleChangeRowsPerPage = (newPageSize) => {
        onRouteToListing &&
            onRouteToListing(order, orderBy, 0, parseInt(newPageSize, 10));
    };

    return (
        <>
            <TableView
                baseId={baseId}
                listing={data}
                error={error}
                loading={isFetching}
                order={order}
                orderBy={orderBy}
                handleRequestSort={handleRequestSort}
                handleClick={handleClick}
                selected={selected}
            />
            {data && data?.requests?.length > 0 && (
                <DEPagination
                    page={page + 1}
                    onChange={handleChangePage}
                    totalPages={Math.ceil(data?.requests?.length / rowsPerPage)}
                    onPageSizeChange={handleChangeRowsPerPage}
                    pageSize={rowsPerPage}
                    baseId={baseId}
                />
            )}
        </>
    );
}
