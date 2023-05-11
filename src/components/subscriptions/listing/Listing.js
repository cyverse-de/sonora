/**
 * @author sboleyn
 *
 * A component intended to be the parent to the subscriptions table view
 *
 */

import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useTranslation } from "i18n";

import TableView from "./TableView";
import SubscriptionToolbar from "../toolbar/Toolbar";
import Drawer from "../details/Drawer";
import DEPagination from "components/utils/DEPagination";
import ConfirmationDialog from "components/utils/ConfirmationDialog";
import withErrorAnnouncer from "components/error/withErrorAnnouncer";

import {
    deleteSubAddon,
    getSubscriptionAddons,
    getSubscriptions,
    SUBSCRIPTION_ADDONS_QUERY_KEY,
    SUBSCRIPTIONS_QUERY_KEY,
} from "serviceFacades/subscriptions";

import {
    getUserPortalDetails,
    USER_PORTAL_DETAILS_QUERY_KEY,
} from "serviceFacades/users";

import constants from "../../../constants";

import EditSubscriptionDialog from "../edit/EditSubscription";
import EditQuotasDialog from "../edit/EditQuotas";
import EditSubAddonsDialog from "../edit/EditSubAddons";
import AddSubAddonsDialog from "../edit/AddSubAddon";
import { announce } from "components/announcer/CyVerseAnnouncer";

