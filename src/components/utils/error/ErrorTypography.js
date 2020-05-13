/**
 * @author sriram
 *
 * A typography that displays error message with a button to view details
 *
 */

import React from "react";
import { Typography, useTheme } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { withI18N, getMessage } from "@cyverse-de/ui-lib";
import { injectIntl } from "react-intl";
import messages from "../messages";

function ErrorTypography(props) {
    const { errorMessage, onDetailsClick } = props;
    const theme = useTheme();
    return (
        <Typography color="error" variant="caption">
            {errorMessage}
            {onDetailsClick && (
                <Button
                    variant="outlined"
                    onClick={onDetailsClick}
                    style={{ color: theme.palette.error.main, margin: 1 }}
                    size="small"
                >
                    <Typography
                        variant="caption"
                        style={{ color: theme.palette.error.main }}
                    >
                        {getMessage("viewDetails")}
                    </Typography>
                </Button>
            )}
        </Typography>
    );
}

export default withI18N(injectIntl(ErrorTypography), messages);
