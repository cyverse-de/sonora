/**
 * @author sboleyn
 *
 * A dot menu only intended for showing options relevant to a single user's subscription
 */
import React from "react";

import DotMenu from "components/dotMenu/DotMenu";
import EditMenuItem from "../menuItems/EditMenuItem";
import DetailsMenuItem from "../menuItems/DetailsMenuItem";

function RowDotMenu(props) {
    const { baseId, onDetailsSelected, onEditSelected } = props;

    return (
        <>
            <DotMenu
                baseId={baseId}
                render={(onClose) => [
                    <EditMenuItem
                        baseId={baseId}
                        onEditSelected={onEditSelected}
                        onClose={onClose}
                    />,
                    <DetailsMenuItem
                        baseId={baseId}
                        onDetailsSelected={onDetailsSelected}
                        onClose={onClose}
                    />,
                ]}
            />
        </>
    );
}

export default RowDotMenu;
