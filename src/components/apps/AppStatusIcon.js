import React from "react";
import { useTranslation } from "i18n";
import PropTypes from "prop-types";

import Disabled from "@material-ui/icons/Block";
import Lock from "@material-ui/icons/Lock";
import ToolTip from "@material-ui/core/Tooltip";

/**
 * @author aramsey
 *
 * An icon used to visually indicate whether an app is private, beta, or disabled
 */

function AppStatusIcon(props) {
    const { isPublic, isDisabled, isBeta, ...custom } = props;
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

export default AppStatusIcon;
