/**
 *
 * Display tablular view of detailed data search results
 *
 * @author sriram
 *
 */

import React, { useEffect, useState } from "react";
import { useInfiniteQuery, queryCache } from "react-query";

import SearchResultsTable from "./SearchResultsTable";

import TableLoading from "../utils/TableLoading";
import {
    searchDataInfinite,
    DATA_SEARCH_QUERY_KEY,
} from "serviceFacades/filesystem";
import { BOOTSTRAP_KEY } from "serviceFacades/users";

import ResourceIcon from "components/data/listing/ResourceIcon";
import { Typography } from "@material-ui/core";

export default function DataSearchResults(props) {
    const { searchTerm, updateResultCount } = props;
    const [dataSearchKey, setDataSearchKey] = useState(DATA_SEARCH_QUERY_KEY);
    const [dataSearchQueryEnabled, setDataSearchQueryEnabled] = useState(false);

    const bootstrapCache = queryCache.getQueryData(BOOTSTRAP_KEY);
    let userHomeDir = bootstrapCache?.data_info.user_home_path;
    if (userHomeDir) {
        userHomeDir = userHomeDir + "/";
    }

    const {
        status,
        data,
        isFetchingMore,
        fetchMore,
        canFetchMore,
        error,
    } = useInfiniteQuery(dataSearchKey, searchDataInfinite, {
        enabled: dataSearchQueryEnabled,
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

    useEffect(() => {
        if (searchTerm && searchTerm.length > 2) {
            setDataSearchKey([
                DATA_SEARCH_QUERY_KEY,
                {
                    searchTerm,
                    userHomeDir,
                    rowsPerPage: 100,
                    sortField: "label",
                    sortDir: "ascending",
                },
            ]);
            setDataSearchQueryEnabled(true);
        }
    }, [searchTerm, userHomeDir]);

    const loadMoreButtonRef = React.useRef();

    const columns = React.useMemo(
        () => [
            {
                Header: "",
                accessor: "icon",
                Cell: ({ row }) => {
                    const original = row?.original;
                    return <ResourceIcon type={original._type} />;
                },
            },
            {
                Header: "Name",
                accessor: "_source.label",
            },
            {
                Header: "Path",
                accessor: "_source.path",
            },
        ],
        []
    );

    if (status === "loading") {
        return (
            <TableLoading
                numColumns={5}
                numRows={100}
                baseId="dataSearchResults"
            />
        );
    }
    if (error) {
        return <Typography> Unable to search </Typography>;
    }

    if (!data || data.length === 0) {
        return <Typography> No Data. </Typography>;
    }

    let flatdata = [];
    data.forEach((page) => {
        flatdata = [...flatdata, ...page.hits];
    });

    if (status === "success") {
        updateResultCount(data[0].total);
    }

    return (
        <SearchResultsTable
            columns={columns}
            data={flatdata}
            baseId="dataSearchResults"
            fetchMore={fetchMore}
            ref={loadMoreButtonRef}
            isFetchingMore={isFetchingMore}
            canFetchMore={canFetchMore}
        />
    );
}
