/**
 * A wrapper component to display an ErrorTypography and a DEErrorDialog. A custom error handler can be injected to the dialog.
 *
 * @author psarando
 */
import React from "react";
import PropTypes from "prop-types";

import ids from "../utils/ids";

import ErrorTypography from "./ErrorTypography";
import DEErrorDialog from "./DEErrorDialog";

import buildID from "components/utils/DebugIDUtil";
import { trackIntercomEvent, IntercomEvents } from "common/intercom";

const ErrorTypographyWithDialog = ({
    baseId,
    errorMessage,
    errorObject,
    errorHandler,
}) => {
    const [errorDialogOpen, setErrorDialogOpen] = React.useState(false);
    trackIntercomEvent(IntercomEvents.ENCOUNTERED_ERROR, errorObject);

    return (
        <>
            <ErrorTypography
                errorMessage={errorMessage}
                onDetailsClick={() => setErrorDialogOpen(true)}
            />
            <DEErrorDialog
                open={errorDialogOpen}
                baseId={buildID(baseId, ids.ERROR_DLG)}
                errorHandler={errorHandler}
                errorObject={errorObject}
                handleClose={() => {
                    setErrorDialogOpen(false);
                }}
            />
        </>
    );
};

ErrorTypographyWithDialog.propTypes = {
    baseId: PropTypes.string,
    errorMessage: PropTypes.string.isRequired,
    errorObject: PropTypes.object,
    errorHandler: PropTypes.elementType,
};

export default ErrorTypographyWithDialog;
