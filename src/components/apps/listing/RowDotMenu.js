/**
 * @author sriram
 *
 * A dot menu only intended for showing options relevant to a single app
 * i.e. an item or row in the app listing
 */
import React from "react";

import { build, DotMenu } from "@cyverse-de/ui-lib";

import ids from "../ids";
import { isWritable } from "../utils";

import DetailsMenuItem from "../menuItems/DetailsMenuItem";
import DocMenuItem from "../menuItems/DocMenuItem";
import EditMenuItem from "../menuItems/EditMenuItem";
import QLMenuItem from "../menuItems/QLMenuItem";

import SharingMenuItem from "components/sharing/SharingMenuItem";
import shareIds from "components/sharing/ids";

function RowDotMenu(props) {
    const {
        app,
        baseId,
        ButtonProps,
        canShare,
        setSharingDlgOpen,
        onDetailsSelected,
        onDocSelected,
        onQLSelected,
        isAdminView,
    } = props;

    const canEdit = isWritable(app.permission);

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
                !isAdminView && [
                    canShare && (
                        <SharingMenuItem
                            key={build(baseId, shareIds.SHARING_MENU_ITEM)}
                            baseId={baseId}
                            onClose={onClose}
                            setSharingDlgOpen={setSharingDlgOpen}
                        />
                    ),
                    canEdit && (
                        <EditMenuItem
                            key={build(baseId, ids.EDIT_MENU_ITEM)}
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
                ],
            ]}
        />
    );
}

export default RowDotMenu;
