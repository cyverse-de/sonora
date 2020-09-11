/**
 * @author Flynn Gaur
 *
 */

import React, { Component } from "react";
import ids from "./notificationsIDs";
import { withStyles } from "@material-ui/core";
import NotificationMenu from "./NotificationsMenu";
import { formatDistance, compareAsc } from 'date-fns';
import PropTypes from "prop-types";
import NotificationStyles from "./NotificationStyles";
import {
    build,
    DEHyperlink,
    getMessage,
    LoadingMask,
    withI18N,
} from "@cyverse-de/ui-lib";

class NotificationsPreview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null,
            notifications: {},
            unSeenCount: 0,
            notificationLoading: false,
            error: false,
        };
    }

    render() {
        const baseId = ids.MAIN_PAGE;

            const {
            notifications,
            unSeenCount,
            classes,
            notificationLoading,
            notificationError,
        } = this.state;

        return (
            <React.Fragment>
                <div>
                    <NotificationMenu
                        notifications={notifications}
                        unSeenCount={unSeenCount}
                        error={notificationError}
                        notificationLoading={notificationLoading}
                    />
                </div>
              </React.Fragment>
        );
    }
}

NotificationsPreview.propTypes = {
    // presenter: PropTypes
    handleNotificationsClick: PropTypes.func,
    onViewAllNotificationsClicked: PropTypes.func,
    onMenuItemSelect: PropTypes.func,
    unSeenCount: PropTypes.number,
    error: PropTypes.bool,
    handleClose: PropTypes.func,
    classes: PropTypes.object.isRequired,

};

export default withStyles(NotificationStyles)(NotificationsPreview);
