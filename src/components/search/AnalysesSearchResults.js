/**
 *
 * Display tablular view of detailed analyses search results
 *
 * @author sriram
 *
 */

import React, { useEffect, useState } from "react";
import { useInfiniteQuery } from "react-query";

import SearchResultsTable from "./SearchResultsTable";
import { getAnalysesSearchQueryFilter } from "./analysesSearchQueryBuilder";
import constants from "../../constants";
import TableLoading from "../utils/TableLoading";
import {
    searchAnalysesInfinite,
    ANALYSES_SEARCH_QUERY_KEY,
} from "serviceFacades/analyses";
import analysisFields from "../analyses/analysisFields";

import { Typography } from "@material-ui/core";
import { useTranslation } from "i18n";

export default function AnalysesSearchResults(props) {
    const { searchTerm, updateResultCount } = props;
    const [analysesSearchKey, setAnalysesSearchKey] = useState(
        ANALYSES_SEARCH_QUERY_KEY
    );
    const [
        analysesSearchQueryEnabled,
        setAnalysesSearchQueryEnabled,
    ] = useState(false);
    const { t } = useTranslation(["analyses"]);
    //TODO: pass `t` into this function
    const analysisRecordFields = analysisFields(t);
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
            setAnalysesSearchKey([
                ANALYSES_SEARCH_QUERY_KEY,
                {
                    rowsPerPage: 100,
                    orderBy: analysisRecordFields.NAME.key,
                    order: constants.SORT_ASCENDING,
                    filter: getAnalysesSearchQueryFilter(searchTerm, t),
                },
            ]);
            setAnalysesSearchQueryEnabled(true);
        } else {
            setAnalysesSearchQueryEnabled(false);
        }
    }, [analysisRecordFields.NAME.key, searchTerm, t]);

    const columns = React.useMemo(
        () => [
            {
                Header: analysisRecordFields.NAME.fieldName,
                accessor: analysisRecordFields.NAME.key,
            },
            {
                Header: analysisRecordFields.STATUS.fieldName,
                accessor: analysisRecordFields.STATUS.key,
            },
        ],
        [
            analysisRecordFields.NAME.fieldName,
            analysisRecordFields.NAME.key,
            analysisRecordFields.STATUS.fieldName,
            analysisRecordFields.STATUS.key,
        ]
    );
    if (status === "loading") {
        return (
            <TableLoading
                numColumns={5}
                numRows={100}
                baseId="analysesSearchResults"
            />
        );
    }
    if (error) {
        return <Typography> Unable to search </Typography>;
    }
    if (!data) {
        return <Typography> No Analyses. </Typography>;
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
            baseId="analysesSearchResults"
            fetchMore={fetchMore}
            ref={loadMoreButtonRef}
            isFetchingMore={isFetchingMore}
            canFetchMore={canFetchMore}
        />
    );
}
