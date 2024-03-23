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

import { useAnalysesSearchInfinite } from "../searchQueries";
import SearchResultsTable from "./SearchResultsTable";
import { getAnalysesSearchQueryFilter } from "../analysesSearchQueryBuilder";
import searchConstants from "../constants";
import constants from "../../../constants";

import { formatDate } from "components/utils/DateFormatter";

import ErrorTypographyWithDialog from "components/error/ErrorTypographyWithDialog";
import NavigationConstants from "common/NavigationConstants";
import { ANALYSES_SEARCH_QUERY_KEY } from "serviceFacades/analyses";
import analysisFields from "components/analyses/analysisFields";

import DELink from "components/utils/DELink";
import Drawer from "components/analyses/details/Drawer";
import Actions from "components/analyses/listing/Actions";
import { openInteractiveUrl } from "components/analyses/utils";
import { useUserProfile } from "contexts/userProfile";
import { trackIntercomEvent, IntercomEvents } from "common/intercom";

import { Typography } from "@mui/material";

function Name(props) {
    const { analysis, searchTerm } = props;
    const href = `/${NavigationConstants.ANALYSES}/[analysisId]`;
    const as = `/${NavigationConstants.ANALYSES}/${analysis?.id}`;
    return (
        <Link href={href} as={as} passHref legacyBehavior>
            <DELink text={analysis.name} searchTerm={searchTerm} />
        </Link>
    );
}

export default function AnalysesSearchResults(props) {
    const { searchTerm, updateResultCount, baseId } = props;
    const [userProfile] = useUserProfile();
    const [analysesSearchKey, setAnalysesSearchKey] = useState(
        ANALYSES_SEARCH_QUERY_KEY
    );
    const [analysesSearchQueryEnabled, setAnalysesSearchQueryEnabled] =
        useState(false);

    const { t } = useTranslation("search");
    const { t: analysisI18n } = useTranslation("analyses");

    let analysisRecordFields = analysisFields(analysisI18n);

    const [order, setOrder] = useState(constants.SORT_DESCENDING);
    const [orderBy, setOrderBy] = useState(analysisRecordFields.START_DATE.key);
    const [selectedAnalysis, setSelectedAnalysis] = useState();

    const {
        status,
        data,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
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
                    filter: getAnalysesSearchQueryFilter(
                        searchTerm,
                        analysisI18n
                    ),
                },
            ]);
            setAnalysesSearchQueryEnabled(true);
        } else {
            setAnalysesSearchQueryEnabled(false);
        }
    }, [
        setAnalysesSearchQueryEnabled,
        order,
        orderBy,
        searchTerm,
        analysisI18n,
    ]);

    useEffect(() => {
        trackIntercomEvent(IntercomEvents.SEARCHED_ANALYSES, {
            search: searchTerm,
            total: data?.pages.length ? data.pages[0].total : 0,
        });
        if (!searchTerm) {
            updateResultCount(0);
        } else if (data && data.pages.length > 0) {
            updateResultCount(data.pages[0].total);
        }
    }, [data, searchTerm, updateResultCount]);

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
        [analysisRecordFields, baseId, searchTerm, userProfile]
    );

    if (error) {
        return (
            <ErrorTypographyWithDialog
                errorMessage={t("errorSearch")}
                errorObject={error}
                baseId={baseId}
            />
        );
    }
    if (
        status !== constants.LOADING &&
        (!data ||
            data.pages.length === 0 ||
            data.pages[0].analyses.length === 0)
    ) {
        return <Typography>{t("noResults")}</Typography>;
    }

    let flatData = [];
    if (data && data.pages[0].analyses.length > 0) {
        data.pages.forEach((page) => {
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
                fetchMore={fetchNextPage}
                isFetchingMore={isFetchingNextPage}
                canFetchMore={hasNextPage}
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
                <Drawer
                    selectedAnalysis={selectedAnalysis}
                    baseId={baseId}
                    open={selectedAnalysis !== null}
                    onClose={() => setSelectedAnalysis(null)}
                />
            )}
        </>
    );
}
