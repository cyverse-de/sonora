/**
 * A component that displays app's name.
 *
 * @author sriram, psarando
 */
import React, { useState } from "react";
import { useTranslation } from "i18n";
import PropTypes from "prop-types";

import Link from "next/link";
import DELink from "components/utils/DELink";
import { ERROR_CODES } from "components/error/errorCode";
import AccessRequestDialog from "components/vice/AccessRequestDialog";
import RunErrorDialog from "components/vice/RunErrorDialog";
import VicePendingRequestDlg from "components/vice/VicePendingRequestDlg";

import { useUserProfile } from "contexts/userProfile";
import { useAppLaunchLink } from "./utils";
import ids from "./ids";

import Highlighter from "components/highlighter/Highlighter";
import { Link as MuiLink } from "@mui/material";

function AppName(props) {
    const {
        baseDebugId,
        isDisabled,
        name,
        appId,
        systemId,
        searchTerm,
        limitChecks,
    } = props;
    const [userProfile] = useUserProfile();
    const [accessRequestDialogOpen, setAccessRequestDialogOpen] =
        useState(false);
    const [pendingRequestDlgOpen, setPendingRequestDlgOpen] = useState(false);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const [href, as] = useAppLaunchLink(systemId, appId);
    const { t } = useTranslation("apps");

    let runErrorCodes;
    let viceQuota;
    let runningJobs;

    if (limitChecks?.results) {
        runErrorCodes = limitChecks.results[0]?.reasonCodes;
        viceQuota = limitChecks.results[0]?.additionalInfo?.maxJobs;
        runningJobs = limitChecks.results[0]?.additionalInfo?.runningJobs;
    }

    let title = "";
    if (isDisabled) {
        title = t("disabledAppTooltip");
    } else {
        title = t("useAppTooltip");
    }

    if ((!isDisabled && limitChecks?.canRun) || !userProfile?.id) {
        return (
            <Link href={href} as={as} passHref legacyBehavior>
                <DELink
                    text={name}
                    id={baseDebugId}
                    title={title}
                    searchTerm={searchTerm}
                />
            </Link>
        );
    } else if (runErrorCodes?.length > 0) {
        const runErrorCode = runErrorCodes[0];
        if (runErrorCode === ERROR_CODES.ERR_PERMISSION_NEEDED) {
            const hasPendingRequest =
                limitChecks?.results[0]?.additionalInfo?.pendingRequest;

            return (
                <>
                    <MuiLink
                        component="button"
                        href="#"
                        onClick={() => {
                            hasPendingRequest
                                ? setPendingRequestDlgOpen(true)
                                : setAccessRequestDialogOpen(true);
                        }}
                        color="primary"
                        underline="hover"
                    >
                        {name}
                    </MuiLink>
                    <AccessRequestDialog
                        open={accessRequestDialogOpen}
                        baseId={ids.ACCESS_REQUEST_DLG}
                        onClose={() => setAccessRequestDialogOpen(false)}
                    />
                    <VicePendingRequestDlg
                        open={pendingRequestDlgOpen}
                        onClose={() => setPendingRequestDlgOpen(false)}
                    />
                </>
            );
        } else if (
            runErrorCode === ERROR_CODES.ERR_LIMIT_REACHED ||
            runErrorCode === ERROR_CODES.ERR_FORBIDDEN
        ) {
            return (
                <>
                    <MuiLink
                        component="button"
                        href="#"
                        onClick={() => setErrorDialogOpen(true)}
                        color="primary"
                        underline="hover"
                    >
                        {name}
                    </MuiLink>
                    <RunErrorDialog
                        open={errorDialogOpen}
                        code={runErrorCodes[0]}
                        onClose={() => setErrorDialogOpen(false)}
                        baseId={ids.RUN_ERROR_DLG}
                        viceQuota={viceQuota}
                        runningJobs={runningJobs}
                    />
                </>
            );
        }
    } else {
        return (
            <div tabIndex="0" role="button" id={baseDebugId} title={title}>
                <Highlighter search={searchTerm || ""}>{name}</Highlighter>
            </div>
        );
    }
}
AppName.propTypes = {
    isDisabled: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    onAppNameClicked: PropTypes.func,
    searchText: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.instanceOf(RegExp),
    ]),
};
export default AppName;
