import React from "react";
import {
    Twitter,
    Facebook,
    OpenInBrowser,
    Link,
    CalendarToday,
    Event,
} from "@mui/icons-material";
import { formatDate } from "components/utils/DateFormatter";

import * as fns from "../functions";
import * as constants from "../constants";

import ItemBase, { ItemAction, DashboardFeedItem } from "./ItemBase";

class EventItem extends ItemBase {
    constructor({ section, content, height, width, config }) {
        super({
            kind: constants.KIND_EVENTS,
            content,
            section,
            height,
            width,
            config,
        });
    }

    static create(props) {
        const item = new EventItem(props);
        const { t } = props;
        return item.addActions([
            <ItemAction
                ariaLabel={t("tweetAria")}
                key={`${constants.KIND_EVENTS}-${props.content.id}-tweet`}
            >
                <Twitter />
            </ItemAction>,
            <ItemAction
                ariaLabel={t("facebookAria")}
                key={`${constants.KIND_EVENTS}-${props.content.id}-facebook`}
            >
                <Facebook />
            </ItemAction>,
            <ItemAction
                ariaLabel={t("openAria")}
                key={`${constants.KIND_EVENTS}-${props.content.id}-open`}
            >
                <OpenInBrowser />
            </ItemAction>,
            <ItemAction
                ariaLabel={t("showLinkAria")}
                key={`${constants.KIND_EVENTS}-${props.content.id}-link`}
            >
                <Link />
            </ItemAction>,
            <ItemAction
                ariaLabel={t("addToCalendarAria")}
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
