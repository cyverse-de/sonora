/**
 *
 * @author sriram
 * An accordion for displaying batch results
 *
 */
import React from "react";
import { useTranslation } from "i18n";
import Link from "next/link";

import { ANALYSES_SEARCH_QUERY_KEY } from "serviceFacades/analyses";
import constants from "../../../constants";
import ids from "../ids";

import { BATCH_DRILL_DOWN } from "pages/analyses/[analysisId]";
import NavigationConstants from "common/NavigationConstants";
import analysisFields from "components/analyses/analysisFields";
import ErrorTypographyWithDialog from "components/error/ErrorTypographyWithDialog";
import { useAnalysesSearchInfinite } from "components/search/searchQueries";
import BasicTable from "components/table/BasicTable";
import buildID from "components/utils/DebugIDUtil";
import DELink from "components/utils/DELink";

import {
    Accordion,
    AccordionActions,
    AccordionDetails,
    AccordionSummary,
    Button,
    Typography,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";

export default function BatchResults(props) {
    const { baseId, parentId, enabled } = props;
    const { t } = useTranslation("analyses");
    let analysisRecordFields = analysisFields(t);

    const {
        status,
        data,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
        error,
    } = useAnalysesSearchInfinite(
        [
            ANALYSES_SEARCH_QUERY_KEY,
            {
                rowsPerPage: constants.DEFAULT_PAGE_SIZE,
                orderBy: analysisRecordFields.START_DATE.key,
                order: constants.SORT_DESCENDING,
                filter: JSON.stringify([
                    { field: "parent_id", value: parentId },
                ]),
            },
        ],
        enabled,
        (lastGroup, allGroups) => {
            const totalPages = Math.ceil(
                lastGroup?.total / constants.DEFAULT_PAGE_SIZE
            );
            if (allGroups.length < totalPages) {
                return allGroups.length;
            } else {
                return false;
            }
        }
    );

    const columns = React.useMemo(
        () => [
            {
                Header: analysisRecordFields.NAME.fieldName,
                accessor: analysisRecordFields.NAME.key,
                Cell: ({ row }) => (
                    <Link
                        href={`/${NavigationConstants.ANALYSES}/${row?.original.id}?view=${BATCH_DRILL_DOWN}`}
                        legacyBehavior
                    >
                        <DELink
                            id={row?.original.id}
                            text={row?.original.name}
                            title={row?.original.name}
                        />
                    </Link>
                ),
            },
            {
                Header: analysisRecordFields.STATUS.fieldName,
                accessor: analysisRecordFields.STATUS.key,
            },
        ],
        [analysisRecordFields]
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
        flatData = data.pages.map((page) => page.analyses).flat();
    }

    return (
        <Accordion defaultExpanded={true}>
            <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls={buildID(baseId, ids.BATCH_PANEL)}
                id={buildID(baseId, ids.BATCH_PANEL_HEADER)}
            >
                <Typography variant="subtitle2" color="primary">
                    {t("htDetailsTitle")}
                </Typography>
            </AccordionSummary>
            <AccordionDetails>
                <BasicTable
                    baseId={baseId}
                    columns={columns}
                    data={flatData}
                    loading={isFetchingNextPage}
                    sortable
                />
            </AccordionDetails>
            <AccordionActions>
                <Button
                    variant="outlined"
                    color="primary"
                    style={{ flex: 1 }}
                    onClick={() => fetchNextPage()}
                    disabled={!hasNextPage || isFetchingNextPage}
                >
                    {t("loadMore")}
                </Button>
            </AccordionActions>
        </Accordion>
    );
}
