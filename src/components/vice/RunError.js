/**
 * Return a Translation component based on the App launch run error code.
 *
 * @author sriram, psarando
 */
import React from "react";
import { Trans, useTranslation } from "i18n";
import { intercomShow } from "common/intercom";
import { ERROR_CODES } from "components/error/errorCode";
import { Link } from "@mui/material";

const SupportLink = (props) => (
    <Link
        variant="body1"
        component="button"
        onClick={intercomShow}
        {...props}
        underline="hover"
    />
);

export default function RunError(props) {
    const { code, runningJobs, viceQuota } = props;
    const { t } = useTranslation("launch");
    if (code === ERROR_CODES.ERR_LIMIT_REACHED) {
        return (
            <Trans
                t={t}
                i18nKey="jobLimitReachedPrompt"
                values={{ current: runningJobs, quota: viceQuota }}
                components={{
                    b: <b />,
                    br: <br />,
                    support: <SupportLink />,
                }}
            />
        );
    } else if (code === ERROR_CODES.ERR_FORBIDDEN) {
        return (
            <Trans
                t={t}
                i18nKey="launchForbiddenPrompt"
                components={{
                    support: <SupportLink />,
                }}
            />
        );
    }
    return null;
}
