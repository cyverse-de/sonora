/**
 * A component that displays app's name.
 *
 * @author sriram
 */
import React, { useEffect, useState } from "react";
import { useTranslation } from "i18n";
import PropTypes from "prop-types";

import Link from "next/link";
import DELink from "components/utils/DELink";
import { ERROR_CODES } from "components/error/errorCode";
import AccessRequestDialog from "components/vice/AccessRequestDialog";

import { useUserProfile } from "contexts/userProfile";
import DEDialog from "components/utils/DEDialog";
import RunError from "./RunError";
import { useAppLaunchLink } from "./utils";
import ids from "./ids";

import Highlighter from "components/highlighter/Highlighter";
import { Button, Link as MuiLink, Typography } from "@material-ui/core";

function RunErrorDialog(props) {
    const { baseId, code, open, viceQuota, runningJobs, onClose } = props;
    const { t } = useTranslation("launch");
    const { t: i18Common } = useTranslation("common");
    let title;
    if (code === ERROR_CODES.ERR_LIMIT_REACHED) {
        title = t("jobLimitReached");
    } else if (code === ERROR_CODES.ERR_FORBIDDEN) {
        title = t("accessDenied");
    }
    return (
        <DEDialog
            baseId={baseId}
            title={title}
            open={open}
            actions={
                <Button color="primary" onClick={onClose}>
                    {i18Common("ok")}
                </Button>
            }
            onClose={onClose}
        >
            <Typography>
                <RunError
                    code={code}
                    viceQuota={viceQuota}
                    runningJobs={runningJobs}
                />
            </Typography>
        </DEDialog>
    );
}

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
    const [runErrorCodes, setRunErrorCodes] = useState(null);
    const [userProfile] = useUserProfile();
    const [viceQuota, setViceQuota] = useState();
    const [runningJobs, setRunningJobs] = useState();
    const [accessRequestDialogOpen, setAccessRequestDialogOpen] =
        useState(false);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const [href, as] = useAppLaunchLink(systemId, appId);
    const { t } = useTranslation("apps");

    useEffect(() => {
        if (limitChecks && !limitChecks.canRun) {
            setRunErrorCodes(limitChecks.results[0]?.reasonCodes);
            setViceQuota(limitChecks.results[0]?.additionalInfo?.maxJobs);
            setRunningJobs(limitChecks.results[0]?.additionalInfo?.runningJobs);
        }
    }, [limitChecks]);

    let title = "";
    if (isDisabled) {
        title = t("disabledAppTooltip");
    } else {
        title = t("useAppTooltip");
    }

    if ((!isDisabled && limitChecks?.canRun) || !userProfile?.id) {
        return (
            <Link href={href} as={as} passHref>
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
            return (
                <>
                    <MuiLink
                        component="button"
                        href="#"
                        onClick={() => setAccessRequestDialogOpen(true)}
                        color="primary"
                    >
                        {name}
                    </MuiLink>
                    <AccessRequestDialog
                        open={accessRequestDialogOpen}
                        baseId={ids.ACCESS_REQUEST_DLG}
                        onClose={() => setAccessRequestDialogOpen(false)}
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
                <Highlighter search={searchTerm}>{name}</Highlighter>
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
