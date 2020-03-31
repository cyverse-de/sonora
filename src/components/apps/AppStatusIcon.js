import React from "react";
import PropTypes from "prop-types";
import messages from "./messages";

import Disabled from "@material-ui/icons/Block";
import Lock from "@material-ui/icons/Lock";
import ToolTip from "@material-ui/core/Tooltip";
import { getMessage, withI18N } from "@cyverse-de/ui-lib";

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
    isPublic: PropTypes.bool.isRequired,
    isDisabled: PropTypes.bool.isRequired,
    isBeta: PropTypes.bool.isRequired,
};

function PrivateIcon(props) {
    return (
        <ToolTip title={getMessage("privateAppTooltip")}>
            <Lock {...props} />
        </ToolTip>
    );
}

function DisabledIcon(props) {
    return (
        <ToolTip title={getMessage("disabledAppTooltip")}>
            <Disabled {...props} />
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
