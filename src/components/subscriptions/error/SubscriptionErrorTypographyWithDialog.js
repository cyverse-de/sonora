/**
 * A wrapper component to display an ErrorTypography and a DEErrorDialog.
 *
 * @author sboleyn
 */
import React from "react";

import ids from "../ids";

import ErrorTypography from "../../error/ErrorTypography";
import SubscriptionErrorDialog from "./SubscriptionErrorDialog";

import buildID from "components/utils/DebugIDUtil";
import { trackIntercomEvent, IntercomEvents } from "common/intercom";

const SubscriptionErrorTypographyWithDialog = ({
    baseId,
    errorMessage,
    errorObject,
}) => {
    const [errorDialogOpen, setErrorDialogOpen] = React.useState(false);
    trackIntercomEvent(IntercomEvents.ENCOUNTERED_ERROR, errorObject);
    return (
        <>
            <ErrorTypography
                errorMessage={errorMessage}
                onDetailsClick={() => setErrorDialogOpen(true)}
            />
            <SubscriptionErrorDialog
                open={errorDialogOpen}
                baseId={buildID(baseId, ids.ERROR_DLG)}
                errorObject={errorObject}
                handleClose={() => {
                    setErrorDialogOpen(false);
                }}
            />
        </>
    );
};

export default SubscriptionErrorTypographyWithDialog;
