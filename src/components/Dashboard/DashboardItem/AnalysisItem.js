import React from "react";
import Link from "next/link";
import {
    BarChart,
    Repeat,
    Info,
    Stop,
    People,
    PermMedia,
} from "@material-ui/icons";
import { IconButton } from "@material-ui/core";

import { formatDate } from "@cyverse-de/ui-lib";

import * as constants from "../constants";

import ItemBase, { ItemAction, MenuAction } from "./ItemBase";

import { getFolderPage } from "../../data/utils";

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
                    <Link
                        href="/analyses/[analysisId]/relaunch"
                        as={`/analyses/${item.content.id}/relaunch`}
                    >
                        <IconButton>
                            <Repeat />
                        </IconButton>
                    </Link>
                </ItemAction>,
                <ItemAction
                    ariaLabel="go to output files"
                    key={`${constants.KIND_ANALYSES}-${props.content.id}-outputs`}
                    tooltipKey="outputAction"
                >
                    <Link
                        href="/data/ds/[...pathItems]"
                        as={getFolderPage(item.content["result_folder_path"])}
                    >
                        <IconButton>
                            <PermMedia />
                        </IconButton>
                    </Link>
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
