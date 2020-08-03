import React from "react";
import {
    Twitter,
    Facebook,
    OpenInBrowser,
    Link,
    RssFeed,
} from "@material-ui/icons";
import { formatDate } from "@cyverse-de/ui-lib";

import * as fns from "../Dashboard/functions";
import * as constants from "../Dashboard/constants";

import ItemBase, { ItemAction, DashboardFeedItem } from "./ItemBase";

class NewsItem extends ItemBase {
    constructor({ section, content, height, width, classes }) {
        super({
            kind: constants.KIND_FEEDS,
            content,
            section,
            height,
            width,
            classes,
        });
    }

    static create(props) {
        const item = new NewsItem(props);
        return item
            .addActions([
                <ItemAction
                    ariaLabel="tweet"
                    key={`${constants.KIND_FEEDS}-${props.content.id}-tweet`}
                >
                    <Twitter />
                </ItemAction>,
                <ItemAction
                    ariaLabel="facebook"
                    key={`${constants.KIND_FEEDS}-${props.content.id}-facebook`}
                >
                    <Facebook />
                </ItemAction>,
                <ItemAction
                    ariaLabel="open"
                    key={`${constants.KIND_FEEDS}-${props.content.id}-open`}
                >
                    <OpenInBrowser />
                </ItemAction>,
                <ItemAction
                    ariaLabel="show link"
                    key={`${constants.KIND_FEEDS}-${props.content.id}-link`}
                >
                    <Link />
                </ItemAction>,
            ])
            .setSectionClass();
    }

    getOrigination(t) {
        const origination = t("publishedBy");
        const date = new Date(this.content.date_added);
        return [origination, formatDate(date.valueOf())];
    }

    getAvatarIcon() {
        if (!this.headerClass || this.avatarClass) {
            this.setSectionClass();
        }
        return (
            <RssFeed
                color="primary"
                classes={{ colorPrimary: this.avatarClass }}
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
