/**
 * @author aramsey
 *
 * A dot menu only intended for showing options relevant to a single data resource
 * i.e. an item or row in the data listing
 */
import React from "react";

import { DotMenu } from "@cyverse-de/ui-lib";
import DetailsMenuItem from "../menuItems/DetailsMenuItem";
import DeleteMenuItem from "../menuItems/DeleteMenuItem";
import MetadataMenuItem from "../menuItems/MetadataMenuItem";
import DownloadMenuItem from "../menuItems/DownloadMenuItem";
import SharingMenuItem from "../../sharing/SharingMenuItem";
import { hasOwn, containsFolders } from "../utils";
import ids from "../ids";
import shareIds from "components/sharing/ids";
import PublicLinksMenuItem from "../menuItems/PublicLinksMenuItem";
import { build } from "@cyverse-de/ui-lib";
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
    } = props;

    const isOwner = hasOwn(resource.permission);
    const isFile = resource.type === ResourceTypes.FILE;

    return (
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
                <MetadataMenuItem
                    key={ids.METADATA_MI}
                    baseId={baseId}
                    resourceId={resource.id}
                    onClose={onClose}
                    onMetadataSelected={onMetadataSelected}
                />,
                isOwner && (
                    <SharingMenuItem
                        key={build(baseId, shareIds.SHARING_MENU_ITEM)}
                        baseId={baseId}
                        onClose={onClose}
                        setSharingDlgOpen={setSharingDlgOpen}
                    />
                ),
                isOwner && !containsFolders([resource]) && (
                    <PublicLinksMenuItem
                        key={build(baseId, ids.PUBLIC_LINKS_MENU_ITEM)}
                        baseId={baseId}
                        onClose={onClose}
                        onPublicLinksSelected={onPublicLinksSelected}
                    />
                ),
                isOwner && (
                    <DeleteMenuItem
                        key={build(baseId, ids.DELETE_MENU_ITEM)}
                        baseId={baseId}
                        onClose={onClose}
                        onDeleteSelected={onDeleteSelected}
                    />
                ),
                isFile && (
                    <DownloadMenuItem
                        key={build(baseId, ids.DOWNLOAD_MENU_ITEM)}
                        onDownloadSelected={onDownloadSelected}
                        baseId={baseId}
                        onClose={onClose}
                    />
                ),
            ]}
        />
    );
}

export default RowDotMenu;
