import React from "react";

import * as constants from "../Dashboard/constants";
import * as fns from "../Dashboard/functions";

import ItemBase, { DashboardVideoItem } from "./ItemBase";

class VideoItem extends ItemBase {
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

    getLinkTarget() {
        const [, , videoID] = this.content.id.split(":");
        return `https://www.youtube.com/embed/${videoID}`;
    }

    component(index) {
        return (
            <DashboardVideoItem key={fns.makeID(this.id, index)} item={this} />
        );
    }
}

export default VideoItem;
