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

import TableView from "./TableView";

function AddOnsListing(props) {
    const { baseId, isAdminView } = props;
    const [addonsData, setAddonsData] = useState(null);
    const [selected, setSelected] = useState([]);
    const [selectedAddon, setSelectedAddon] = useState(null);

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
            console.log(selectedAddon);
        } else {
            setSelectedAddon(null);
        }
    }, [addonsData, selected, selectedAddon]);

    const { isFetching, error } = useQuery({
        queryKey: [AVAILABLE_ADDONS_QUERY_KEY],
        queryFn: getAvailableAddOns,
        enabled: true,
        onSuccess: (resp) => {
            setAddonsData(resp);
        },
    });

    // Deselects an add-on
    const deselect = (uuid) => {
        setSelected([]);
    };

    const handleClick = (_, uuid) => {
        setSelected([uuid]);
    };

    const handleCheckboxClick = (_, uuid) => {
        toggleSelection(uuid);
    };

    const isSelected = (uuid) => selected.includes(uuid);

    const toggleSelection = (uuid) => {
        isSelected(uuid) ? deselect([uuid]) : setSelected([uuid]);
    };

    return (
        <TableView
            baseId={baseId}
            error={error}
            handleCheckboxClick={handleCheckboxClick}
            handleClick={handleClick}
            isAdminView={isAdminView}
            listing={addonsData}
            loading={isFetching}
            selected={selected}
        />
    );
}

export default AddOnsListing;
