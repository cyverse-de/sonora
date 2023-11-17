/**
 * @author sriram, psarando
 *
 * A typography that displays an error message with a button to view details.
 *
 */

import React from "react";

import { useTranslation } from "i18n";

import { Button, Typography, useTheme } from "@mui/material";

function ErrorTypography(props) {
    const { errorMessage, onDetailsClick } = props;
    const theme = useTheme();
    const { t } = useTranslation("util");

    return (
        <Typography color="error" variant="caption">
            {errorMessage}
            {onDetailsClick && (
                <Button
                    variant="outlined"
                    onClick={onDetailsClick}
                    style={{ marginLeft: theme.spacing(1) }}
                    size="small"
                >
                    <Typography color="error" variant="caption">
                        {t("viewDetails")}
                    </Typography>
                </Button>
            )}
        </Typography>
    );
}

export default ErrorTypography;
