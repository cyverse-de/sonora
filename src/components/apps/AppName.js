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
import { ERROR_CODES } from "components/utils/error/errorCode";
import AccessRequestDialog from "components/vice/AccessRequestDialog";

import { Highlighter } from "@cyverse-de/ui-lib";
import { useAppLaunchLink } from "./utils";
import { Button, Link as MuiLink, Typography } from "@material-ui/core";
import DEDialog from "components/utils/DEDialog";
import RunError from "./RunError";

function RunErrorDialog(props) {
    const { baseId, code, open, onClose } = props;
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
                <RunError code={code} />
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
    const [accessRequestDialogOpen, setAccessRequestDialogOpen] = useState(
        false
    );
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const [href, as] = useAppLaunchLink(systemId, appId);
    const { t } = useTranslation("apps");

    useEffect(() => {
        if (!limitChecks?.canRun) {
            setRunErrorCodes(limitChecks?.results[0].reasonCodes);
        }
    }, [limitChecks]);

    let title = "";
    if (isDisabled) {
        title = t("disabledAppTooltip");
    } else {
        title = t("useAppTooltip");
    }

    if (!isDisabled && limitChecks?.canRun) {
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
        if (runErrorCodes[0] === ERROR_CODES.ERR_PERMISSION_NEEDED) {
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
                        baseId={baseDebugId}
                        onClose={() => setAccessRequestDialogOpen(false)}
                    />
                </>
            );
        } else if (
            runErrorCodes[0] === ERROR_CODES.ERR_LIMIT_REACHED ||
            runErrorCodes[0] === ERROR_CODES.ERR_FORBIDDEN
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
                        baseId={baseDebugId}
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
