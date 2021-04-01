import React from "react";
import { useTranslation } from "i18n";
import PropTypes from "prop-types";

import Disabled from "@material-ui/icons/Block";
import Lock from "@material-ui/icons/Lock";
import VerifiedUser from "@material-ui/icons/VerifiedUser";
import ToolTip from "@material-ui/core/Tooltip";
import { useTheme } from "@material-ui/core";

/**
 * @author aramsey
 *
 * An icon used to visually indicate whether an app is private, beta, or disabled
 */

function AppStatusIcon(props) {
    const { isPublic, isDisabled, isBeta, isBlessed, ...custom } = props;
    const theme = useTheme();
    const isPrivate = !isPublic;

    if (isPrivate) {
        return <PrivateIcon {...custom} color="primary" />;
    }
    if (isDisabled) {
        return <DisabledIcon {...custom} color="error" />;
    }
    if (isBeta) {
        return <BetaIcon {...custom} />;
    }
    if (isBlessed) {
        return (
            <BlessedIcon {...custom} style={{ color: theme.palette.gold }} />
        );
    }
    return null;
}

AppStatusIcon.propTypes = {
    isPublic: PropTypes.bool,
    isDisabled: PropTypes.bool,
    isBeta: PropTypes.bool,
};

function PrivateIcon(props) {
    const { t } = useTranslation("apps");
    return (
        <ToolTip title={t("privateAppTooltip")}>
            <Lock {...props} />
        </ToolTip>
    );
}

function DisabledIcon(props) {
    const { t } = useTranslation("apps");
    return (
        <ToolTip title={t("disabledAppTooltip")}>
            <Disabled {...props} />
        </ToolTip>
    );
}

function BetaIcon(props) {
    const { t } = useTranslation("apps");
    return (
        <ToolTip title={t("betaAppTooltip")}>
            <img src="/betaSymbol.svg" alt="/betaSymbol.png" />
        </ToolTip>
    );
}

function BlessedIcon(props) {
    const { t } = useTranslation("apps");
    return (
        <ToolTip title={t("blessedToolTip")}>
            <VerifiedUser {...props} />
        </ToolTip>
    );
}

export default AppStatusIcon;
