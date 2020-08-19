/**
 *
 * Display tabular view of detailed analyses search results
 *
 * @author sriram
 *
 */

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslation } from "i18n";

import NameLink from "./NameLink";
import { useAnalysesSearchInfinite } from "../searchQueries";
import SearchError from "./SearchError";
import SearchResultsTable from "./SearchResultsTable";
import { getAnalysesSearchQueryFilter } from "../analysesSearchQueryBuilder";
import searchConstants from "../constants";
import constants from "../../../constants";

import { formatDate } from "@cyverse-de/ui-lib";

import NavigationConstants from "common/NavigationConstants";
import { ANALYSES_SEARCH_QUERY_KEY } from "serviceFacades/analyses";
import analysisFields from "components/analyses/analysisFields";
import { Typography } from "@material-ui/core";
import { Info } from "@material-ui/icons";
import Actions from "components/analyses/listing/Actions";
import { openInteractiveUrl } from "components/analyses/utils";
import { useUserProfile } from "contexts/userProfile";

function Name(props) {
    const { analysis, searchTerm } = props;
    const href = `/${NavigationConstants.ANALYSES}/[analysisId]`;
    const as = `/${NavigationConstants.ANALYSES}/${analysis?.id}`;
    return (
        <Link href={href} as={as} passHref>
            <NameLink name={analysis.name} searchTerm={searchTerm} />
        </Link>
    );
}

import DetailsDrawer from "components/analyses/details/Drawer";
import Actions from "components/analyses/listing/Actions";
import { openInteractiveUrl } from "components/analyses/utils";
import { useUserProfile } from "contexts/userProfile";

function Name(props) {
    const { analysis, searchTerm } = props;
    const href = `/${NavigationConstants.ANALYSES}/[analysisId]`;
    const as = `/${NavigationConstants.ANALYSES}/${analysis?.id}`;
    return (
        <Link href={href} as={as} passHref>
            <NameLink name={analysis.name} searchTerm={searchTerm} />
        </Link>
    );
}



export default function AnalysesSearchResults(props) {
    const { searchTerm, updateResultCount, baseId } = props;
    const [userProfile] = useUserProfile();
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
    const [selectedAnalysis, setSelectedAnalysis] = useState(null);
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
            const totalPages = Math.ceil(
                lastGroup?.total / searchConstants.DETAILED_SEARCH_PAGE_SIZE
            );
            if (allGroups.length < totalPages) {
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
    }, [setAnalysesSearchQueryEnabled, order, orderBy, searchTerm, t]);

    useEffect(() => {
        if (data && data.length > 0) {
            updateResultCount(data[0].total);
        }
    }, [data, updateResultCount]);

    let flatData = [];
    const memoFlatData = React.useMemo(() => flatData,[flatData]);

    const columns = React.useMemo(
        () => [
            {
                Header: analysisRecordFields.NAME.fieldName,
                accessor: analysisRecordFields.NAME.key,
                Cell: ({ row }) => (
                    <Name analysis={row?.original} searchTerm={searchTerm} />
                ),
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
            {
                Header: "",
                accessor: analysisRecordFields.ACTIONS.key,
                Cell: ({ row }) => (
                    <Actions
                        analysis={row.original}
                        username={userProfile?.id}
                        baseId={baseId}
                        allowBatchDrillDown={false}
                        handleInteractiveUrlClick={openInteractiveUrl}
                        handleDetailsClick={setSelectedAnalysis}
                    />
                ),
                disableSortBy: true,
            },
        ],
        [
            analysisRecordFields.ACTIONS.key,
            analysisRecordFields.NAME.fieldName,
            analysisRecordFields.NAME.key,
            analysisRecordFields.START_DATE.fieldName,
            analysisRecordFields.START_DATE.key,
            analysisRecordFields.STATUS.fieldName,
            analysisRecordFields.STATUS.key,
            baseId,
            searchTerm,
            userProfile,
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

    let flatData = [];
    if (data && data.length > 0) {
        data.forEach((page) => {
            flatData = [...flatData, ...page.analyses];
        });
    }

    

    return (
        <>
            <SearchResultsTable
                columns={columns}
                data={flatData}
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
            {selectedAnalysis && (
                <DetailsDrawer
                    selectedAnalysis={selectedAnalysis}
                    baseId={baseId}
                    open={selectedAnalysis !== null}
                    onClose={() => setSelectedAnalysis(null)}
                />
            )}
        </>
    );
}
