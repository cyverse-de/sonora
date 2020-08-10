import React from "react";
import {
    BarChart,
    FolderOpen,
    Replay,
    Info,
    Stop,
    Share,
} from "@material-ui/icons";
import { formatDate } from "@cyverse-de/ui-lib";

import * as constants from "../constants";

import ItemBase, { ItemAction, getSectionClass } from "./ItemBase";

class AnalysisItem extends ItemBase {
    constructor({ section, content, height, width }) {
        super({
            kind: constants.KIND_ANALYSES,
            content,
            section,
            height,
            width,
        });
    }

    static create(props) {
        const item = new AnalysisItem(props);
        return item.addActions([
            <ItemAction
                ariaLabel="relaunch"
                key={`${constants.KIND_ANALYSES}-${props.content.id}-relaunch`}
            >
                <Replay />
            </ItemAction>,
            <ItemAction
                ariaLabel="stop"
                key={`${constants.KIND_ANALYSES}-${props.content.id}-stop`}
            >
                <Stop />
            </ItemAction>,
            <ItemAction
                ariaLabel="open details"
                key={`${constants.KIND_ANALYSES}-${props.content.id}-details`}
            >
                <Info />
            </ItemAction>,
            <ItemAction
                ariaLabel="share"
                key={`${constants.KIND_ANALYSES}-${props.content.id}-share`}
            >
                <Share />
            </ItemAction>,
            <ItemAction
                ariaLabel="go to output files"
                key={`${constants.KIND_ANALYSES}-${props.content.id}-outputs`}
            >
                <FolderOpen />
            </ItemAction>,
        ]);
    }

    getOrigination(t) {
        const origination = t("startedBy");
        const date = new Date(this.content.start_date);

        return [origination, formatDate(date.valueOf())];
    }

    getAvatarIcon(classes) {
        const [, avatarClass] = getSectionClass(this.section, classes);
        return (
            <BarChart color="primary" classes={{ colorPrimary: avatarClass }} />
        );
    }

    getLinkTarget() {
        return `/analyses/${this.content.id}/details`;
    }
}

export default AnalysisItem;
