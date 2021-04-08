/**
 * A dialog for selecting a Tool.
 *
 * @author psarando
 */

import React from "react";

import { useTranslation } from "i18n";
import constants from "../../constants";

import ids from "./ids";

import Listing from "components/tools/listing/Listing";
import { getLocalStorage } from "components/utils/localStorage";
import DEDialog from "components/utils/DEDialog";

import { Button } from "@material-ui/core";

export default function ToolSelectionDialog(props) {
    const { open, onClose, onConfirm } = props;

    const [selectedTool, setSelectedTool] = React.useState();
    const [
        { order, orderBy, page, rowsPerPage, permFilter, searchTerm },
        setPageParams,
    ] = React.useState({
        order: constants.SORT_ASCENDING,
        orderBy: "name",
        page: 0,
        rowsPerPage:
            parseInt(
                getLocalStorage(constants.LOCAL_STORAGE.TOOLS.PAGE_SIZE)
            ) || 100,
        permFilter: null,
        searchTerm: "",
    });

    const onRouteToListing = React.useCallback(
        (order, orderBy, page, rowsPerPage, permFilter, searchTerm) => {
            setPageParams({
                order,
                orderBy,
                page,
                rowsPerPage,
                permFilter,
                searchTerm,
            });
        },
        [setPageParams]
    );

    const { t } = useTranslation(["tools", "common"]);

    const baseId = ids.INSTALLED_TOOLS_DLG;

    return (
        <DEDialog
            baseId={baseId}
            open={open}
            onClose={onClose}
            title={t("searchTools")}
            actions={
                <>
                    <Button onClick={onClose}>{t("common:cancel")}</Button>
                    <Button
                        color="primary"
                        onClick={() => {
                            onConfirm(selectedTool);
                        }}
                    >
                        {t("common:select")}
                    </Button>
                </>
            }
        >
            <Listing
                baseId={baseId}
                disableDelete
                disableEdit
                disableShare
                multiSelect={false}
                order={order}
                orderBy={orderBy}
                page={page}
                rowsPerPage={rowsPerPage}
                permFilter={permFilter}
                searchTerm={searchTerm}
                onRouteToListing={onRouteToListing}
                onToolSelected={setSelectedTool}
            />
        </DEDialog>
    );
}