function Listing(props) {
    const {
        availableAddons,
        baseId,
        isAdminView,
        onRouteToListing,
        order,
        orderBy,
        page,
        rowsPerPage,
        searchTerm,
        showErrorAnnouncer,
    } = props;

    const { t } = useTranslation("subscriptions");

    const [data, setData] = useState(null);
    const [deleteAddonDialogOpen, setDeleteAddonDialogOpen] = useState(false);
    const [subAddonsDialogOpen, setSubAddonsDialogOpen] = useState(false);
    const [editSubAddonsDialogOpen, setEditSubAddonsDialogOpen] =
        useState(false);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [editSubscriptionDialogOpen, setEditSubscriptionDialogOpen] =
        useState(false);
    const [editQuotasDialogOpen, setEditQuotasDialogOpen] = useState(false);
    const [removeSelectedAddon, setRemoveSelectedAddon] = useState(null);
    const [selected, setSelected] = useState([]);
    const [selectedSubscription, setSelectedSubscription] = useState(null);
    const [selectedUserPortalId, setSelectedUserPortalId] = useState(null);
    const [selectedSubscriptionAddons, setSelectedSubscriptionAddons] =
        useState(null);

    const queryClient = useQueryClient();

    useEffect(() => {
        // Reset selected whenever the data set changes,
        // which can be due to the browser's back or forward navigation,
        // in addition to the user changing categories or pages.
        setSelected([]);
    }, [data]);

    useEffect(() => {
        if (data?.subscriptions) {
            const selectedId = selected[0];
            setSelectedSubscription(
                data.subscriptions.find(
                    (subscription) => subscription.id === selectedId
                )
            );
        } else {
            setSelectedSubscription(null);
        }
    }, [data, selected]);

    const { isFetching, error } = useQuery({
        queryKey: [
            SUBSCRIPTIONS_QUERY_KEY,
            {
                order,
                orderBy,
                page,
                rowsPerPage,
                searchTerm,
                isAdminView,
            },
        ],
        queryFn: () =>
            getSubscriptions({ searchTerm, order, orderBy, page, rowsPerPage }),
        enabled: true,
        onSuccess: (resp) => {
            setData(resp.result);
        },
    });

    // Get user portal details for the selected user
    const { isFetchingSubAddons } = useQuery({
        queryKey: [
            USER_PORTAL_DETAILS_QUERY_KEY,
            {
                username: selectedSubscription?.user.username,
            },
        ],
        queryFn: () =>
            getUserPortalDetails(selectedSubscription?.user.username),
        enabled: !!selectedSubscription,
        onSuccess: (resp) => {
            setSelectedUserPortalId(resp.id);
        },
        onError: () => {
            setSelectedUserPortalId(null);
        },
    });

    // Get subscription add-ons for the selected user
    useQuery({
        queryKey: [
            SUBSCRIPTION_ADDONS_QUERY_KEY,
            {
                id: selectedSubscription?.id,
            },
        ],
        queryFn: () => getSubscriptionAddons(selectedSubscription?.id),
        enabled: !!selectedSubscription,
        onSuccess: (resp) => {
            setSelectedSubscriptionAddons(resp.subscription_addons);
        },
    });

    const handleChangePage = (_, newPage) => {
        onRouteToListing &&
            onRouteToListing(
                order,
                orderBy,
                newPage - 1,
                rowsPerPage,
                searchTerm
            );
    };

    const handleChangeRowsPerPage = (newPageSize) => {
        onRouteToListing &&
            onRouteToListing(
                order,
                orderBy,
                0,
                parseInt(newPageSize, 10),
                searchTerm
            );
    };

    const { mutate: removeAddon, status: deleteAddonStatus } = useMutation(
        (addon_uuid) => deleteSubAddon(selected[0], addon_uuid),
        {
            onSuccess: () => {
                announce({ text: t("subscriptionUpdated") });
                queryClient.invalidateQueries(SUBSCRIPTION_ADDONS_QUERY_KEY);
            },
            onError: (err) => {
                showErrorAnnouncer(t("removeAddonError"), err);
                queryClient.invalidateQueries(SUBSCRIPTION_ADDONS_QUERY_KEY);
            },
        }
    );

    const deselect = () => {
        setSelected([]);
    };

    const handleClick = (_, id) => {
        setSelected([id]);
    };

    const handleCheckboxClick = (_event, id) => {
        toggleSelection(id);
    };

    const handleRemoveAddon = (addonUUID) => {
        setDeleteAddonDialogOpen(true);
        setRemoveSelectedAddon(addonUUID);
    };

    const isSelected = (id) => selected.includes(id);

    const toggleSelection = (id) => {
        isSelected(id) ? deselect() : setSelected([id]);
    };

    const handleRequestSort = (_, field) => {
        const isAsc = orderBy === field && order === constants.SORT_ASCENDING;
        onRouteToListing &&
            onRouteToListing(
                isAsc ? constants.SORT_DESCENDING : constants.SORT_ASCENDING,
                field,
                page,
                rowsPerPage,
                searchTerm
            );
    };

    const handleSearch = (term) => {
        setSelected([]);
        onRouteToListing &&
            onRouteToListing(order, orderBy, 0, rowsPerPage, term);
    };

    const onCloseEditSubscription = () => {
        setEditSubscriptionDialogOpen(false);
    };

    const onCloseEditQuotas = () => {
        setEditQuotasDialogOpen(false);
    };

    const onCloseAddSubAddons = () => {
        setSubAddonsDialogOpen(false);
        onEditAddonsSelected();
    };

    const onCloseEditSubAddons = () => {
        setEditSubAddonsDialogOpen(false);
    };

    const onCloseRemoveAddon = () => {
        setRemoveSelectedAddon(null);
        setDeleteAddonDialogOpen(false);
    };

    const onAddonsSelected = () => {
        setSubAddonsDialogOpen(true);
        onCloseEditSubAddons();
    };

    const onEditAddonsSelected = () => {
        setEditSubAddonsDialogOpen(true);
    };

    const onDetailsSelected = () => {
        setDetailsOpen(true);
    };

    const onEditSubscriptionSelected = () => {
        setEditSubscriptionDialogOpen(true);
    };

    const onEditQuotasSelected = () => {
        setEditQuotasDialogOpen(true);
    };

    return (
        <>
            <SubscriptionToolbar
                baseId={baseId}
                handleSearch={handleSearch}
                isAdminView={isAdminView}
                searchTerm={searchTerm}
            />
            <TableView
                baseId={baseId}
                error={error}
                handleCheckboxClick={handleCheckboxClick}
                handleClick={handleClick}
                handleRequestSort={handleRequestSort}
                isAdminView={isAdminView}
                listing={data}
                loading={isFetching}
                onEditAddonsSelected={onEditAddonsSelected}
                onDetailsSelected={onDetailsSelected}
                onEditQuotasSelected={onEditQuotasSelected}
                onEditSubscriptionSelected={onEditSubscriptionSelected}
                order={order}
                orderBy={orderBy}
                selected={selected}
            />
            {detailsOpen && (
                <Drawer
                    anchor="right"
                    baseId={baseId}
                    onClose={() => setDetailsOpen(false)}
                    open={detailsOpen}
                    parentId={baseId}
                    selectedSubscription={selectedSubscription}
                    selectedSubscriptionAddons={selectedSubscriptionAddons}
                    selectedUserPortalId={selectedUserPortalId}
                />
            )}
            <AddSubAddonsDialog
                availableAddons={availableAddons?.addons}
                open={subAddonsDialogOpen}
                onClose={onCloseAddSubAddons}
                parentId={baseId}
                subscriptionId={selected[0]}
            />
            <EditSubscriptionDialog
                open={editSubscriptionDialogOpen}
                onClose={onCloseEditSubscription}
                parentId={baseId}
                subscription={selectedSubscription}
            />
            <EditQuotasDialog
                open={editQuotasDialogOpen}
                onClose={onCloseEditQuotas}
                parentId={baseId}
                subscription={selectedSubscription}
            />
            <EditSubAddonsDialog
                handleRemoveAddon={handleRemoveAddon}
                isFetchingSubAddons={
                    isFetchingSubAddons ||
                    deleteAddonStatus === constants.LOADING
                }
                open={editSubAddonsDialogOpen}
                onAddonsSelected={onAddonsSelected}
                onClose={onCloseEditSubAddons}
                parentId={baseId}
                selectedSubscriptionAddons={selectedSubscriptionAddons}
                subscriptionId={selected[0]}
            />
            <ConfirmationDialog
                baseId={baseId}
                open={deleteAddonDialogOpen}
                onConfirm={() => {
                    onCloseRemoveAddon();
                    removeAddon(removeSelectedAddon);
                }}
                onClose={onCloseRemoveAddon}
                title={t("deleteAddon")}
                contentText={t("confirmDeleteAddon")}
            />
            {data && data.total > 0 && (
                <DEPagination
                    baseId={baseId}
                    onChange={handleChangePage}
                    onPageSizeChange={handleChangeRowsPerPage}
                    page={page + 1}
                    pageSize={rowsPerPage}
                    totalPages={Math.ceil(data.total / rowsPerPage)}
                />
            )}
        </>
    );
}

export default withErrorAnnouncer(Listing);
