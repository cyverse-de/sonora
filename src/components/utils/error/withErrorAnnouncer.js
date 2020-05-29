/**
 * @author aramsey, sriram
 *
 * A HOC to enable wrapped components to display an error announcer
 * by invoking the `showErrorAnnouncer` function (which is passed to them
 * as a prop). The error announcer has a button to open and display
 * an error dialog with error details.
 */
import React, { useCallback, useState } from "react";

import {
    announce,
    AnnouncerConstants,
    formatMessage,
    withI18N,
} from "@cyverse-de/ui-lib";
import { Button, Typography, useTheme } from "@material-ui/core";
import { injectIntl } from "react-intl";

import DEErrorDialog from "./DEErrorDialog";
import ids from "../ids";
import messages from "../messages";

const withErrorAnnouncer = (WrappedComponent) =>
    withI18N(
        injectIntl((props) => {
            const theme = useTheme();
            const { intl } = props;

            const [errorDialogOpen, setErrorDialogOpen] = useState(false);
            const [errorObject, setErrorObject] = useState(null);

            const viewErrorDetails = useCallback(
                () => (
                    <Button
                        variant="outlined"
                        onClick={() => setErrorDialogOpen(true)}
                    >
                        <Typography
                            variant="button"
                            style={{ color: theme.palette.error.contrastText }}
                        >
                            {formatMessage(intl, "details")}
                        </Typography>
                    </Button>
                ),
                [intl, theme.palette.error.contrastText]
            );

            const showErrorAnnouncer = (text, error) => {
                setErrorObject(error);
                announce({
                    text,
                    variant: AnnouncerConstants.ERROR,
                    CustomAction: viewErrorDetails,
                });
            };

            return (
                <>
                    <WrappedComponent
                        {...props}
                        showErrorAnnouncer={showErrorAnnouncer}
                    />
                    <DEErrorDialog
                        open={errorDialogOpen}
                        baseId={ids.ERROR_DLG}
                        errorObject={errorObject}
                        handleClose={() => {
                            setErrorDialogOpen(false);
                            setErrorObject(null);
                        }}
                    />
                </>
            );
        }),
        messages
    );

export default withErrorAnnouncer;
