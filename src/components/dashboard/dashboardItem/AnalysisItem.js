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

import ItemBase, { ItemAction } from "./ItemBase";

import { getFolderPage } from "../../data/utils";

import NavConstants from "../../../common/NavigationConstants";
import { useTranslation } from "i18n";

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
        const { t } = useTranslation("dashboard");
        return item
            .addActions([
                <ItemAction
                    ariaLabel={t("relaunchAria")}
                    key={`${constants.KIND_ANALYSES}-${props.content.id}-relaunch`}
                    tooltipKey="relaunchAction"
                >
                    <Link
                        href={`/${NavConstants.ANALYSES}/[analysisId]/${NavConstants.RELAUNCH}`}
                        as={`/${NavConstants.ANALYSES}/${item.content.id}/${NavConstants.RELAUNCH}`}
                    >
                        <IconButton>
                            <Repeat />
                        </IconButton>
                    </Link>
                </ItemAction>,
                <ItemAction
                    ariaLabel={t("outputFilesAria")}
                    key={`${constants.KIND_ANALYSES}-${props.content.id}-outputs`}
                    tooltipKey="outputAction"
                >
                    <Link
                        href={`/${NavConstants.DATA}/ds/[...pathItems]`}
                        as={getFolderPage(item.content["result_folder_path"])}
                    >
                        <IconButton>
                            <PermMedia />
                        </IconButton>
                    </Link>
                </ItemAction>,
                <ItemAction
                    ariaLabel={t("shareAria")}
                    key={`${constants.KIND_ANALYSES}-${props.content.id}-share`}
                    tooltipKey="shareAction"
                >
                    <IconButton>
                        <People />
                    </IconButton>
                </ItemAction>,
            ])
            .addMenuActions([
                <ItemAction
                    ariaLabel={t("stopAria")}
                    key={`${constants.KIND_ANALYSES}-${props.content.id}-stop`}
                    tooltipKey="stopAction"
                >
                    <IconButton>
                        <Stop />
                    </IconButton>
                </ItemAction>,
                <ItemAction
                    ariaLabel={t("openDetailsAria")}
                    key={`${constants.KIND_ANALYSES}-${props.content.id}-details`}
                    tooltipKey="detailsAction"
                >
                    <IconButton>
                        <Info />
                    </IconButton>
                </ItemAction>,
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
