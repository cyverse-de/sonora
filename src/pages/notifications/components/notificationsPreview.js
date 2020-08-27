/**
 * @author Flynn Gaur
 *
 */

import React, { Component } from "react";
import ids from "./notificationsIDs";
import { withStyles } from "@material-ui/core";
import NotificationMenu from "./NotificationsMenu";
import NotificationStyles from "./NotificationStyles";

class NotificationsPreview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null,
        };
        this.handleNotificationsClick = this.handleNotificationsClick.bind(
            this
        );
        this.onMenuItemSelect = this.onMenuItemSelect.bind(this);
        this.notificationBtn = React.createRef();
    }

    handleNotificationsClick() {
        this.setState({ anchorEl: document.getElementById(this.props.anchor) });
        const { unSeenCount, markAllAsSeen } = this.props;
        //if unseencount < 10, mark them as read
        if (unSeenCount > 0 && unSeenCount < 10) {
            markAllAsSeen(false);
        }
    }

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    onMenuItemSelect(event) {
        // this.props.notificationClicked(event.currentTarget.id);
        this.handleClose();
    }

    render() {
        const baseId = ids.MAIN_PAGE;

        return (
            <header id={baseId}>
                <div>
                    <NotificationMenu />
                </div>
            </header>
        );
    }
}
//
// NotificationsPreview.propTypes = {
//     presenter
//     classes: PropTypes.object.isRequired,
// };

export default withStyles(NotificationStyles)(NotificationsPreview);
