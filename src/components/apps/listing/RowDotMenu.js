/**
 * @author sriram
 *
 * A dot menu only intended for showing options relevant to a single app
 * i.e. an item or row in the app listing
 */
import React from "react";
import { useTranslation } from "i18n";

import buildID from "components/utils/DebugIDUtil";
import DotMenu from "components/dotMenu/DotMenu";

import SystemIds from "components/models/systemId";
import ids from "../ids";
import { hasOwn, isReadable, isWritable } from "../utils";
import { getHost } from "components/utils/getHost";
import { copyStringToClipboard } from "components/utils/copyStringToClipboard";
import { copyLinkToClipboardHandler } from "components/utils/copyLinkToClipboardHandler";
import CopyMenuItem from "../menuItems/CopyMenuItem";
import CreateVersionMenuItem from "../menuItems/CreateVersionMenuItem";
import DeleteMenuItem from "../menuItems/DeleteMenuItem";
import DetailsMenuItem from "../menuItems/DetailsMenuItem";
import DocMenuItem from "../menuItems/DocMenuItem";
import EditMenuItem from "../menuItems/EditMenuItem";
import SavedLaunchMenuItem from "../menuItems/SavedLaunchMenuItem";
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
        onSavedLaunchSelected,
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
    const canDelete = isAdminView || (isOwner && !isAppPublic);
    const canCopy =
        isReadable(app?.permission) && app?.system_id === SystemIds.de;
    const canEdit = isWritable(app?.permission);
    const canEditLabels =
        canEdit || (isAppPublic && !isWorkflow && isAppIntegrator);

    return (
        <>
            <DotMenu
                baseId={baseId}
                ButtonProps={ButtonProps}
                render={(onClose) => [
                    <DetailsMenuItem
                        key={buildID(baseId, ids.DETAILS_MENU_ITEM)}
                        baseId={baseId}
                        onClose={onClose}
                        onDetailsSelected={onDetailsSelected}
                    />,
                    canEdit && (
                        <CreateVersionMenuItem
                            key={ids.CREATE_APP_VERSION_MENU_ITEM}
                            baseId={baseId}
                            onClose={onClose}
                            app={app}
                        />
                    ),
                    !isAdminView && [
                        canEditLabels && (
                            <EditMenuItem
                                key={buildID(baseId, ids.EDIT_MENU_ITEM)}
                                baseId={baseId}
                                onClose={onClose}
                                app={app}
                            />
                        ),
                        canShare && (
                            <SharingMenuItem
                                key={buildID(
                                    baseId,
                                    shareIds.SHARING_MENU_ITEM
                                )}
                                baseId={baseId}
                                onClose={onClose}
                                setSharingDlgOpen={setSharingDlgOpen}
                            />
                        ),
                        canPublish && (
                            <PublishMenuItem
                                key={buildID(baseId, ids.PUBLISH_MENU_ITEM)}
                                baseId={baseId}
                                onClose={onClose}
                                onPublishSelected={() =>
                                    setPublishDialogOpen(true)
                                }
                            />
                        ),
                        canCopy && (
                            <CopyMenuItem
                                key={buildID(baseId, ids.COPY_MENU_ITEM)}
                                baseId={baseId}
                                onClose={onClose}
                                app={app}
                            />
                        ),
                        <DocMenuItem
                            key={buildID(baseId, ids.DOC_MENU_ITEM)}
                            baseId={baseId}
                            onClose={onClose}
                            onDocSelected={onDocSelected}
                        />,
                        <SavedLaunchMenuItem
                            key={buildID(baseId, ids.SAVED_LAUNCH_MENU_ITEM)}
                            baseId={baseId}
                            onClose={onClose}
                            onSavedLaunchSelected={onSavedLaunchSelected}
                        />,
                        <CopyLinkMenuItem
                            key={buildID(baseId, utilIds.COPY_LINK_MENU_ITEM)}
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
                    ],
                    canDelete && (
                        <DeleteMenuItem
                            key={buildID(baseId, ids.DELETE)}
                            baseId={baseId}
                            isDeleted={app?.deleted}
                            handleDelete={handleDelete}
                            onClose={onClose}
                        />
                    ),
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
