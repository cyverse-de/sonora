/**
 * @author sboleyn
 *
 * A dot menu only intended for showing options relevant to a single available add-on
 */
import React from "react";

import DotMenu from "components/dotMenu/DotMenu";
import EditAddonMenuItem from "../menuItems/EditAddonMenuItem";
import DeleteAddonMenuItem from "../menuItems/DeleteAddonMenuItem";
import buildID from "components/utils/DebugIDUtil";
import ids from "../../ids";

function RowDotMenu(props) {
    const { baseId, onDeleteSelected, onEditSelected } = props;

    return (
        <DotMenu
            baseId={baseId}
            render={(onClose) => [
                <EditAddonMenuItem
                    baseId={baseId}
                    onEditSelected={onEditSelected}
                    onClose={onClose}
                    key={buildID(baseId, ids.ADDONS.EDIT_MENU_ITEM)}
                />,
                <DeleteAddonMenuItem
                    baseId={baseId}
                    onDeleteSelected={onDeleteSelected}
                    onClose={onClose}
                    key={buildID(baseId, ids.ADDONS.DELETE_MENU_ITEM)}
                />,
            ]}
        />
    );
}

export default RowDotMenu;
