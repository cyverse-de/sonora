/**
 *
 * Display tablular view of detailed analyses search results
 *
 * @author sriram
 *
 */

import React, { useEffect, useState } from "react";

import { useTranslation } from "i18n";

import { useAnalysesSearchInfinite } from "../searchQueries";
import SearchError from "./SearchError";
import SearchResultsTable from "./SearchResultsTable";
import { getAnalysesSearchQueryFilter } from "../analysesSearchQueryBuilder";
import searchConstants from "../constants";
import constants from "../../../constants";

import { formatDate } from "@cyverse-de/ui-lib";

import { ANALYSES_SEARCH_QUERY_KEY } from "serviceFacades/analyses";
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
    } = useAnalysesSearchInfinite(
        analysesSearchKey,
        analysesSearchQueryEnabled,
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

    useEffect(() => {
        if (data && data.length > 0) {
            updateResultCount(data[0].total);
        }
    }, [data, updateResultCount]);

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

    if (error) {
        return <SearchError error={error} baseId={baseId} />;
    }
    if (
        status !== constants.LOADING &&
        (!data || data.length === 0 || data[0]?.analyses.length === 0)
    ) {
        return <Typography>{t("noResults")}</Typography>;
    }

    let flatdata = [];
    if (data && data.length > 0) {
        data.forEach((page) => {
            flatdata = [...flatdata, ...page.analyses];
        });
    }

    return (
        <SearchResultsTable
            columns={columns}
            data={flatdata}
            baseId={baseId}
            loading={status === constants.LOADING}
            fetchMore={fetchMore}
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
