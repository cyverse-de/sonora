import React from "react";

import * as constants from "../constants";
import * as fns from "../functions";

import ItemBase, { DashboardVideoItem } from "./ItemBase";
import NavConstants from "../../../common/NavigationConstants";

class VideoItem extends ItemBase {
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

    getLinkTarget() {
        const [, , videoID] = this.content.id.split(":");
        return `${NavConstants.YOUTUBE_EMBED_BASE}/${videoID}`;
    }

    component(index) {
        return (
            <DashboardVideoItem key={fns.makeID(this.id, index)} item={this} />
        );
    }
}

export default VideoItem;
