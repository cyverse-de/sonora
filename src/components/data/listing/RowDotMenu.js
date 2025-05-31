/**
 * @author aramsey
 *
 * A dot menu only intended for showing options relevant to a single data resource
 * i.e. an item or row in the data listing
 */
import React from "react";
import { useTranslation } from "i18n";
import DetailsMenuItem from "../menuItems/DetailsMenuItem";
import DeleteMenuItem from "../menuItems/DeleteMenuItem";
import MetadataMenuItem from "../menuItems/MetadataMenuItem";
import DownloadMenuItem from "../menuItems/DownloadMenuItem";
import RenameMenuItem from "../menuItems/RenameMenuItem";
import MoveMenuItem from "../menuItems/MoveMenuItem";
import CopyPathMenuItem from "../menuItems/CopyPathMenuItem";
import CopyLinkMenuItem from "components/utils/CopyLinkMenuItem";
import SharingMenuItem from "../../sharing/SharingMenuItem";
import { hasOwn, containsFolders, isWritable } from "../utils";
import { getHost } from "components/utils/getHost";
import { copyStringToClipboard } from "components/utils/copyStringToClipboard";
import { copyLinkToClipboardHandler } from "components/utils/copyLinkToClipboardHandler";
import ids from "../ids";
import shareIds from "components/sharing/ids";
import { useDataNavigationLink } from "components/data/utils";
import PublicLinksMenuItem from "../menuItems/PublicLinksMenuItem";

import buildID from "components/utils/DebugIDUtil";
import DotMenu from "components/dotMenu/DotMenu";
import { announce } from "components/announcer/CyVerseAnnouncer";
import { SUCCESS, ERROR } from "components/announcer/AnnouncerConstants";

import ResourceTypes from "components/models/ResourceTypes";

function RowDotMenu(props) {
    const {
        baseId,
        ButtonProps,
        onDeleteSelected,
        onDetailsSelected,
        resource,
        setSharingDlgOpen,
        onMetadataSelected,
        onPublicLinksSelected,
        onDownloadSelected,
        onRenameSelected,
        onMoveSelected,
        inTrash,
        planCanShare,
    } = props;
    const { t } = useTranslation("common");
    const { t: i18nData } = useTranslation("data");
    const isOwner = hasOwn(resource.permission);
    const isFile = resource.type === ResourceTypes.FILE;
    const renameEnabled = !inTrash && isWritable(resource.permission);
    const publicLinkEnabled =
        !inTrash && isOwner && !containsFolders([resource]);
    const sharingEnabled = !inTrash && isOwner;
    const moveMiEnabled = !inTrash && isOwner;
    const partialLink = useDataNavigationLink(
        resource?.path,
        resource?.id,
        resource?.type
    )[1];
    return (
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
                !inTrash && (
                    <MetadataMenuItem
                        key={ids.METADATA_MI}
                        baseId={baseId}
                        resourceId={resource.id}
                        onClose={onClose}
                        onMetadataSelected={onMetadataSelected}
                    />
                ),
                sharingEnabled && (
                    <SharingMenuItem
                        key={buildID(baseId, shareIds.SHARING_MENU_ITEM)}
                        baseId={baseId}
                        planCanShare={planCanShare}
                        onClose={onClose}
                        setSharingDlgOpen={setSharingDlgOpen}
                    />
                ),
                publicLinkEnabled && (
                    <PublicLinksMenuItem
                        key={buildID(baseId, ids.PUBLIC_LINKS_MENU_ITEM)}
                        baseId={baseId}
                        onClose={onClose}
                        onPublicLinksSelected={onPublicLinksSelected}
                    />
                ),
                renameEnabled && (
                    <RenameMenuItem
                        key={buildID(baseId, ids.RENAME_MI)}
                        baseId={baseId}
                        onClose={onClose}
                        onRenameSelected={onRenameSelected}
                    />
                ),
                moveMiEnabled && (
                    <MoveMenuItem
                        key={buildID(baseId, ids.MOVE_MENU_ITEM)}
                        onMoveSelected={onMoveSelected}
                        baseId={baseId}
                        onClose={onClose}
                    />
                ),
                isFile && (
                    <DownloadMenuItem
                        key={buildID(baseId, ids.DOWNLOAD_MENU_ITEM)}
                        onDownloadSelected={onDownloadSelected}
                        baseId={baseId}
                        onClose={onClose}
                    />
                ),
                !inTrash && [
                    <CopyLinkMenuItem
                        key={buildID(baseId, ids.COPY_LINK_MENU_ITEM)}
                        baseId={baseId}
                        onClose={onClose}
                        onCopyLinkSelected={() => {
                            const link = `${getHost()}${partialLink}`;
                            const copyPromise = copyStringToClipboard(link);
                            copyLinkToClipboardHandler(t, copyPromise);
                        }}
                    />,
                    <CopyPathMenuItem
                        key={buildID(baseId, ids.COPY_PATH_MENU_ITEM)}
                        baseId={baseId}
                        onClose={onClose}
                        onCopyPathSelected={() => {
                            copyStringToClipboard(resource?.path).then(
                                () => {
                                    announce({
                                        text: i18nData("pathCopied"),
                                        variant: SUCCESS,
                                    });
                                },
                                () => {
                                    announce({
                                        text: i18nData("pathCopiedFailed"),
                                        variant: ERROR,
                                    });
                                }
                            );
                        }}
                    />,
                    <DeleteMenuItem
                        key={buildID(baseId, ids.DELETE_MENU_ITEM)}
                        baseId={baseId}
                        onClose={onClose}
                        onDeleteSelected={onDeleteSelected}
                    />,
                ],
            ]}
        />
    );
}

export default RowDotMenu;
