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

import { Badge, IconButton } from "@material-ui/core";
import LiveHelpIcon from "@material-ui/icons/LiveHelp";

function CustomIntercom({ intl, classes }) {
    const {
        appId,
        enabled,
        companyId,
        companyName,
        unReadCount,
    } = useIntercom();
    const [userProfile] = useUserProfile();

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
            <IconButton
                className={classes.appBarIcon}
                id={ids.INTERCOM_WIDGET}
                color="primary"
                aria-label={formatMessage(intl, "intercomAriaLabel")}
                aria-controls={formatMessage(intl, "intercomAriaControl")}
                size="small"
            >
                <Badge badgeContent={unReadCount} color="error">
                    <LiveHelpIcon />
                </Badge>
            </IconButton>
        );
    } else {
        return null;
    }
}

export default CustomIntercom;
