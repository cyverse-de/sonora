/**
 * @author sriram
 *
 * Return a Translation component based on the App launch run error code.
 *
 */
import React from "react";
import { useTranslation } from "i18n";
import { Trans } from "react-i18next";
import { intercomShow } from "common/intercom";
import { ERROR_CODES } from "components/utils/error/errorCode";
import { Link } from "@material-ui/core";

export default function RunError(props) {
    const { code } = props;
    const { t } = useTranslation("launch");
    if (code === ERROR_CODES.ERR_LIMIT_REACHED) {
        return (
            <Trans
                t={t}
                i18nKey="jobLimitReachedPrompt"
                components={{
                    b: <b />,
                    support: (
                        <Link
                            href="#"
                            component="button"
                            onClick={(event) => {
                                // prevent form submission
                                event.preventDefault();
                                intercomShow();
                            }}
                        />
                    ),
                }}
            />
        );
    } else if (code === ERROR_CODES.ERR_FORBIDDEN) {
        return (
            <Trans
                t={t}
                i18nKey="launchForbiddenPrompt"
                components={{
                    support: (
                        <Link
                            href="#"
                            component="button"
                            onClick={(event) => {
                                // prevent form submission
                                event.preventDefault();
                                intercomShow();
                            }}
                        />
                    ),
                }}
            />
        );
    }
    return null;
}
