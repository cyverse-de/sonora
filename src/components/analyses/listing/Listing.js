/**
 * @author sriram
 *
 * A component intended to be the parent to the analyses table view and thumbnail/tile view
 *
 */
import React, { useCallback, useEffect, useState } from "react";

import { queryCache, useMutation, useQuery } from "react-query";

import { useTranslation } from "i18n";

import { AnnouncerConstants, announce, build } from "@cyverse-de/ui-lib";

import {
    ANALYSES_LISTING_QUERY_KEY,
    cancelAnalyses,
    deleteAnalyses,
    getAnalyses,
    relaunchAnalyses,
    renameAnalysis,
    updateAnalysisComment,
} from "serviceFacades/analyses";

import { useBagAddItems } from "serviceFacades/bags";

import { getAnalysisShareWithSupportRequest } from "serviceFacades/sharing";

import {
    analysisSupportRequest,
    submitAnalysisSupportRequest,
} from "serviceFacades/support";

import { canShare, openInteractiveUrl } from "../utils";

import constants from "../../../constants";
import ConfirmationDialog from "../../utils/ConfirmationDialog";
import DEPagination from "../../utils/DEPagination";
import withErrorAnnouncer from "../../utils/error/withErrorAnnouncer";
import Drawer from "../details/Drawer";

import ids from "../ids";
import RenameAnalysisDialog from "../RenameAnalysisDialog";
import AnalysisCommentDialog from "../AnalysisCommentDialog";
import ShareWithSupportDialog from "../ShareWithSupportDialog";

import TableView from "./TableView";

import AnalysesToolbar from "../toolbar/Toolbar";

import analysisStatus from "components/models/analysisStatus";
import appType from "components/models/AppType";

import { useConfig } from "contexts/config";
import { useUserProfile } from "contexts/userProfile";
import { useNotifications } from "contexts/pushNotifications";

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
const ID = "id";

const filter = {
    field: "",
    value: "",
};

