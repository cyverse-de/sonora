/**
 * @author psarando
 */
import React from "react";

import { useRouter } from "next/router";
import { useMutation } from "react-query";

import { useTranslation } from "i18n";
import ids from "../ids";
import { getAppEditPath } from "../utils";

import withErrorAnnouncer from "components/utils/error/withErrorAnnouncer";
import { copyApp } from "serviceFacades/apps";

import { AnnouncerConstants, announce, build } from "@cyverse-de/ui-lib";

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
    const { t } = useTranslation(["apps", "common"]);

    const [onCopyApp, { isLoading }] = useMutation(copyApp, {
        onSuccess: (appCopy) => {
            onClose();
            announce({
                text: t("appCopySuccess", { appName: app.name }),
                variant: AnnouncerConstants.SUCCESS,
            });
            router.push(getAppEditPath(appCopy.system_id, appCopy.id));
        },
        onError: (error) => {
            showErrorAnnouncer(t("appCopyError"), error);
        },
    });

    const isWorkflow = app?.step_count > 1;

    return (
        <MenuItem
            id={build(baseId, ids.COPY_MENU_ITEM)}
            disabled={isLoading}
            onClick={() => {
                if (isWorkflow) {
                    announce({ text: t("common:comingSoon") });
                    onClose();
                } else {
                    onCopyApp({ systemId: app?.system_id, appId: app?.id });
                }
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
