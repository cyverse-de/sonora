import React from "react";
import Link from "next/link";
import {
    BarChart,
    Info,
    PermMedia,
    Repeat,
    Cancel,
    Launch,
} from "@mui/icons-material";
import { IconButton } from "@mui/material";

import { formatDate } from "components/utils/DateFormatter";

import * as constants from "../constants";

import ItemBase, { ItemAction } from "./ItemBase";

import { getFolderPage } from "../../data/utils";

import NavConstants from "../../../common/NavigationConstants";
import { isTerminated } from "components/analyses/utils";
import { isInteractive, openInteractiveUrl } from "components/analyses/utils";

class AnalysisItem extends ItemBase {
    constructor({ section, content, height, width, config }) {
        super({
            kind: constants.KIND_ANALYSES,
            content,
            section,
            height,
            width,
            config,
        });
    }

    static create(props) {
        const analysis = props.content;
        const {
            setDetailsAnalysis,
            setPendingAnalysis,
            setTerminateAnalysis,
            t,
            theme,
        } = props;
        const item = new AnalysisItem(props);
        const isTerminatedAnalysis = isTerminated(analysis);
        const isVICE = isInteractive(analysis);
        const interactiveUrls = analysis?.interactive_urls;
        return item.addActions([
            <ItemAction
                ariaLabel={t("relaunchAria")}
                key={`${constants.KIND_ANALYSES}-${props.content.id}-relaunch`}
                tooltipKey="relaunchAction"
            >
                <Link
                    href={`/${NavConstants.ANALYSES}/[analysisId]/${NavConstants.RELAUNCH}`}
                    as={`/${NavConstants.ANALYSES}/${item.content.id}/${NavConstants.RELAUNCH}`}
                    legacyBehavior
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
            isTerminatedAnalysis && (
                <ItemAction
                    ariaLabel={t("outputFilesAria")}
                    key={`${constants.KIND_ANALYSES}-${props.content.id}-outputs`}
                    tooltipKey="outputAction"
                >
                    <Link
                        href={`/${NavConstants.DATA}/ds/[...pathItems]`}
                        as={getFolderPage(item.content.resultfolderid)}
                        legacyBehavior
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
                </ItemAction>
            ),
            <ItemAction
                ariaLabel={t("openDetailsAria")}
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
                    ariaLabel={t("terminateAria")}
                    key={`${constants.KIND_ANALYSES}-${props.content.id}-terminate`}
                    tooltipKey="terminate"
                >
                    <IconButton
                        onClick={() => setTerminateAnalysis(analysis)}
                        style={{
                            margin: theme.spacing(1),
                        }}
                        size="small"
                    >
                        <Cancel color="error" />
                    </IconButton>
                </ItemAction>
            ),
            isVICE && !isTerminatedAnalysis && (
                <ItemAction
                    key={`${constants.KIND_ANALYSES}-${props.content.id}-vice`}
                    tooltipKey="goToVice"
                >
                    <IconButton
                        onClick={() => openInteractiveUrl(interactiveUrls[0])}
                        size="small"
                        style={{
                            margin: theme.spacing(1),
                        }}
                    >
                        <Launch color="primary" />
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
