/**
 *
 * @author sboleyn
 *
 * A parent component to the subscriptions add-ons table view.
 *
 */

import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient, useQuery } from "react-query";

import {
    deleteAddons,
    getAvailableAddOns,
    AVAILABLE_ADDONS_QUERY_KEY,
} from "serviceFacades/subscriptions";

import { useTranslation } from "i18n";

import AddonsToolbar from "./Toolbar";
import TableView from "./TableView";
import EditAddonDialog from "./EditAddon";
import ConfirmationDialog from "components/utils/ConfirmationDialog";
import withErrorAnnouncer from "components/error/withErrorAnnouncer";
import { announce } from "components/announcer/CyVerseAnnouncer";
import constants from "../../../constants";

function AddOnsListing(props) {
    const { baseId, isAdminView, showErrorAnnouncer } = props;
    const [addonsData, setAddonsData] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState();
    const [editDialogOpen, setEditDialogOpen] = useState();
    const [selected, setSelected] = useState([]);
    const [selectedAddon, setSelectedAddon] = useState();
    const [multipleSelected, setMultipleSelected] = useState(false);
    const [lastSelectedIndex, setLastSelectedIndex] = useState(-1);
    const { t } = useTranslation("subscriptions");
    const queryClient = useQueryClient();
    useEffect(() => {
        // Reset selected whenever the data set changes,
        // which can be due to the browser's back or forward navigation,
        // in addition to the user changing categories or pages.
        setSelected([]);
    }, [addonsData]);

    useEffect(() => {
        if (addonsData?.addons) {
            const selectedId = selected[0];
            setSelectedAddon(
                addonsData.addons.find((addon) => addon.uuid === selectedId)
            );
        } else {
            setSelectedAddon(null);
        }
    }, [addonsData, selected]);

    useEffect(() => {
        setMultipleSelected(!!selected && selected.length > 1);
    }, [selected]);

    const { mutate: removeAddon, status: deleteAddonStatus } = useMutation(
        deleteAddons,
        {
            onSuccess: () => {
                announce({
                    text: t("addonDelete"),
                });
                setSelected([]);
                queryClient.invalidateQueries(AVAILABLE_ADDONS_QUERY_KEY);
            },
            onError: (error) => {
                showErrorAnnouncer(t("deleteAddonError"), error);
                queryClient.invalidateQueries(AVAILABLE_ADDONS_QUERY_KEY);
            },
        }
    );

    const { isFetching, error } = useQuery({
        queryKey: [AVAILABLE_ADDONS_QUERY_KEY],
        queryFn: getAvailableAddOns,
        enabled: true,
        onSuccess: setAddonsData,
    });

    // Handles a request to select all tools.
    const handleSelectAllClick = (event) => {
        setSelected(
            event.target.checked && !selected.length
                ? addonsData?.addons?.map((addon) => addon.uuid) || []
                : []
        );
    };

    const select = (uuids) => {
        setSelected([...new Set([...selected, ...uuids])]);
    };

    const deselect = (uuids) => {
        setSelected(selected.filter((uuid) => !uuids.includes(uuid)));
    };

    const isSelected = (uuid) => selected.includes(uuid);

    // Selects all of the tools in an index range
    const rangeSelect = (start, end, targetId) => {
        // Ensure the start index comes before the end index
        if (start > end) {
            [start, end] = [end, start];
        }

        if (start < 0) {
            return;
        }

        const rangeIds = [];
        for (let i = start; i <= end; i++) {
            rangeIds.push(addonsData?.addons[i].uuid);
        }
        // Toggle the selection based on the last add-on clicked.
        isSelected(targetId) ? deselect(rangeIds) : select(rangeIds);
    };

    // User clicks on a checkbox
    const handleCheckboxClick = (_, uuid, index) => {
        toggleSelection(uuid);
        setLastSelectedIndex(index);
    };

    const handleClick = (event, uuid, index) => {
        event.shiftKey
            ? rangeSelect(lastSelectedIndex, index, uuid)
            : setSelected([uuid]);

        setLastSelectedIndex(index);
    };

    // Select or deselect conditionally whether row is already selected
    const toggleSelection = (uuid) => {
        isSelected(uuid) ? deselect([uuid]) : select([uuid]);
    };

    // Open and close dialog windows
    const onDeleteSelected = () => {
        setDeleteDialogOpen(true);
    };

    const onCloseDelete = () => {
        setDeleteDialogOpen(false);
    };

    const onEditSelected = () => {
        setEditDialogOpen(true);
    };

    const onCloseEdit = () => {
        setEditDialogOpen(false);
    };

    const contentText = () => {
        return (
            selected &&
            selected.length > 0 &&
            selected.map((selectedAddon) => {
                let entry = addonsData.addons.find(
                    (addon) => addon.uuid === selectedAddon
                );
                return <li key={selectedAddon}>{entry.name}</li>;
            })
        );
    };

    return (
        <>
            <AddonsToolbar
                baseId={baseId}
                isAdminView={isAdminView}
                multipleSelected={multipleSelected}
                onDeleteSelected={onDeleteSelected}
            />
            <TableView
                baseId={baseId}
                error={error}
                handleCheckboxClick={handleCheckboxClick}
                handleClick={handleClick}
                handleSelectAllClick={handleSelectAllClick}
                isAdminView={isAdminView}
                listing={addonsData}
                loading={isFetching || deleteAddonStatus === constants.LOADING}
                onDeleteSelected={onDeleteSelected}
                onEditSelected={onEditSelected}
                selected={selected}
            />
            <EditAddonDialog
                open={editDialogOpen}
                onClose={onCloseEdit}
                parentId={baseId}
                addon={selectedAddon}
            />
            <ConfirmationDialog
                baseId={baseId}
                open={deleteDialogOpen}
                onConfirm={() => {
                    onCloseDelete();
                    removeAddon(selected);
                }}
                onClose={onCloseDelete}
                title={t("confirmDelete")}
                contentText={contentText()}
            />
        </>
    );
}

export default withErrorAnnouncer(AddOnsListing);
