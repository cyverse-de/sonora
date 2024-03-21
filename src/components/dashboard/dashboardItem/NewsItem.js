import React from "react";
import {
    Twitter,
    Facebook,
    OpenInBrowser,
    Link,
    RssFeed,
} from "@mui/icons-material";
import { formatDate } from "components/utils/DateFormatter";

import * as fns from "../functions";
import * as constants from "../constants";

import ItemBase, { ItemAction, DashboardFeedItem } from "./ItemBase";

class NewsItem extends ItemBase {
    constructor({ section, content, height, width, config }) {
        super({
            kind: constants.KIND_FEEDS,
            content,
            section,
            height,
            width,
            config,
        });
    }

    static create(props) {
        const item = new NewsItem(props);
        const { t } = props;

        return item.addActions([
            <ItemAction
                ariaLabel={t("tweetAria")}
                key={`${constants.KIND_FEEDS}-${props.content.id}-tweet`}
            >
                <Twitter />
            </ItemAction>,
            <ItemAction
                ariaLabel={t("facebookAria")}
                key={`${constants.KIND_FEEDS}-${props.content.id}-facebook`}
            >
                <Facebook />
            </ItemAction>,
            <ItemAction
                ariaLabel={t("openAria")}
                key={`${constants.KIND_FEEDS}-${props.content.id}-open`}
            >
                <OpenInBrowser />
            </ItemAction>,
            <ItemAction
                ariaLabel={t("showLinkAria")}
                key={`${constants.KIND_FEEDS}-${props.content.id}-link`}
            >
                <Link />
            </ItemAction>,
        ]);
    }

    getOrigination(t) {
        const origination = t("publishedBy");
        const date = new Date(this.content.date_added);
        return [origination, formatDate(date.valueOf())];
    }

    getAvatarIcon(classes) {
        return (
            <RssFeed
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

export default NewsItem;
