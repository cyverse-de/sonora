/**
 * @author aramsey, sriram
 *
 * A HOC to enable wrapped components to display an error announcer
 * by invoking the `showErrorAnnouncer` function (which is passed to them
 * as a prop). The error announcer has a button to open and display
 * an error dialog with error details.
 */
import React, { useCallback, useState } from "react";

import { useTranslation } from "react-i18next";

import { announce, AnnouncerConstants } from "@cyverse-de/ui-lib";
import { Button, Typography, useTheme } from "@material-ui/core";

import DEErrorDialog from "./DEErrorDialog";
import ids from "../ids";

const withErrorAnnouncer = (WrappedComponent) => {
    const WithErrorAnnouncerComponent = (props) => {
        const theme = useTheme();
        const { t } = useTranslation("util");

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
                        {t("details")}
                    </Typography>
                </Button>
            ),
            [t, theme.palette.error.contrastText]
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
    };
    return WithErrorAnnouncerComponent;
};

export default withErrorAnnouncer;
