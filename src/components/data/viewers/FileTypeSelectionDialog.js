/**
 * @author sriram
 *
 * A dialog that allows users to select the type of file they would to create
 *
 */
import React, { useState } from "react";
import { useTranslation } from "i18n";
import { build } from "@cyverse-de/ui-lib";
import ids from "./ids";
import DEDialog from "components/utils/DEDialog";
import {
    Button,
    Select,
    InputLabel,
    FormControl,
    MenuItem,
} from "@material-ui/core";

export default function FileTypeSelectionDialog(props) {
    const { open, onFileTypeSelected, onClose } = props;

    const [type, setType] = useState("Plain Text");

    const { t } = useTranslation("data");
    const { t: i18nCommon } = useTranslation("common");

    const baseId = "fileType";

    const handleChange = (event) => {
        setType(event.target.value);
    };

    return (
        <DEDialog
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
                        id={build(baseId, ids.MOVE_BTN)}
                        color="primary"
                        onClick={() => onFileTypeSelected(type)}
                    >
                        {i18nCommon("create")}
                    </Button>
                </>
            }
        >
            <FormControl style={{ width: "95%" }}>
                <InputLabel id="demo-simple-select-label">
                    Select file type
                </InputLabel>
                <Select
                    id="demo-simple-select"
                    value={type}
                    onChange={handleChange}
                >
                    <MenuItem value="">Plain Text</MenuItem>
                    <MenuItem value="csv">CSV</MenuItem>
                    <MenuItem value="tsv">TSV</MenuItem>
                    <MenuItem value="r">R</MenuItem>
                    <MenuItem value="python">Python</MenuItem>
                    <MenuItem value="gfm">Markdown</MenuItem>
                    <MenuItem value="dockerfile">Dockerfile</MenuItem>
                    <MenuItem value="ht-analysis-path-list">
                        HT analysis path list
                    </MenuItem>
                    <MenuItem value="multi-input-path-list">
                        Multi-Input path list
                    </MenuItem>
                </Select>
            </FormControl>
        </DEDialog>
    );
}
