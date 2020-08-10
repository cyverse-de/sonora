import React from "react";
import {
    Twitter,
    Facebook,
    OpenInBrowser,
    Link,
    CalendarToday,
    Event,
} from "@material-ui/icons";
import { formatDate } from "@cyverse-de/ui-lib";

import * as fns from "../functions";
import * as constants from "../constants";

import ItemBase, { ItemAction, DashboardFeedItem } from "./ItemBase";

class EventItem extends ItemBase {
    constructor({ section, content, height, width }) {
        super({
            kind: constants.KIND_EVENTS,
            content,
            section,
            height,
            width,
        });
    }

    static create(props) {
        const item = new EventItem(props);
        return item.addActions([
            <ItemAction
                ariaLabel="tweet"
                key={`${constants.KIND_EVENTS}-${props.content.id}-tweet`}
            >
                <Twitter />
            </ItemAction>,
            <ItemAction
                ariaLabel="facebook"
                key={`${constants.KIND_EVENTS}-${props.content.id}-facebook`}
            >
                <Facebook />
            </ItemAction>,
            <ItemAction
                ariaLabel="open"
                key={`${constants.KIND_EVENTS}-${props.content.id}-open`}
            >
                <OpenInBrowser />
            </ItemAction>,
            <ItemAction
                ariaLabel="show link"
                key={`${constants.KIND_EVENTS}-${props.content.id}-link`}
            >
                <Link />
            </ItemAction>,
            <ItemAction
                ariaLabel="add to calendar"
                key={`${constants.KIND_EVENTS}-${props.content.id}-calendar`}
            >
                <CalendarToday />
            </ItemAction>,
        ]);
    }

    getOrigination(t) {
        const origination = t("by");
        const date = new Date();
        return [origination, formatDate(date.valueOf())];
    }

    getAvatarIcon(classes) {
        return (
            <Event
                color="primary"
                classes={{ colorPrimary: classes.avatarIcon }}
            />
        );
    }

    component(index) {
        return (
            <DashboardFeedItem key={fns.makeID(this.id, index)} item={this} />
        );
    }
}

export default EventItem;
