/**
 * A component for displaying helpful messages as the final step.
 *
 * @author psarando
 */
import React from "react";

import { useTranslation } from "i18n";

import { Typography } from "@material-ui/core";

export default function CompletionHelp(props) {
    const { dirty, hasErrors } = props;

    const { t } = useTranslation("workflows");

    if (hasErrors) {
        return <Typography>{t("formHasErrors")}</Typography>;
    }

    if (dirty) {
        return <Typography>{t("formNotSaved")}</Typography>;
    }

    return <Typography>{t("workflowSavedSuggestions")}</Typography>;
}
