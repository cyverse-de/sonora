/**
 * @author sriram
 *
 * A dot menu only intended for showing options relevant to a single app
 * i.e. an item or row in the app listing
 */
import React from "react";
import { useTranslation } from "i18n";
import { build, DotMenu } from "@cyverse-de/ui-lib";

import ids from "../ids";
import { hasOwn, isReadable, isWritable } from "../utils";
import { getHost } from "components/utils/getHost";
import { copyStringToClipboard } from "components/utils/copyStringToClipboard";
import { copyLinkToClipboardHandler } from "components/utils/copyLinkToClipboardHandler";
import CopyMenuItem from "../menuItems/CopyMenuItem";
import DeleteMenuItem from "../menuItems/DeleteMenuItem";
import DetailsMenuItem from "../menuItems/DetailsMenuItem";
import DocMenuItem from "../menuItems/DocMenuItem";
import EditMenuItem from "../menuItems/EditMenuItem";
import QLMenuItem from "../menuItems/QLMenuItem";
import PublishMenuItem from "../menuItems/PublishMenuItem";
import CopyLinkMenuItem from "components/utils/CopyLinkMenuItem";
import SharingMenuItem from "components/sharing/SharingMenuItem";
import shareIds from "components/sharing/ids";
import utilIds from "components/utils/ids";
import { getAppListingLinkRefs } from "components/apps/utils";
import { useUserProfile } from "contexts/userProfile";
import PublishAppDialog from "../PublishAppDialog";

function RowDotMenu(props) {
    const {
        app,
        baseId,
        ButtonProps,
        canShare,
        handleDelete,
        setSharingDlgOpen,
        onDetailsSelected,
        onDocSelected,
        onQLSelected,
        isAdminView,
    } = props;

    const [publishDialogOpen, setPublishDialogOpen] = React.useState(false);
    const [userProfile] = useUserProfile();
    const { t } = useTranslation("common");

    const isOwner = hasOwn(app?.permission);
    const isAppPublic = app?.is_public;
    const isAppIntegrator =
        app?.integrator_email === userProfile?.attributes?.email;
    const isWorkflow = app?.step_count > 1;

    const canPublish = isOwner && !isAppPublic;
    const canDelete = isOwner && !isAppPublic;
    const canCopy = isReadable(app?.permission);
    const canEdit =
        isWritable(app?.permission) ||
        (isAppPublic && !isWorkflow && isAppIntegrator);

    return (
        <>
            <DotMenu
                baseId={baseId}
                ButtonProps={ButtonProps}
                render={(onClose) => [
                    <DetailsMenuItem
                        key={build(baseId, ids.DETAILS_MENU_ITEM)}
                        baseId={baseId}
                        onClose={onClose}
                        onDetailsSelected={onDetailsSelected}
                    />,
                    !isAdminView && [
                        canEdit && (
                            <EditMenuItem
                                key={build(baseId, ids.EDIT_MENU_ITEM)}
                                baseId={baseId}
                                onClose={onClose}
                                app={app}
                            />
                        ),
                        canShare && (
                            <SharingMenuItem
                                key={build(baseId, shareIds.SHARING_MENU_ITEM)}
                                baseId={baseId}
                                onClose={onClose}
                                setSharingDlgOpen={setSharingDlgOpen}
                            />
                        ),
                        canPublish && (
                            <PublishMenuItem
                                key={build(baseId, ids.PUBLISH_MENU_ITEM)}
                                baseId={baseId}
                                onClose={onClose}
                                onPublishSelected={() =>
                                    setPublishDialogOpen(true)
                                }
                            />
                        ),
                        canCopy && (
                            <CopyMenuItem
                                key={build(baseId, ids.COPY_MENU_ITEM)}
                                baseId={baseId}
                                onClose={onClose}
                                app={app}
                            />
                        ),
                        <DocMenuItem
                            key={build(baseId, ids.DOC_MENU_ITEM)}
                            baseId={baseId}
                            onClose={onClose}
                            onDocSelected={onDocSelected}
                        />,
                        <QLMenuItem
                            key={build(baseId, ids.QL_MENU_ITEM)}
                            baseId={baseId}
                            onClose={onClose}
                            onQLSelected={onQLSelected}
                        />,
                        <CopyLinkMenuItem
                            key={build(baseId, utilIds.COPY_LINK_MENU_ITEM)}
                            baseId={baseId}
                            onClose={onClose}
                            onCopyLinkSelected={() => {
                                const partialLink = getAppListingLinkRefs(
                                    app.system_id,
                                    app.id
                                )[1];
                                const link = `${getHost()}/${partialLink}`;
                                const copyPromise = copyStringToClipboard(link);
                                copyLinkToClipboardHandler(t, copyPromise);
                            }}
                        />,
                        canDelete && (
                            <DeleteMenuItem
                                key={build(baseId, ids.DELETE)}
                                baseId={baseId}
                                handleDelete={handleDelete}
                                onClose={onClose}
                            />
                        ),
                    ],
                ]}
            />
            <PublishAppDialog
                open={publishDialogOpen}
                app={app}
                handleClose={() => setPublishDialogOpen(false)}
            />
        </>
    );
}

export default RowDotMenu;
