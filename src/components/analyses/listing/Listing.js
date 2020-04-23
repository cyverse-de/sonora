/**
 * @author sriram
 *
 * A component intended to be the parent to the analyses table view and thumbnail/tile view
 *
 */
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { injectIntl } from "react-intl";
import { useRouter } from "next/router";

import { withI18N } from "@cyverse-de/ui-lib";
import { getAnalyses } from "../../../serviceFacades/analyses";
import constants from "../../../constants";
import DEPagination from "../../utils/DEPagination";

import intlData from "../messages";
import TableView from "./TableView";
import { getOwnershipFilters } from "../AnalysesNavigation";
import { getAppTypeFilters } from "../../apps/AppNavigation";
import appType from "../../models/AppType";
import ownershipFilter from "../model/ownershipFilter";

import NavigationConstants from "../../../common/NavigationConstants";
import Header from "../Header";
import { useUserProfile } from "../../../contexts/userProfile";
import AnalysesNavigation from "../AnalysesNavigation";

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
    const { baseId } = props;
    const [isGridView, setGridView] = useState(false);
    const [order, setOrder] = useState("desc");
    const [orderBy, setOrderBy] = useState("startdate");
    const [selected, setSelected] = useState([]);
    const [lastSelectIndex, setLastSelectIndex] = useState(-1);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [data, setData] = useState(null);
    const [analysesKey, setAnalysesKey] = useState(null);
    const [parentAnalysis, setParentAnalyses] = useState(null);
    const [permFilter, setPermFilter] = useState(getOwnershipFilters()[0]);
    const [appTypeFilter, setAppTypeFilter] = useState(getAppTypeFilters()[0]);
    const [userProfile] = useUserProfile();

    const { isFetching, error } = useQuery({
        queryKey: analysesKey,
        queryFn: getAnalyses,
        config: {
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
                case ownershipFilter.all:
                    val = ALL;
                    break;
                case ownershipFilter.mine:
                    val = MINE;
                    break;
                case ownershipFilter.theirs:
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
            "getAnalyses",
            { rowsPerPage, orderBy, order, page, filter: filterString },
        ]);
    }, [
        order,
        orderBy,
        page,
        rowsPerPage,
        parentAnalysis,
        permFilter,
        appTypeFilter,
    ]);

    const toggleDisplay = () => {
        setGridView(!isGridView);
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
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
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
    };

    const handleClearBatch = () => {
        setParentAnalyses(null);
        setPermFilter(getOwnershipFilters()[0]);
        setAppTypeFilter(getAppTypeFilters()[0]);
    };

    return (
        <>
            <AnalysesNavigation
                baseId={baseId}
                handleAppTypeFilterChange={handleAppTypeFilterChange}
                handleOwnershipFilterChange={handleOwnershipFilterChange}
                appTypeFilter={appTypeFilter}
                ownershipFilter={permFilter}
                viewBatch={parentAnalysis}
                onClearBatch={handleClearBatch}
            />
            <Header
                baseId={baseId}
                isGridView={isGridView}
                toggleDisplay={toggleDisplay}
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
