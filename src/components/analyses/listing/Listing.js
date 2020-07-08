/**
 * @author sriram
 *
 * A component intended to be the parent to the analyses table view and thumbnail/tile view
 *
 */
import React, { useCallback, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { injectIntl } from "react-intl";
import { useRouter } from "next/router";

import { formatMessage, withI18N } from "@cyverse-de/ui-lib";
import {
    getAnalyses,
    ANALYSES_LISTING_QUERY_KEY,
} from "../../../serviceFacades/analyses";
import constants from "../../../constants";
import DEPagination from "../../utils/DEPagination";
import Drawer from "../details/Drawer";

import intlData from "../messages";
import TableView from "./TableView";
import AnalysesToolbar, { getOwnershipFilters } from "../toolbar/Toolbar";
import { getAppTypeFilters } from "../../apps/toolbar/AppNavigation";
import appType from "../../models/AppType";

import NavigationConstants from "../../../common/NavigationConstants";
import { useUserProfile } from "../../../contexts/userProfile";
import { useNotifications } from "../../../contexts/pushNotifications";

/**
 * Filters
 *
 */
const ALL = "all";

const MINE = "mine";

const THEIRS = "theirs";

const PARENT_ID_FILTER = "parent_id";
const OWNERSHIP_FILTER = "ownership";
const TYPE_FILTER = "type";

const filter = {
    field: "",
    value: "",
};

function Listing(props) {
    const router = useRouter();
    const { baseId, intl } = props;
    const [isGridView, setGridView] = useState(false);
    const [order, setOrder] = useState("desc");
    const [orderBy, setOrderBy] = useState("startdate");
    const [selected, setSelected] = useState([]);
    const [lastSelectIndex, setLastSelectIndex] = useState(-1);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [data, setData] = useState(null);
    const [parentAnalysis, setParentAnalyses] = useState(null);
    const [permFilter, setPermFilter] = useState(getOwnershipFilters(intl)[0]);
    const [appTypeFilter, setAppTypeFilter] = useState(getAppTypeFilters()[0]);
    const [userProfile] = useUserProfile();
    const [currentNotification] = useNotifications();
    const [detailsAnalysis, setDetailsAnalysis] = useState(null);
    const [detailsEnabled, setDetailsEnabled] = useState(false);
    const [detailsOpen, setDetailsOpen] = useState(false);

    const [analysesKey, setAnalysesKey] = useState(ANALYSES_LISTING_QUERY_KEY);
    const [
        analysesListingQueryEnabled,
        setAnalysesListingQueryEnabled,
    ] = useState(false);

    const { isFetching, error } = useQuery({
        queryKey: analysesKey,
        queryFn: getAnalyses,
        config: {
            enabled: analysesListingQueryEnabled,
            onSuccess: setData,
        },
    });

    useEffect(() => {
        const filters = [];

        const idParentFilter = Object.create(filter);
        idParentFilter.field = PARENT_ID_FILTER;
        idParentFilter.value = parentAnalysis?.id || "";
        filters.push(idParentFilter);

        if (appTypeFilter && appTypeFilter.name !== appType.all) {
            const typeFilter = Object.create(filter);
            typeFilter.field = TYPE_FILTER;
            typeFilter.value = appTypeFilter.name;
            filters.push(typeFilter);
        }

        if (permFilter) {
            let val;
            switch (permFilter.name) {
                case formatMessage(intl, "all"):
                    val = ALL;
                    break;
                case formatMessage(intl, "mine"):
                    val = MINE;
                    break;
                case formatMessage(intl, "theirs"):
                    val = THEIRS;
                    break;
                default:
                    val = ALL;
            }
            const viewFilterObj = Object.create(filter);
            viewFilterObj.field = OWNERSHIP_FILTER;
            viewFilterObj.value = val;
            if (viewFilterObj.value) {
                idParentFilter.value = "";
            }
            filters.push(viewFilterObj);
        }
        const filterString = filters
            .map((filterItem) => JSON.stringify(filterItem))
            .join(",");

        setAnalysesKey([
            ANALYSES_LISTING_QUERY_KEY,
            { rowsPerPage, orderBy, order, page, filter: filterString },
        ]);
        setAnalysesListingQueryEnabled(true);
    }, [
        order,
        orderBy,
        page,
        rowsPerPage,
        parentAnalysis,
        permFilter,
        appTypeFilter,
        intl,
    ]);

    const updateAnalyses = useCallback(
        (notifiMessage) => {
            let pushMsg = null;
            try {
                pushMsg = JSON.parse(notifiMessage);
            } catch (e) {
                return;
            }

            const message = pushMsg?.message;
            if (message) {
                const category = message.type;
                if (
                    category?.toLowerCase() ===
                        constants.NOTIFICATION_CATEGORY.ANALYSIS.toLowerCase() &&
                    data
                ) {
                    const analysisStatus = message.payload.status;
                    const found = data.analyses?.find(
                        (analysis) => analysis.id === message.payload.id
                    );

                    if (found) {
                        if (analysisStatus !== found.status) {
                            found.status = analysisStatus;
                            found.enddate = message.payload.enddate;
                            setData({ analyses: [...data.analyses] });
                        }
                    } else {
                        //add a new analysis record and remove the last record from the page
                        //to maintain page size
                        if (data.analyses?.length === rowsPerPage) {
                            const newPage = data.analyses.slice(
                                0,
                                data.analyses.length - 1
                            );
                            setData({
                                analyses: [message.payload, ...newPage],
                            });
                        } else if (data.analyses?.length === 0) {
                            //if page is empty...
                            setData({ analyses: [message.payload] });
                        } else {
                            setData({
                                analyses: [message.payload, ...data.analyses],
                            });
                        }
                    }
                }
            }
        },
        [data, setData, rowsPerPage]
    );

    useEffect(() => {
        updateAnalyses(currentNotification);
    }, [currentNotification, updateAnalyses]);

    useEffect(() => {
        setDetailsEnabled(selected && selected.length === 1);
    }, [selected]);

    useEffect(() => {
        if (detailsOpen && data?.analyses) {
            const selectedId = selected[0];
            setDetailsAnalysis(
                data.analyses.find((item) => item.id === selectedId)
            );
        } else {
            setDetailsAnalysis(null);
        }
    }, [data, detailsOpen, selected]);

    const toggleDisplay = () => {
        setGridView(!isGridView);
    };

    const onDetailsSelected = () => {
        setDetailsOpen(true);
    };

    const select = (analysesIds) => {
        let newSelected = [...new Set([...selected, ...analysesIds])];
        setSelected(newSelected);
    };

    const deselect = (analysisId) => {
        const newSelected = selected.filter(
            (selectedID) => !analysisId.includes(selectedID)
        );

        setSelected(newSelected);
    };

    const toggleSelection = (analysisId) => {
        if (selected.includes(analysisId)) {
            deselect([analysisId]);
        } else {
            select([analysisId]);
        }
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
            toggleSelection(id);
        }

        setLastSelectIndex(index);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked && !selected.length) {
            const newSelecteds =
                data?.analyses?.map((analysis) => analysis.id) || [];
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage - 1);
        setSelected([]);
    };

    const handleChangeRowsPerPage = (newPageSize) => {
        setRowsPerPage(parseInt(newPageSize, 10));
        setSelected([]);
        setPage(0);
    };
    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
        setSelected([]);
        setPage(0);
    };
    const handleInteractiveUrlClick = (url) => {
        window.open(url, "_blank");
    };

    const handleGoToOutputFolder = (analysis) => {
        if (analysis.resultfolderid) {
            router.push(
                `${constants.PATH_SEPARATOR}${NavigationConstants.DATA}${constants.PATH_SEPARATOR}ds${analysis.resultfolderid}`
            );
        }
    };

    const handleAppTypeFilterChange = (appTypeFilter) => {
        setAppTypeFilter(appTypeFilter);
        setSelected([]);
        setPage(0);
    };

    const handleOwnershipFilterChange = (viewFilter) => {
        setPermFilter(viewFilter);
        setSelected([]);
        setPage(0);
    };

    const handleBatchIconClick = (analysis) => {
        setParentAnalyses(analysis);
        setPermFilter(null);
        setAppTypeFilter(null);
        setSelected([]);
    };

    const handleClearBatch = () => {
        setParentAnalyses(null);
        setPermFilter(getOwnershipFilters(intl)[0]);
        setAppTypeFilter(getAppTypeFilters()[0]);
    };

    const getSelectedAnalyses = (analyses) => {
        const items = analyses ? analyses : selected;
        return items.map((id) =>
            data?.analyses.find((analysis) => analysis.id === id)
        );
    };

    return (
        <>
            <AnalysesToolbar
                baseId={baseId}
                selected={selected}
                username={userProfile?.id}
                getSelectedAnalyses={getSelectedAnalyses}
                handleAppTypeFilterChange={handleAppTypeFilterChange}
                handleOwnershipFilterChange={handleOwnershipFilterChange}
                appTypeFilter={appTypeFilter}
                ownershipFilter={permFilter}
                viewBatch={parentAnalysis}
                onClearBatch={handleClearBatch}
                isGridView={isGridView}
                toggleDisplay={toggleDisplay}
                detailsEnabled={detailsEnabled}
                onDetailsSelected={onDetailsSelected}
                handleInteractiveUrlClick={handleInteractiveUrlClick}
                handleGoToOutputFolder={handleGoToOutputFolder}
                handleBatchIconClick={handleBatchIconClick}
            />
            <TableView
                loading={isFetching}
                error={error}
                listing={data}
                baseId={baseId}
                order={order}
                orderBy={orderBy}
                selected={selected}
                username={userProfile?.id}
                handleSelectAllClick={handleSelectAllClick}
                handleClick={handleClick}
                handleRequestSort={handleRequestSort}
                handleInteractiveUrlClick={handleInteractiveUrlClick}
                handleGoToOutputFolder={handleGoToOutputFolder}
                handleBatchIconClick={handleBatchIconClick}
            />
            {detailsOpen && (
                <Drawer
                    selectedAnalysis={detailsAnalysis}
                    open={detailsOpen}
                    baseId={baseId}
                    onClose={() => setDetailsOpen(false)}
                />
            )}
            {data && data.total > 0 && (
                <DEPagination
                    page={page + 1}
                    onChange={handleChangePage}
                    totalPages={Math.ceil(data.total / rowsPerPage)}
                    onPageSizeChange={handleChangeRowsPerPage}
                    pageSize={rowsPerPage}
                    baseId={baseId}
                />
            )}
        </>
    );
}
export default withI18N(injectIntl(Listing), intlData);
