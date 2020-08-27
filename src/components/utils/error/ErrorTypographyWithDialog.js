/**
 * A wrapper component to display an ErrorTypography and a DEErrorDialog.
 *
 * @author psarando
 */
import React from "react";

import ids from "../ids";

import ErrorTypography from "./ErrorTypography";
import DEErrorDialog from "./DEErrorDialog";

const ErrorTypographyWithDialog = ({ errorMessage, errorObject }) => {
    const [errorDialogOpen, setErrorDialogOpen] = React.useState(false);

    return (
        <>
            <ErrorTypography
                errorMessage={errorMessage}
                onDetailsClick={() => setErrorDialogOpen(true)}
            />
            <DEErrorDialog
                open={errorDialogOpen}
                baseId={ids.ERROR_DLG}
                errorObject={errorObject}
                handleClose={() => {
                    setErrorDialogOpen(false);
                }}
            />
        </>
    );
};

export default ErrorTypographyWithDialog;
