/**
 * @author psarando
 */
import React from "react";

import { useTranslation } from "i18n";
import ids from "./ids";
import buildID from "components/utils/DebugIDUtil";
import {
    Button,
    IconButton,
    Tooltip,
    useMediaQuery,
    useTheme,
} from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";

const SaveButton = (props) => {
    const { baseId, onSave, ...custom } = props;

    const { t } = useTranslation("common");
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

    const buttonId = buildID(baseId, ids.SAVE_BTN);

    return isSmall ? (
        <Tooltip title={t("save")} placement="bottom" enterDelay={200}>
            <span>
                <IconButton
                    id={buttonId}
                    aria-label={t("save")}
                    onClick={onSave}
                    color="primary"
                    {...custom}
                >
                    <SaveIcon />
                </IconButton>
            </span>
        </Tooltip>
    ) : (
        <Button
            id={buttonId}
            onClick={onSave}
            color="primary"
            variant="contained"
            startIcon={<SaveIcon />}
            {...custom}
        >
            {t("save")}
        </Button>
    );
};

export default SaveButton;
