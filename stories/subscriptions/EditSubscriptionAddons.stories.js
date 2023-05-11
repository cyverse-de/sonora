import React, { useState } from "react";
import { mockAxios } from "../axiosMock";
import AddSubAddonsDialog from "components/subscriptions/edit/AddSubAddon";
import EditSubAddonsDialog from "components/subscriptions/edit/EditSubAddons";
import ConfirmationDialog from "components/utils/ConfirmationDialog";

import {
    availableAddons,
    selectedSubscriptionAddons,
    subscriptionID,
} from "./SubscriptionAddonsMocks";

export default {
    title: "Subscriptions / Edit",
};

export function EditSubscriptionAddonsTest() {
    // Create subscription add-on
    mockAxios
        .onPost(/api\/admin\/qms\/subscriptions\/.*\/addons/)
        .reply((config) => {
            const submission = JSON.parse(config.data);
            console.log("Subscription successfully updated.");
            return [200, submission];
        });

    // Edit subscription add-on
    mockAxios
        .onPut(/api\/admin\/qms\/subscriptions\/.*\/addons\/.*/)
        .reply((config) => {
            const submission = JSON.parse(config.data);
            console.log(
                "Add-ons successfully updated.",
                config.url,
                submission
            );
            return [200, submission];
        });

    // Props
    const [openDlg, setOpenDlg] = useState(true);
    const [openAddDlg, setOpenAddDlg] = useState(false);
    const [openDeleteDlg, setOpenDeleteDlg] = useState(false);

    const parentId = "editQuotasDlg";

    const onClose = () => {
        console.log("Dialog closed.");
    };

    const onOpenAdd = () => {
        setOpenDlg(false);
        setOpenAddDlg(true);
    };
    const onCloseAdd = () => {
        setOpenDlg(true);
        setOpenAddDlg(false);
    };

    const onOpenDelete = () => setOpenDeleteDlg(true);
    const onCloseDelete = () => setOpenDeleteDlg(false);

    return (
        <>
            <EditSubAddonsDialog
                handleRemoveAddon={onOpenDelete}
                isFetchingSubAddons={false}
                onAddonsSelected={onOpenAdd}
                onClose={onClose}
                open={openDlg}
                parentId={parentId}
                selectedSubscriptionAddons={selectedSubscriptionAddons}
                subscriptionId={subscriptionID}
            />
            <AddSubAddonsDialog
                availableAddons={availableAddons.addons}
                onClose={onCloseAdd}
                open={openAddDlg}
                parentId={parentId}
                subscriptionId={subscriptionID}
            />
            <ConfirmationDialog
                baseId={parentId}
                open={openDeleteDlg}
                onConfirm={() => {
                    onCloseDelete();
                    console.log(`Add-on removed.`);
                }}
                onClose={onCloseDelete}
                title="Delete"
                contentText="Remove add-on from subscription?"
            />
        </>
    );
}
