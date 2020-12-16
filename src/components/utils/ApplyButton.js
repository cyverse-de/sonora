/**
 * @author psarando
 */
import React from "react";

import { useTranslation } from "i18n";
import ids from "./ids";

import { build } from "@cyverse-de/ui-lib";
import {
    Button,
    IconButton,
    Tooltip,
    useMediaQuery,
    useTheme,
} from "@material-ui/core";
import ApplyIcon from "@material-ui/icons/Done";

const ApplyButton = (props) => {
    const { baseId, applyDisabled, onApply, ...custom } = props;

    const { t } = useTranslation("common");
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

    const buttonId = build(baseId, ids.SAVE_BTN);

    return isSmall ? (
        <Tooltip title={t("apply")} placement="bottom" enterDelay={200}>
            <span>
                <IconButton
                    id={buttonId}
                    aria-label={t("apply")}
                    disabled={applyDisabled}
                    onClick={onApply}
                    color="primary"
                    {...custom}
                >
                    <ApplyIcon />
                </IconButton>
            </span>
        </Tooltip>
    ) : (
        <Button
            id={buttonId}
            disabled={applyDisabled}
            onClick={onApply}
            color="primary"
            variant="contained"
            startIcon={<ApplyIcon />}
            {...custom}
        >
            {t("apply")}
        </Button>
    );
};

export default ApplyButton;
