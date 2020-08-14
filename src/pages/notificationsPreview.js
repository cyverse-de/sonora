/**
 * @author Flynn Gaur
 *
 */

import React, { Component } from "react";
import ids from "./notificationsIDs"
import { withStyles } from "@material-ui/core";
import NotificationMenu from "./components/NotificationsMenu";
import NotificationStyles from "./NotificationStyles";

class NotificationsPreview extends Component {
    
    render() {
        const baseId = ids.MAIN_PAGE,
            classes = this.props.classes;

        return (
            <header id={baseId}>
                <div>
                   <NotificationMenu/>
                </div>
            </header>
        );
    }
}

export default (withStyles(NotificationStyles)(NotificationsPreview));