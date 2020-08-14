/**
 *
 * Display search error.
 *
 * @author sriram
 *
 */

import React from "react";
import { useTranslation } from "i18n";
import DEErrorDialog from "components/utils/error/DEErrorDialog";
import ErrorTypography from "components/utils/error/ErrorTypography";

export default function SearchError(props) {
    const {error, baseId} = props;
    const { t } = useTranslation(["search"]);
    const [errorDialogOpen, setErrorDialogOpen] = React.useState(false);

    return (
        <>
            <ErrorTypography
                errorMessage={
                    error.message ||
                    t("errorSearch")
                }
                onDetailsClick={() => setErrorDialogOpen(true)}
            />
            <DEErrorDialog
                open={errorDialogOpen}
                baseId={baseId}
                errorObject={error}
                handleClose={() => {
                    setErrorDialogOpen(false);
                }}
            />
        </>
    );
};