/**
 *
 * @author sboleyn
 *
 * A parent component to the subscriptions add-ons table view.
 *
 */

import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";

import {
    getAvailableAddOns,
    AVAILABLE_ADDONS_QUERY_KEY,
} from "serviceFacades/subscriptions";

import AddonsToolbar from "./Toolbar";
import TableView from "./TableView";
import EditAddonDialog from "./EditAddon";

function AddOnsListing(props) {
    const { baseId, isAdminView } = props;
    const [addonsData, setAddonsData] = useState(null);
    const [editDialogOpen, setEditDialogOpen] = useState();
    const [selected, setSelected] = useState([]);
    const [selectedAddon, setSelectedAddon] = useState();

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

    const { isFetching, error } = useQuery({
        queryKey: [AVAILABLE_ADDONS_QUERY_KEY],
        queryFn: getAvailableAddOns,
        enabled: true,
        onSuccess: setAddonsData,
    });

    const deselect = () => {
        setSelected([]);
    };

    const handleClick = (_, uuid) => {
        setSelected([uuid]);
    };

    const handleCheckboxClick = (_, uuid) => {
        toggleSelection(uuid);
    };

    const isSelected = (uuid) => selected.includes(uuid);

    const onEditSelected = () => {
        setEditDialogOpen(true);
    };

    const onCloseEdit = () => {
        setEditDialogOpen(false);
    };

    const toggleSelection = (uuid) => {
        isSelected(uuid) ? deselect() : setSelected([uuid]);
    };

    return (
        <>
            <AddonsToolbar baseId={baseId} isAdminView={isAdminView} />
            <TableView
                baseId={baseId}
                error={error}
                handleCheckboxClick={handleCheckboxClick}
                handleClick={handleClick}
                isAdminView={isAdminView}
                listing={addonsData}
                loading={isFetching}
                onEditSelected={onEditSelected}
                selected={selected}
            />
            <EditAddonDialog
                open={editDialogOpen}
                onClose={onCloseEdit}
                parentId={baseId}
                addon={selectedAddon}
            />
        </>
    );
}

export default AddOnsListing;
