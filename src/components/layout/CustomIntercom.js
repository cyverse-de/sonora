/**
 *  @author sriram
 *  A custom widget for intercom support
 *
 *
 */

import React from "react";

import ids from "./ids";

import { withTranslation } from "../../i18n";

import { useConfig } from "../../contexts/config";
import { intercomLogin, intercomLogout } from "../../common/intercom";
import { useUserProfile } from "../../contexts/userProfile";

import { Badge, IconButton, Tooltip, useTheme } from "@material-ui/core";
import LiveHelpIcon from "@material-ui/icons/LiveHelp";

function CustomIntercom(props) {
    const { intercomUnreadCount, t } = props;
    const [userProfile] = useUserProfile();
    const theme = useTheme();
    const [config] = useConfig();

    React.useEffect(() => {
        if (userProfile?.id) {
            if (config?.intercom.enabled) {
                intercomLogin(
                    userProfile.id,
                    userProfile.attributes.email,
                    config.intercom.appId,
                    config.intercom.companyId,
                    config.intercom.companyName
                );
            }

            return () => {
                intercomLogout();
            };
        }
    }, [userProfile, config]);

    if (config?.intercom.enabled) {
        return (
            <Tooltip title={t("intercomAriaLabel")} placement="bottom" arrow>
                <IconButton
                    id={ids.INTERCOM_WIDGET}
                    style={{ color: theme.palette.primary.contrastText }}
                    aria-label={t("intercomAriaLabel")}
                >
                    <Badge badgeContent={intercomUnreadCount} color="error">
                        <LiveHelpIcon />
                    </Badge>
                </IconButton>
            </Tooltip>
        );
    } else {
        return null;
    }
}

export default withTranslation("common")(CustomIntercom);
