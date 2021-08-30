/**
 * @author aramsey
 *
 * A dialog that shows up when the user selects `My Collections` from the
 * app view's drop down menu of categories.  This allows the user
 * to select a collection they want to view the apps for.
 */
import React from "react";

import { Button } from "@material-ui/core";

import { COLLECTION_FILTER } from "components/collections";
import Listing from "components/collections/Listing";
import buildID from "components/utils/DebugIDUtil";
import DEDialog from "components/utils/DEDialog";
import { useTranslation } from "i18n";
import ids from "./ids";

function SelectCollectionDialog(props) {
    const { open, onClose, onCollectionSelected } = props;
    const { t } = useTranslation(["collections", "common"]);

    const dialogId = ids.SELECT_COLLECTION_DLG;

    return (
        <DEDialog
            baseId={dialogId}
            title={t("selectCollectionTitle")}
            open={open}
            onClose={onClose}
            actions={
                <Button
                    id={buildID(dialogId, ids.CANCEL_BTN)}
                    onClick={onClose}
                >
                    {t("common:cancel")}
                </Button>
            }
        >
            <Listing
                parentId={dialogId}
                filter={COLLECTION_FILTER.MY_COLLECTIONS}
                onCollectionSelected={onCollectionSelected}
            />
        </DEDialog>
    );
}

export default SelectCollectionDialog;
