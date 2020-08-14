/**
 *
 * Display tablular view of detailed analyses search results
 *
 * @author sriram
 *
 */

import React, { useEffect, useState } from "react";
import { useInfiniteQuery } from "react-query";

import { useTranslation } from "i18n";

import SearchError from "./SearchError";
import SearchResultsTable from "./SearchResultsTable";
import { getAnalysesSearchQueryFilter } from "../analysesSearchQueryBuilder";
import searchConstants from "../constants";
import constants from "../../../constants";

import { formatDate } from "@cyverse-de/ui-lib";

import {
    searchAnalysesInfinite,
    ANALYSES_SEARCH_QUERY_KEY,
} from "serviceFacades/analyses";
import TableLoading from "components/utils/TableLoading";
import analysisFields from "components/analyses/analysisFields";
import { Typography } from "@material-ui/core";

export default function AnalysesSearchResults(props) {
    const { searchTerm, updateResultCount, baseId } = props;
    const [analysesSearchKey, setAnalysesSearchKey] = useState(
        ANALYSES_SEARCH_QUERY_KEY
    );
    const [
        analysesSearchQueryEnabled,
        setAnalysesSearchQueryEnabled,
    ] = useState(false);
    // SS: array syntax did'nt work. Haven't figured out why
    const { t } = useTranslation("search");
    const { t: at } = useTranslation("analyses");
    let analysisRecordFields = analysisFields(at);

    const [order, setOrder] = useState(constants.SORT_DESCENDING);
    const [orderBy, setOrderBy] = useState(analysisRecordFields.START_DATE.key);

    const {
        status,
        data,
        isFetchingMore,
        fetchMore,
        canFetchMore,
        error,
    } = useInfiniteQuery(analysesSearchKey, searchAnalysesInfinite, {
        enabled: analysesSearchQueryEnabled,
        getFetchMore: (lastGroup, allGroups) => {
            const totalPage = Math.ceil(
                lastGroup?.total / searchConstants.DETAILED_SEARCH_PAGE_SIZE
            );
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
            setAnalysesSearchKey([
                ANALYSES_SEARCH_QUERY_KEY,
                {
                    rowsPerPage: searchConstants.DETAILED_SEARCH_PAGE_SIZE,
                    orderBy: orderBy,
                    order: order,
                    filter: getAnalysesSearchQueryFilter(searchTerm, t),
                },
            ]);
            setAnalysesSearchQueryEnabled(true);
        } else {
            setAnalysesSearchQueryEnabled(false);
        }
    }, [
        analysisRecordFields.NAME.key,
        analysisRecordFields.START_DATE.key,
        order,
        orderBy,
        searchTerm,
        t,
    ]);

    const columns = React.useMemo(
        () => [
            {
                Header: analysisRecordFields.NAME.fieldName,
                accessor: analysisRecordFields.NAME.key,
            },
            {
                Header: analysisRecordFields.START_DATE.fieldName,
                accessor: analysisRecordFields.START_DATE.key,
                Cell: ({ row }) => {
                    const sd =
                        row.original[analysisRecordFields.START_DATE.key];
                    return <Typography>{formatDate(sd)}</Typography>;
                },
            },
            {
                Header: analysisRecordFields.STATUS.fieldName,
                accessor: analysisRecordFields.STATUS.key,
            },
        ],
        [
            analysisRecordFields.NAME.fieldName,
            analysisRecordFields.NAME.key,
            analysisRecordFields.START_DATE.fieldName,
            analysisRecordFields.START_DATE.key,
            analysisRecordFields.STATUS.fieldName,
            analysisRecordFields.STATUS.key,
        ]
    );

    if (status === "loading") {
        return <TableLoading numColumns={5} numRows={100} baseId={baseId} />;
    }
    if (error) {
        return <SearchError error={error} baseId={baseId} />;
    }
    if (!data || data.length === 0 || data[0]?.analyses.length === 0) {
        return <Typography>{t("noResults")}</Typography>;
    }

    let flatdata = [];
    data.forEach((page) => {
        flatdata = [...flatdata, ...page.analyses];
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
                    id: analysisRecordFields.START_DATE.key,
                    desc: order === constants.SORT_DESCENDING,
                },
            ]}
            onSort={(colId, descending) => {
                setOrderBy(colId);
                descending
                    ? setOrder(constants.SORT_DESCENDING)
                    : setOrder(constants.SORT_ASCENDING);
            }}
        />
    );
}
