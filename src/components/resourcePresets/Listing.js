import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "i18n";

import { announce } from "components/announcer/CyVerseAnnouncer";
import withErrorAnnouncer from "components/error/withErrorAnnouncer";
import ConfirmationDialog from "components/utils/ConfirmationDialog";

import TableView from "./TableView";
import EditPresetDialog from "./EditPresetDialog";

import {
    RESOURCE_PRESETS_LISTING_QUERY_KEY,
    listResourcePresets,
    createResourcePreset,
    updateResourcePreset,
    deleteResourcePreset,
    setDefaultResourcePreset,
} from "serviceFacades/resourcePresets";

function Listing({ baseId, showErrorAnnouncer }) {
    const { t } = useTranslation("resourcePresets");
    const queryClient = useQueryClient();

    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedPreset, setSelectedPreset] = useState(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [presetToDelete, setPresetToDelete] = useState(null);

    const { data, isFetching, error } = useQuery({
        queryKey: [RESOURCE_PRESETS_LISTING_QUERY_KEY],
        queryFn: listResourcePresets,
    });

    const { mutate: doCreate } = useMutation(createResourcePreset, {
        onSuccess: () => {
            announce({ text: t("presetCreated") });
            queryClient.invalidateQueries([RESOURCE_PRESETS_LISTING_QUERY_KEY]);
            setEditDialogOpen(false);
        },
        onError: (e) => {
            showErrorAnnouncer(t("presetCreateError"), e);
        },
    });

    const { mutate: doUpdate } = useMutation(updateResourcePreset, {
        onSuccess: () => {
            announce({ text: t("presetUpdated") });
            queryClient.invalidateQueries([RESOURCE_PRESETS_LISTING_QUERY_KEY]);
            setEditDialogOpen(false);
        },
        onError: (e) => {
            showErrorAnnouncer(t("presetUpdateError"), e);
        },
    });

    const { mutate: doDelete } = useMutation(deleteResourcePreset, {
        onSuccess: () => {
            announce({ text: t("presetDeleted") });
            queryClient.invalidateQueries([RESOURCE_PRESETS_LISTING_QUERY_KEY]);
        },
        onError: (e) => {
            showErrorAnnouncer(t("presetDeleteError"), e);
        },
    });

    const { mutate: doSetDefault } = useMutation(setDefaultResourcePreset, {
        onSuccess: () => {
            announce({ text: t("presetSetAsDefault") });
            queryClient.invalidateQueries([RESOURCE_PRESETS_LISTING_QUERY_KEY]);
        },
        onError: (e) => {
            showErrorAnnouncer(t("presetSetDefaultError"), e);
        },
    });

    const onAddPreset = () => {
        setSelectedPreset(null);
        setEditDialogOpen(true);
    };

    const onEdit = (preset) => {
        setSelectedPreset(preset);
        setEditDialogOpen(true);
    };

    const onDelete = (preset) => {
        setPresetToDelete(preset);
        setDeleteConfirmOpen(true);
    };

    const onSetDefault = (preset) => {
        doSetDefault({ id: preset.id });
    };

    const onSave = (values) => {
        if (selectedPreset) {
            doUpdate({ id: selectedPreset.id, ...values });
        } else {
            doCreate(values);
        }
    };

    return (
        <>
            <TableView
                baseId={baseId}
                presets={data?.resource_presets || []}
                loading={isFetching}
                error={error}
                onAddPreset={onAddPreset}
                onEdit={onEdit}
                onDelete={onDelete}
                onSetDefault={onSetDefault}
            />
            <EditPresetDialog
                open={editDialogOpen}
                onClose={() => setEditDialogOpen(false)}
                preset={selectedPreset}
                onSave={onSave}
            />
            <ConfirmationDialog
                baseId={baseId}
                open={deleteConfirmOpen}
                onConfirm={() => {
                    setDeleteConfirmOpen(false);
                    doDelete({ id: presetToDelete?.id });
                }}
                onClose={() => setDeleteConfirmOpen(false)}
                title={t("deletePreset")}
                contentText={t("deleteConfirmation", {
                    label: presetToDelete?.label,
                })}
            />
        </>
    );
}

export default withErrorAnnouncer(Listing);
