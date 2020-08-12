import React from "react";
import {
    BarChart,
    FolderOpen,
    Replay,
    Info,
    Stop,
    People,
} from "@material-ui/icons";
import { formatDate } from "@cyverse-de/ui-lib";

import * as constants from "../constants";

import ItemBase, { ItemAction, MenuAction } from "./ItemBase";

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
        return item
            .addActions([
                <ItemAction
                    ariaLabel="relaunch"
                    key={`${constants.KIND_ANALYSES}-${props.content.id}-relaunch`}
                    tooltipKey="relaunchAction"
                >
                    <Replay />
                </ItemAction>,
                <ItemAction
                    ariaLabel="go to output files"
                    key={`${constants.KIND_ANALYSES}-${props.content.id}-outputs`}
                    tooltipKey="outputAction"
                >
                    <FolderOpen />
                </ItemAction>,
            ])
            .addMenuActions([
                <MenuAction
                    ariaLabel="stop"
                    key={`${constants.KIND_ANALYSES}-${props.content.id}-stop`}
                    tooltipKey="stopAction"
                >
                    <Stop />
                </MenuAction>,
                <MenuAction
                    ariaLabel="open details"
                    key={`${constants.KIND_ANALYSES}-${props.content.id}-details`}
                    tooltipKey="detailsAction"
                >
                    <Info />
                </MenuAction>,
                <MenuAction
                    ariaLabel="share"
                    key={`${constants.KIND_ANALYSES}-${props.content.id}-share`}
                    tooltipKey="shareAction"
                >
                    <People />
                </MenuAction>,
            ]);
    }

    getOrigination(t) {
        const origination = t("startedBy");
        const date = new Date(this.content.start_date);

        return [origination, formatDate(date.valueOf())];
    }

    getAvatarIcon(classes) {
        return (
            <BarChart
                color="primary"
                classes={{ colorPrimary: classes.avatarIcon }}
            />
        );
    }

    getLinkTarget() {
        return `/analyses/${this.content.id}/details`;
    }
}

export default AnalysisItem;
