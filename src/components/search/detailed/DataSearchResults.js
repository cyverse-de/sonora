/**
 *
 * Display tablular view of detailed data search results
 *
 * @author sriram
 *
 */

import React, { useEffect, useState } from "react";
import { queryCache } from "react-query";

import { useTranslation } from "i18n";

import SearchError from "./SearchError";
import SearchResultsTable from "./SearchResultsTable";
import { useDataSearchInfinite } from "../searchQueries";
import searchConstants from "../constants";
import TableLoading from "../../utils/TableLoading";
import {
    DATA_SEARCH_QUERY_KEY,
} from "serviceFacades/filesystem";
import { BOOTSTRAP_KEY } from "serviceFacades/users";

import ResourceIcon from "components/data/listing/ResourceIcon";
import { Typography } from "@material-ui/core";

export default function DataSearchResults(props) {
    const { searchTerm, updateResultCount, baseId } = props;
    const [dataSearchKey, setDataSearchKey] = useState(DATA_SEARCH_QUERY_KEY);
    const [sortField, setSortField] = useState("label");
    const [sortOrder, setSortOrder] = useState("ascending");
    const [dataSearchQueryEnabled, setDataSearchQueryEnabled] = useState(false);

    const { t } = useTranslation(["search"]);

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
    } = useDataSearchInfinite(
        dataSearchKey,
        dataSearchQueryEnabled,
        (lastGroup, allGroups) => {
            const totalPage = Math.ceil(
                lastGroup?.total / searchConstants.DETAILED_SEARCH_PAGE_SIZE
            );
            if (allGroups.length < totalPage) {
                return allGroups.length;
            } else {
                return false;
            }
        }
    );

    useEffect(() => {
        if (searchTerm && searchTerm.length > 2) {
            setDataSearchKey([
                DATA_SEARCH_QUERY_KEY,
                {
                    searchTerm,
                    userHomeDir,
                    rowsPerPage: searchConstants.DETAILED_SEARCH_PAGE_SIZE,
                    sortField: sortField,
                    sortDir: sortOrder,
                },
            ]);
            setDataSearchQueryEnabled(true);
        }
    }, [searchTerm, sortField, sortOrder, userHomeDir]);

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
                disableSortBy: true,
            },
            {
                Header: "Name",
                accessor: "_source.label",
            },
            {
                Header: "Path",
                accessor: "_source.path",
                disableSortBy: true,
            },
        ],
        []
    );

    if (status === "loading") {
        return <TableLoading numColumns={5} numRows={100} baseId={baseId} />;
    }
    if (error) {
        return <SearchError error={error} baseId={baseId} />;
    }
    if (!data || data.length === 0 || data[0]?.hits.length === 0) {
        return <Typography>{t("noResults")}</Typography>;
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
            baseId={baseId}
            fetchMore={fetchMore}
            ref={loadMoreButtonRef}
            isFetchingMore={isFetchingMore}
            canFetchMore={canFetchMore}
            initialSortBy={[
                {
                    id: "_source." + sortField,
                    desc: sortOrder === "descending",
                },
            ]}
            onSort={(colId, descending) => {
                setSortField(colId.split(".")[1]);
                descending
                    ? setSortOrder("descending")
                    : setSortOrder("ascending");
            }}
        />
    );
}
