/**
 * @author sriram
 *
 * A dialog that allows users to select the type of file they would like to create
 *
 */
import React, { useState } from "react";
import { useTranslation } from "i18n";
import buildID from "components/utils/DebugIDUtil";
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
} from "@mui/material";

import { CODE_MIRROR_MODES } from "./constants";

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
            onClose={onClose}
            actions={
                <>
                    <Button
                        id={buildID(baseId, ids.CANCEL_BTN)}
                        onClick={onClose}
                    >
                        {i18nCommon("cancel")}
                    </Button>
                    <Button
                        id={buildID(baseId, ids.CREATE_BTN)}
                        color="primary"
                        onClick={() => onFileTypeSelected(type)}
                    >
                        {i18nCommon("create")}
                    </Button>
                </>
            }
        >
            <FormControl variant="standard" style={{ width: "95%" }}>
                <InputLabel>{t("selectFileType")}</InputLabel>
                <Select
                    value={type}
                    onChange={handleChange}
                    id={buildID(baseId, ids.FILE_TYPE_SELECT)}
                    variant="outlined"
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
                    <MenuItem value={CODE_MIRROR_MODES.PERL}>
                        {ViewerConstants.PERL}
                    </MenuItem>
                    <MenuItem value={CODE_MIRROR_MODES.PYTHON}>
                        {ViewerConstants.PYTHON}
                    </MenuItem>
                    <MenuItem value={CODE_MIRROR_MODES.R}>
                        {ViewerConstants.R}
                    </MenuItem>
                    <MenuItem value={CODE_MIRROR_MODES.SHELL}>
                        {ViewerConstants.SHELL}
                    </MenuItem>
                    <MenuItem
                        value={CODE_MIRROR_MODES.GITHUB_FLAVORED_MARKDOWN}
                    >
                        {ViewerConstants.MARKDOWN}
                    </MenuItem>
                    <MenuItem value={CODE_MIRROR_MODES.DOCKERFILE}>
                        {ViewerConstants.DOCKERFILE}
                    </MenuItem>
                    <MenuItem value={CODE_MIRROR_MODES.YAML}>
                        {ViewerConstants.YAML}
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
