/**
 * @author sriram
 *
 * A dialog that allows users to select the type of file they would like to create
 *
 */
import React, { useState } from "react";
import { useTranslation } from "i18n";
import { build } from "@cyverse-de/ui-lib";
import ids from "./ids";
import DEDialog from "components/utils/DEDialog";
import ViewerConstants from "./constants";
import InfoTypes from "components/models/InfoTypes";
import {
    Button,
    Select,
    InputLabel,
    FormControl,
    MenuItem,
} from "@material-ui/core";
import { mimeTypes } from "components/models/MimeTypes";

export default function FileTypeSelectionDialog(props) {
    const { open, onFileTypeSelected, onClose } = props;

    const [type, setType] = useState("raw");

    const { t } = useTranslation("data");
    const { t: i18nCommon } = useTranslation("common");

    const baseId = ids.FILE_TYPE_DIALOG;

    const handleChange = (event) => {
        setType(event.target.value);
    };

    return (
        <DEDialog
            id={baseId}
            open={open}
            actions={
                <>
                    <Button
                        id={build(baseId, ids.CANCEL_BTN)}
                        onClick={onClose}
                    >
                        {i18nCommon("cancel")}
                    </Button>
                    <Button
                        id={build(baseId, ids.CREATE_BTN)}
                        color="primary"
                        onClick={() => onFileTypeSelected(type)}
                    >
                        {i18nCommon("create")}
                    </Button>
                </>
            }
        >
            <FormControl style={{ width: "95%" }}>
                <InputLabel>{t("selectFileType")}</InputLabel>
                <Select
                    value={type}
                    onChange={handleChange}
                    id={build(baseId, ids.FILE_TYPE_SELECT)}
                >
                    <MenuItem value="raw">
                        {ViewerConstants.PLAIN_TEXT}
                    </MenuItem>
                    <MenuItem value={InfoTypes.CSV}>
                        {ViewerConstants.CSV}
                    </MenuItem>
                    <MenuItem value={InfoTypes.TSV}>
                        {ViewerConstants.TSV}
                    </MenuItem>
                    <MenuItem value={mimeTypes.X_RSRC}>
                        {ViewerConstants.R}
                    </MenuItem>
                    <MenuItem value={mimeTypes.X_PYTHON}>
                        {ViewerConstants.PYTHON}
                    </MenuItem>
                    <MenuItem value={ViewerConstants.GITHUB_FLAVOR_MARKDOWN}>
                        {ViewerConstants.MARKDOWN}
                    </MenuItem>
                    <MenuItem value="dockerfile">
                        {ViewerConstants.DOCKERFILE}
                    </MenuItem>
                    <MenuItem value={InfoTypes.HT_ANALYSIS_PATH_LIST}>
                        {ViewerConstants.HT_ANALYSIS_PATH_LIST}
                    </MenuItem>
                    <MenuItem value={InfoTypes.MULTI_INPUT_PATH_LIST}>
                        {ViewerConstants.MULTI_INPUT_PATH_LIST}
                    </MenuItem>
                </Select>
            </FormControl>
        </DEDialog>
    );
}
