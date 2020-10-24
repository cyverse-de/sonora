/**
 * Displays a notification message with support for navigating to another page,
 * or some other action, when certain message types are clicked / tapped.
 *
 * @author psarando
 */
import React from "react";

import Link from "next/link";

import { getDisplayMessage } from "./utils";

import NotificationCategory from "components/models/NotificationCategory";
import SystemId from "components/models/systemId";

import { getAnalysisDetailsLinkRefs } from "components/analyses/utils";
import { getListingPath } from "components/apps/utils";
import { getFolderPage, getParentPath } from "components/data/utils";
import NameLink from "components/utils/NameLink";

import { Typography } from "@material-ui/core";

function MessageLink(props) {
    const { message, href, as } = props;

    return (
        <Link href={href} as={as} passHref>
            <NameLink name={message} />
        </Link>
    );
}

function AnalysisLink(props) {
    const { notification } = props;

    const message = getDisplayMessage(notification);
    const action = notification.payload?.action;

    const isJobStatusChange = action === "job_status_change";
    const isShare = action === "share";
    if (isShare || isJobStatusChange) {
        const analysisId =
            isShare && notification.payload?.analyses?.length > 0
                ? notification.payload.analyses[0].analysis_id
                : isJobStatusChange && notification.payload?.id;

        if (analysisId) {
            const [href, as] = getAnalysisDetailsLinkRefs(analysisId);

            return <MessageLink message={message} href={href} as={as} />;
        }
    }

    return message;
}

function AppLink(props) {
    const { notification } = props;

    const message = getDisplayMessage(notification);
    const action = notification.payload?.action;

    if (action === "share" && notification.payload?.apps?.length > 0) {
        const app = notification.payload.apps[0];

        const href = getListingPath(
            null,
            null,
            null,
            null,
            null,
            JSON.stringify({
                system_id: app.system_id || SystemId.de,
                id: app.category_id,
            })
        );

        return <MessageLink message={message} href={href} />;
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

    return href ? <MessageLink href={href} message={message} /> : message;
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
