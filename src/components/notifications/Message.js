/**
 * Displays a notification message with support for navigating to another page,
 * or some other action, when certain message types are clicked / tapped.
 *
 * @author psarando
 */
import React from "react";

import Link from "next/link";

import {
    ADDED_TO_TEAM,
    getDisplayMessage,
    JOIN_TEAM_DENIED,
    REQUEST_TO_JOIN,
} from "./utils";

import NotificationCategory from "components/models/NotificationCategory";
import SystemId from "components/models/systemId";

import {
    getAnalysisDetailsLinkRefs,
    isTerminated,
} from "components/analyses/utils";
import { getAppListingLinkRefs } from "components/apps/utils";
import { getFolderPage, getParentPath } from "components/data/utils";
import DELink from "components/utils/DELink";
import systemIds from "components/models/systemId";

import { Typography } from "@mui/material";
import { getTeamLinkRefs } from "../teams/util";
import ExternalLink from "../utils/ExternalLink";
import { useTranslation } from "../../i18n";
import { useNotifications } from "contexts/pushNotifications";
import RatingWidget from "components/apps/RatingWidget";

function MessageLink(props) {
    const { message, href, as } = props;

    return href ? (
        <Link href={href} as={as} passHref legacyBehavior>
            <DELink text={message} />
        </Link>
    ) : (
        message
    );
}

function AnalysisLink(props) {
    const { notification } = props;
    const { t } = useTranslation("common");
    const analysis = notification.payload;
    const action = analysis?.action;
    const isShare = action === "share";
    const isComplete = isTerminated(analysis);
    const isJobStatusChange = action === "job_status_change";
    const isPeriodicUpdate =
        notification?.email_template === "analysis_periodic_notification";

    let message = getDisplayMessage(notification);

    if (isShare || isJobStatusChange) {
        const accessUrl = notification.payload.access_url;
        const allowRating =
            isJobStatusChange &&
            analysis?.system_id === systemIds.de &&
            isComplete;

        const analysisId =
            isShare && analysis?.analyses?.length > 0
                ? analysis.analyses[0].analysis_id
                : isJobStatusChange && (analysis?.id || analysis?.analysisid);

        if (accessUrl && !isPeriodicUpdate) {
            return (
                <ExternalLink href={`/vice/${encodeURIComponent(accessUrl)}`}>
                    {t("interactiveAnalysisUrl", { message })}
                </ExternalLink>
            );
        }

        let href, as;
        if (isComplete) {
            let resultFolder = analysis?.analysisresultsfolder;
            href = getFolderPage(resultFolder);
            message = t("accessAnalysisOutput", { message });
        } else if (analysisId) {
            [href, as] = getAnalysisDetailsLinkRefs(analysisId);
            if (isPeriodicUpdate) {
                message = t("extendOrTerminateUrl", { message });
            }
        }

        return (
            <>
                <MessageLink message={message} href={href} as={as} />
                <br />
                {allowRating && (
                    <RatingWidget
                        appId={analysis?.app_id}
                        appName={analysis?.app_name}
                        systemId={analysis?.system_id}
                    />
                )}
            </>
        );
    }

    return message;
}

function AppLink(props) {
    const { notification } = props;

    const message = getDisplayMessage(notification);
    const action = notification.payload?.action;

    if (action === "share" && notification.payload?.apps?.length > 0) {
        const app = notification.payload.apps[0];

        const [href, as] = getAppListingLinkRefs(
            app.system_id || SystemId.de,
            app.app_id
        );

        return <MessageLink message={message} href={href} as={as} />;
    }

    return message;
}

function DataLink(props) {
    const { notification } = props;

    const message = getDisplayMessage(notification);
    const action = notification.payload?.action;

    const rootFolderAction = action === "delete" || action === "empty_trash";

    // payload.paths is present for most actions,
    // but `file_uploaded` and `UPLOAD_COMPLETE` actions will have
    // payload.data.path
    const path =
        notification.payload?.paths?.length > 0
            ? notification.payload?.paths[0]
            : notification.payload?.data?.path;

    const href =
        path && getFolderPage(rootFolderAction ? path : getParentPath(path));

    return <MessageLink href={href} message={message} />;
}

function TeamLink(props) {
    const { notification } = props;

    const message = getDisplayMessage(notification);
    const teamName = notification.payload?.team_name;
    const action = notification.payload?.action;
    const { setSelectedNotification } = useNotifications();

    if (action === ADDED_TO_TEAM) {
        const [href] = getTeamLinkRefs(teamName);
        return <MessageLink href={href} message={message} />;
    }

    if (action === REQUEST_TO_JOIN || action === JOIN_TEAM_DENIED) {
        return (
            <DELink
                text={message}
                onClick={() => setSelectedNotification(notification)}
            />
        );
    }

    return message;
}

export default function Message(props) {
    const { baseId, notification } = props;

    let message;

    switch (notification.type.toLowerCase()) {
        case NotificationCategory.ANALYSIS.toLowerCase():
            message = <AnalysisLink notification={notification} />;

            break;

        case NotificationCategory.APPS.toLowerCase():
            message = <AppLink notification={notification} />;

            break;

        case NotificationCategory.DATA.toLowerCase():
            message = <DataLink notification={notification} />;

            break;

        case NotificationCategory.TEAM.toLowerCase():
            message = <TeamLink notification={notification} />;

            break;

        default:
            message = getDisplayMessage(notification);
            break;
    }

    return (
        <Typography id={baseId} variant="subtitle2">
            {message}
        </Typography>
    );
}
