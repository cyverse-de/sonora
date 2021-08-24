/**
 * A component for displaying helpful messages in the final step.
 *
 * @author psarando
 */
import React from "react";

import { useTranslation } from "i18n";

import { Typography } from "@material-ui/core";

export default function CompletionHelp(props) {
    const { dirty, hasErrors, hasTool } = props;

    const { t } = useTranslation("app_editor");

    if (hasErrors) {
        return <Typography>{t("formHasErrors")}</Typography>;
    }

    if (dirty) {
        return (
            <>
                {!hasTool && <Typography>{t("noToolWarning")}</Typography>}
                <Typography>{t("formNotSaved")}</Typography>
            </>
        );
    }

    if (!hasTool) {
        return <Typography>{t("noToolWarning")}</Typography>;
    }

    return <Typography>{t("appSavedSuggestions")}</Typography>;
}
