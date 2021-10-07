import React from "react";
import Link from "next/link";
import { BarChart, Info, PermMedia, Repeat, Cancel } from "@material-ui/icons";
import { IconButton, useTheme } from "@material-ui/core";

import { formatDate } from "components/utils/DateFormatter";

import * as constants from "../constants";

import ItemBase, { ItemAction } from "./ItemBase";

import { getFolderPage } from "../../data/utils";

import NavConstants from "../../../common/NavigationConstants";
import { isTerminated } from "components/analyses/utils";
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
        const analysis = props.content;
        const { setDetailsAnalysis, setPendingAnalysis, setTerminateAnalysis } =
            props;
        const item = new AnalysisItem(props);
        const { t } = useTranslation("dashboard");
        const theme = useTheme();
        const isTerminatedAnalysis = isTerminated(analysis);

        return item.addActions([
            <ItemAction
                ariaLabel={t("relaunchAria")}
                key={`${constants.KIND_ANALYSES}-${props.content.id}-relaunch`}
                tooltipKey="relaunchAction"
            >
                <Link
                    href={`/${NavConstants.ANALYSES}/[analysisId]/${NavConstants.RELAUNCH}`}
                    as={`/${NavConstants.ANALYSES}/${item.content.id}/${NavConstants.RELAUNCH}`}
                >
                    <IconButton
                        style={{
                            margin: theme.spacing(1),
                        }}
                        size="small"
                    >
                        <Repeat color="primary" />
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
                    <IconButton
                        style={{
                            margin: theme.spacing(1),
                        }}
                        size="small"
                        onClick={(event) => {
                            if (!isTerminatedAnalysis) {
                                event.preventDefault();
                                setPendingAnalysis(analysis);
                                return false;
                            }
                        }}
                    >
                        <PermMedia color="primary" />
                    </IconButton>
                </Link>
            </ItemAction>,
            <ItemAction
                ariaLabel={t("shareAria")}
                key={`${constants.KIND_ANALYSES}-${props.content.id}-details`}
                tooltipKey="detailsAction"
            >
                <IconButton
                    onClick={() => setDetailsAnalysis({ ...analysis })}
                    style={{
                        margin: theme.spacing(1),
                    }}
                    size="small"
                >
                    <Info color="primary" />
                </IconButton>
            </ItemAction>,
            !isTerminatedAnalysis && (
                <ItemAction
                    ariaLabel={t("shareAria")}
                    key={`${constants.KIND_ANALYSES}-${props.content.id}-terminate`}
                    tooltipKey="terminateAction"
                >
                    <IconButton
                        onClick={() => setTerminateAnalysis(analysis)}
                        style={{
                            margin: theme.spacing(1),
                        }}
                        size="small"
                    >
                        <Cancel color="primary" />
                    </IconButton>
                </ItemAction>
            ),
        ]);
    }

    getOrigination(t) {
        const origination = t("startedBy");
        const date = new Date(parseInt(this.content.startdate));

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