function Listing(props) {
    const {
        baseId,
        onRouteToListing,
        handleSingleRelaunch,
        selectedIdFilter,
        selectedPage,
        selectedRowsPerPage,
        selectedOrder,
        selectedOrderBy,
        selectedPermFilter,
        selectedTypeFilter,
        showErrorAnnouncer,
    } = props;
    const { t } = useTranslation("analyses");
    const [isGridView, setGridView] = useState(false);

    const [order, setOrder] = useState(selectedOrder);
    const [orderBy, setOrderBy] = useState(selectedOrderBy);
    const [page, setPage] = useState(selectedPage);
    const [rowsPerPage, setRowsPerPage] = useState(selectedRowsPerPage);
    const [permFilter, setPermFilter] = useState(selectedPermFilter);
    const [appTypeFilter, setAppTypeFilter] = useState(selectedTypeFilter);
    const [idFilter, setIdFilter] = useState(selectedIdFilter);

    const [selected, setSelected] = useState([]);
    const [lastSelectIndex, setLastSelectIndex] = useState(-1);
    const [data, setData] = useState(null);
    const [parentAnalysis, setParentAnalyses] = useState(null);

    const [config] = useConfig();
    const [userProfile] = useUserProfile();
    const [currentNotification] = useNotifications();

    const [selectedAnalysis, setSelectedAnalysis] = useState(null);
    const [isSingleSelection, setSingleSelection] = useState(false);
    const [shareWithSupportAnalysis, setShareWithSupportAnalysis] = useState(
        null
    );

    const [detailsOpen, setDetailsOpen] = useState(false);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [relaunchDialogOpen, setRelaunchDialogOpen] = useState(false);
    const [renameDialogOpen, setRenameDialogOpen] = useState(false);
    const [commentDialogOpen, setCommentDialogOpen] = useState(false);

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

    const [deleteAnalysesMutation, { isLoading: deleteLoading }] = useMutation(
        deleteAnalyses,
        {
            onSuccess: () =>
                queryCache.invalidateQueries(ANALYSES_LISTING_QUERY_KEY),
            onError: (error) => {
                showErrorAnnouncer(t("analysesDeleteError"), error);
            },
        }
    );

    const [
        relaunchAnalysesMutation,
        { isLoading: relaunchLoading },
    ] = useMutation(relaunchAnalyses, {
        onSuccess: () =>
            queryCache.invalidateQueries(ANALYSES_LISTING_QUERY_KEY),
        onError: (error) => {
            showErrorAnnouncer(t("analysesRelaunchError"), error);
        },
    });

    const [
        renameAnalysisMutation,
        { isLoading: renameLoading, error: renameError },
    ] = useMutation(renameAnalysis, {
        onSuccess: (analysis) => {
            setRenameDialogOpen(false);

            const newPage = {
                ...data,
                analyses: data.analyses.map((a) =>
                    a.id === analysis.id ? { ...a, name: analysis.name } : a
                ),
            };

            setData(newPage);
            queryCache.setQueryData(analysesKey, newPage);
        },
    });

    const [
        analysisCommentMutation,
        { isLoading: commentLoading, error: commentError },
    ] = useMutation(updateAnalysisComment, {
        onSuccess: (analysis) => {
            setCommentDialogOpen(false);

            const newPage = {
                ...data,
                analyses: data.analyses.map((a) =>
                    a.id === analysis.id
                        ? { ...a, description: analysis.description }
                        : a
                ),
            };

            setData(newPage);
            queryCache.setQueryData(analysesKey, newPage);
        },
    });

    const [analysesCancelMutation, { isLoading: cancelLoading }] = useMutation(
        cancelAnalyses,
        {
            onSuccess: (analyses, { job_status }) => {
                announce({
                    text: t("analysisCancelSuccess", {
                        count: analyses?.length,
                        name: selectedAnalysis?.name,
                    }),
                    variant: AnnouncerConstants.SUCCESS,
                });
                const analysisIds = analyses?.map(({ id }) => id);

                const newPage = {
                    ...data,
                    analyses: data.analyses.map((a) =>
                        analysisIds?.includes(a.id)
                            ? {
                                  ...a,
                                  status: job_status || analysisStatus.CANCELED,
                              }
                            : a
                    ),
                };

                setData(newPage);
                queryCache.setQueryData(analysesKey, newPage);
            },
            onError: (error) => {
                showErrorAnnouncer(
                    t("analysisCancelError", { count: selected.length }),
                    error
                );
                if (selected.length > 1) {
                    // Some analyses may have been successfully canceled.
                    queryCache.invalidateQueries(ANALYSES_LISTING_QUERY_KEY);
                }
            },
        }
    );

    const [shareAnalysesMutation, { isLoading: shareLoading }] = useMutation(
        submitAnalysisSupportRequest,
        {
            onSuccess: (responses) => {
                const shareError =
                    responses?.length > 1 &&
                    responses[0].sharing.find((share) =>
                        share.analyses.find((analysis) => !analysis.success)
                    );

                if (shareError) {
                    showErrorAnnouncer(t("statusHelpShareError"));
                } else {
                    setShareWithSupportAnalysis(null);
                    announce({
                        text: t("statusHelpShareSuccess"),
                        variant: AnnouncerConstants.SUCCESS,
                    });
                }
            },
            onError: (error) => {
                showErrorAnnouncer(t("statusHelpShareError"), error);
            },
        }
    );

    const addItemsToBag = useBagAddItems({
        handleError: (error) => {
            showErrorAnnouncer(t("addToBagError"), error);
        },
        handleSettled: () => {
            setSelected([]);
        },
    });

    const onAddToBagSelected = () => {
        const items = getSelectedAnalyses()
            .filter((item) => item.can_share) //Only add items that can be shared.
            .map((item) => ({
                ...item,
                type: "analysis",
            }));

        addItemsToBag(items);
    };

    useEffect(() => {
        const permFilterChanged = selectedPermFilter?.name !== permFilter?.name;
        const typeFilterChanged =
            selectedTypeFilter?.name !== appTypeFilter?.name;
        if (
            permFilterChanged ||
            typeFilterChanged ||
            selectedOrder !== order ||
            selectedOrderBy !== orderBy ||
            selectedPage !== page ||
            selectedRowsPerPage !== rowsPerPage
        ) {
            //JSON objects needs to stringified for urls.
            const stringPermFilter = JSON.stringify(permFilter);
            const stringTypeFilter = JSON.stringify(appTypeFilter);
            onRouteToListing(
                order,
                orderBy,
                page,
                rowsPerPage,
                stringPermFilter,
                stringTypeFilter
            );
        }
    }, [
        appTypeFilter,
        onRouteToListing,
        order,
        orderBy,
        page,
        permFilter,
        rowsPerPage,
        selectedOrder,
        selectedOrderBy,
        selectedPage,
        selectedPermFilter,
        selectedTypeFilter,
        selectedRowsPerPage,
    ]);

    useEffect(() => {
        const filters = [];

        if (idFilter) {
            const idFilterObj = Object.create(filter);
            idFilterObj.field = ID;
            idFilterObj.value = idFilter;
            filters.push(idFilterObj);
        } else {
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
                    case t("all"):
                        val = ALL;
                        break;
                    case t("mine"):
                        val = MINE;
                        break;
                    case t("theirs"):
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
        t,
        idFilter,
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
                            const newAnalyses = data.analyses.map((analysis) =>
                                analysis.id === message.payload.id
                                    ? {
                                          ...analysis,
                                          status: analysisStatus,
                                          enddate: message.payload.enddate,
                                      }
                                    : analysis
                            );
                            setData({ ...data, analyses: newAnalyses });
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
                                ...data,
                                analyses: [message.payload, ...newPage],
                            });
                        } else if (data.analyses?.length === 0) {
                            //if page is empty...
                            setData({ analyses: [message.payload], total: 1 });
                        } else {
                            setData({
                                ...data,
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
        setSingleSelection(selected && selected.length === 1);
    }, [selected]);

    useEffect(() => {
        if (data?.analyses) {
            const selectedId = selected[0];
            setSelectedAnalysis(
                data.analyses.find((item) => item.id === selectedId)
            );
        } else {
            setSelectedAnalysis(null);
        }
    }, [data, selected]);

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

    const handleCheckboxClick = (event, id, index) => {
        toggleSelection(id);
        setLastSelectIndex(index);
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
            setSelected([id]);
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
        setIdFilter(null);
        setSelected([]);
    };

    const handleClearFilter = () => {
        onRouteToListing(order, orderBy, 0, rowsPerPage, null, null);
    };

    const handleRelaunch = (analyses) => {
        if (analyses?.length > 0) {
            if (analyses.length === 1) {
                handleSingleRelaunch(analyses[0]);
            } else {
                setRelaunchDialogOpen(true);
            }
        }
    };

    const confirmMultiRelaunch = () => {
        setRelaunchDialogOpen(false);
        relaunchAnalysesMutation(selected);
    };

    const handleDelete = () => {
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        setDeleteDialogOpen(false);
        deleteAnalysesMutation(selected);
    };

    const handleRename = () => {
        setRenameDialogOpen(true);
    };

    const handleComments = () => {
        setCommentDialogOpen(true);
    };

    const handleCancel = () => {
        analysesCancelMutation({ ids: selected });
    };

    const handleSaveAndComplete = () => {
        analysesCancelMutation({
            ids: selected,
            job_status: analysisStatus.COMPLETED,
        });
    };

    const handleStatusClick = (analysis) => {
        setShareWithSupportAnalysis(analysis);
    };

    const onShareWithSupport = (analysis, comment) => {
        shareAnalysesMutation({
            ...getAnalysisShareWithSupportRequest(
                config?.analysis?.supportUser,
                analysis.id
            ),
            supportRequest: analysisSupportRequest(
                userProfile?.id,
                userProfile?.attributes.email,
                t("statusHelpRequestSubject", {
                    name: userProfile?.attributes.name,
                }),
                comment,
                analysis
            ),
        });
    };

    const getSelectedAnalyses = (analyses) => {
        const items = analyses ? analyses : selected;
        return items.map((id) =>
            data?.analyses.find((analysis) => analysis.id === id)
        );
    };

    const sharingEnabled = canShare(getSelectedAnalyses());

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
                viewFiltered={parentAnalysis || idFilter}
                onClearFilter={handleClearFilter}
                isGridView={isGridView}
                toggleDisplay={toggleDisplay}
                isSingleSelection={isSingleSelection}
                onDetailsSelected={onDetailsSelected}
                onAddToBagSelected={onAddToBagSelected}
                handleComments={handleComments}
                handleInteractiveUrlClick={openInteractiveUrl}
                handleCancel={handleCancel}
                handleDelete={handleDelete}
                handleRelaunch={handleRelaunch}
                handleRename={handleRename}
                handleSaveAndComplete={handleSaveAndComplete}
                handleBatchIconClick={handleBatchIconClick}
                canShare={sharingEnabled}
            />
            <TableView
                loading={
                    isFetching ||
                    cancelLoading ||
                    deleteLoading ||
                    relaunchLoading
                }
                error={error}
                listing={data}
                baseId={baseId}
                order={order}
                orderBy={orderBy}
                selected={selected}
                username={userProfile?.id}
                handleSelectAllClick={handleSelectAllClick}
                handleClick={handleClick}
                handleCheckboxClick={handleCheckboxClick}
                handleRequestSort={handleRequestSort}
                handleInteractiveUrlClick={openInteractiveUrl}
                handleRelaunch={handleRelaunch}
                handleBatchIconClick={handleBatchIconClick}
                handleDetailsClick={onDetailsSelected}
                handleStatusClick={handleStatusClick}
            />

            <ConfirmationDialog
                open={deleteDialogOpen}
                baseId={build(baseId, ids.DIALOG.DELETE)}
                onClose={() => setDeleteDialogOpen(false)}
                onConfirm={confirmDelete}
                title={t("delete")}
                contentText={t("analysesExecDeleteWarning")}
            />

            <ConfirmationDialog
                open={relaunchDialogOpen}
                baseId={build(baseId, ids.DIALOG.RELAUNCH)}
                onClose={() => setRelaunchDialogOpen(false)}
                onConfirm={confirmMultiRelaunch}
                title={t("relaunch")}
                contentText={t("analysesMultiRelaunchWarning")}
            />

            <RenameAnalysisDialog
                open={renameDialogOpen}
                selectedAnalysis={selectedAnalysis}
                isLoading={renameLoading}
                submissionError={renameError}
                onClose={() => setRenameDialogOpen(false)}
                handleRename={renameAnalysisMutation}
            />

            <AnalysisCommentDialog
                open={commentDialogOpen}
                selectedAnalysis={selectedAnalysis}
                isLoading={commentLoading}
                submissionError={commentError}
                onClose={() => setCommentDialogOpen(false)}
                handleUpdateComment={analysisCommentMutation}
            />

            {shareWithSupportAnalysis && (
                <ShareWithSupportDialog
                    baseId={build(baseId, ids.DIALOG.STATUS_HELP)}
                    open={!!shareWithSupportAnalysis}
                    analysis={shareWithSupportAnalysis}
                    name={userProfile?.attributes.name}
                    email={userProfile?.attributes.email}
                    loading={shareLoading}
                    onClose={() => setShareWithSupportAnalysis(null)}
                    onShareWithSupport={onShareWithSupport}
                />
            )}

            {detailsOpen && (
                <Drawer
                    selectedAnalysis={selectedAnalysis}
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
export default withErrorAnnouncer(Listing);
