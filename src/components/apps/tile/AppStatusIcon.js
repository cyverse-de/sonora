import React from "react";
import PropTypes from "prop-types";
import messages from "./messages";

import Disabled from "@material-ui/icons/Block";
import Lock from "@material-ui/icons/Lock";
import ToolTip from "@material-ui/core/Tooltip";
import { withI18N, getMessage } from "@cyverse-de/ui-lib";
import { useTheme } from "@material-ui/core";

/**
 * @author aramsey
 *
 * An icon used to visually indicate whether an app is private, beta, or disabled
 */

function AppStatusIcon(props) {
    const { isPublic, isDisabled, isBeta, ...custom } = props;
    const isPrivate = !isPublic;

    if (isPrivate) {
        return <PrivateIcon {...custom} />;
    }
    if (isDisabled) {
        return <DisabledIcon {...custom} />;
    }
    if (isBeta) {
        return <BetaIcon {...custom} />;
    }
    return null;
}

AppStatusIcon.propTypes = {
    isPublic: PropTypes.bool.isRequired,
    isDisabled: PropTypes.bool.isRequired,
    isBeta: PropTypes.bool.isRequired,
};

function PrivateIcon(props) {
    const theme = useTheme();

    return (
        <ToolTip title={getMessage("privateAppTooltip")}>
            <Lock {...props} style={{ color: theme.palette.primary }} />
        </ToolTip>
    );
}

function DisabledIcon(props) {
    const theme = useTheme();

    return (
        <ToolTip title={getMessage("disabledAppTooltip")}>
            <Disabled {...props} style={{ color: theme.palette.error }} />
        </ToolTip>
    );
}

function BetaIcon(props) {
    return (
        <ToolTip title={getMessage("betaAppTooltip")}>
            <img src="/betaSymbol.svg" alt="/betaSymbol.png" />
        </ToolTip>
    );
}

export default withI18N(AppStatusIcon, messages);
