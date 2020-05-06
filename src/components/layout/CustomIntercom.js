/**
 *  @author sriram
 *  A custom widget for intercom support
 *
 *
 */

import React from "react";

import ids from "./ids";
import { formatMessage } from "@cyverse-de/ui-lib";

import { useIntercom } from "../../contexts/intercom";
import { intercomLogin, intercomLogout } from "../../common/intercom";
import { useUserProfile } from "../../contexts/userProfile";

import { Badge, IconButton, Tooltip, useTheme } from "@material-ui/core";
import LiveHelpIcon from "@material-ui/icons/LiveHelp";

function CustomIntercom({ intl }) {
    const {
        appId,
        enabled,
        companyId,
        companyName,
        unReadCount,
    } = useIntercom();
    const [userProfile] = useUserProfile();
    const theme = useTheme();

    React.useEffect(() => {
        if (userProfile?.id) {
            if (enabled) {
                intercomLogin(
                    userProfile.id,
                    userProfile.attributes.email,
                    appId,
                    companyId,
                    companyName
                );
            }

            return () => {
                intercomLogout();
            };
        }
    }, [userProfile, appId, enabled, companyId, companyName]);

    if (enabled) {
        return (
            <Tooltip
                title={formatMessage(intl, "intercomAriaLabel")}
                placement="bottom"
                arrow
            >
                <IconButton
                    id={ids.INTERCOM_WIDGET}
                    style={{ color: theme.palette.primary.contrastText }}
                    aria-label={formatMessage(intl, "intercomAriaLabel")}
                >
                    <Badge badgeContent={unReadCount} color="error">
                        <LiveHelpIcon />
                    </Badge>
                </IconButton>
            </Tooltip>
        );
    } else {
        return null;
    }
}

export default CustomIntercom;
