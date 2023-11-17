import React from "react";
import { useTranslation } from "i18n";
import PropTypes from "prop-types";

import DeletedIcon from "@mui/icons-material/Delete";
import Disabled from "@mui/icons-material/Block";
import Lock from "@mui/icons-material/Lock";
import VerifiedUser from "@mui/icons-material/VerifiedUser";
import ToolTip from "@mui/material/Tooltip";
import { useTheme } from "@mui/material";

/**
 * @author aramsey
 *
 * An icon used to visually indicate whether an app is private, beta, or disabled
 */

function AppStatusIcon(props) {
    const { isPublic, isDeleted, isDisabled, isBeta, isBlessed, ...custom } =
        props;
    const theme = useTheme();
    const isPrivate = !isPublic;

    if (isDeleted) {
        return <DeletedIcon {...custom} color="error" />;
    }
    if (isDisabled) {
        return <DisabledIcon {...custom} color="error" />;
    }
    if (isPrivate) {
        return <PrivateIcon {...custom} color="primary" />;
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
