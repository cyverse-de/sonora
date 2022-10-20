/**
 * @author psarando
 */
import React from "react";

import { useRouter } from "next/router";
import { useMutation } from "react-query";

import { useTranslation } from "i18n";
import ids from "../ids";
import { getAppEditPath } from "../utils";

import withErrorAnnouncer from "components/error/withErrorAnnouncer";
import { copyApp } from "serviceFacades/apps";
import { copyPipeline } from "serviceFacades/pipelines";

import buildID from "components/utils/DebugIDUtil";
import { announce } from "components/announcer/CyVerseAnnouncer";
import { SUCCESS } from "components/announcer/AnnouncerConstants";

import {
    CircularProgress,
    ListItemIcon,
    ListItemText,
    MenuItem,
} from "@material-ui/core";

import { FileCopy as CopyIcon } from "@material-ui/icons";

function CopyMenuItem(props) {
    const { baseId, app, onClose, showErrorAnnouncer } = props;

    const router = useRouter();
    const { t } = useTranslation("apps");

    const isWorkflow = app?.step_count > 1;

    const { mutate: onCopyApp, isLoading } = useMutation(
        (ids) => (isWorkflow ? copyPipeline(ids) : copyApp(ids)),
        {
            onSuccess: (appCopy) => {
                onClose();
                announce({
                    text: t("appCopySuccess", { appName: app?.name }),
                    variant: SUCCESS,
                });
                router.push(
                    getAppEditPath(
                        appCopy.system_id,
                        appCopy.id,
                        appCopy.version_id
                    )
                );
            },
            onError: (error) => {
                showErrorAnnouncer(
                    t("appCopyError", { appName: app?.name }),
                    error
                );
            },
        }
    );

    return (
        <MenuItem
            id={buildID(baseId, ids.COPY_MENU_ITEM)}
            disabled={isLoading}
            onClick={() => {
                onCopyApp({
                    systemId: app?.system_id,
                    appId: app?.id,
                    versionId: app?.version_id,
                });
            }}
        >
            <ListItemIcon>
                {isLoading ? (
                    <CircularProgress color="inherit" size={20} />
                ) : (
                    <CopyIcon fontSize="small" />
                )}
            </ListItemIcon>
            <ListItemText
                primary={t(isWorkflow ? "copyWorkflow" : "copyApp")}
            />
        </MenuItem>
    );
}

export default withErrorAnnouncer(CopyMenuItem);
