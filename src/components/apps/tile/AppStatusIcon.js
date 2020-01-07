import React from "react";
import PropTypes from "prop-types";

import betaPng from "./betaSymbol.png";
import betaSvg from "./betaSymbol.svg";
import messages from "./messages";
import withI18N, { getMessage } from "../../util/I18NWrapper";

import Disabled from "@material-ui/icons/Block";
import Lock from "@material-ui/icons/Lock";
import ToolTip from "@material-ui/core/Tooltip";
import palette from "../../util/CyVersePalette";

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
    return (
        <ToolTip title={getMessage("privateAppTooltip")}>
            <Lock {...props} style={{ color: palette.blue }} />
        </ToolTip>
    );
}

function DisabledIcon(props) {
    return (
        <ToolTip title={getMessage("disabledAppTooltip")}>
            <Disabled {...props} style={{ color: palette.red }} />
        </ToolTip>
    );
}

function BetaIcon(props) {
    return (
        <ToolTip title={getMessage("betaAppTooltip")}>
            <img src={betaSvg} alt={betaPng} />
        </ToolTip>
    );
}

export default withI18N(AppStatusIcon, messages);
