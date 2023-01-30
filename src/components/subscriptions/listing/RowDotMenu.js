/**
 * @author sboleyn
 *
 * A dot menu only intended for showing options relevant to a single user's subscription
 */
import React from "react";

import DotMenu from "components/dotMenu/DotMenu";
import EditSubscriptionMenuItem from "../menuItems/EditSubscriptionMenuItem";
import EditQuotasMenuItem from "../menuItems/EditQuotasMenuItem";
import DetailsMenuItem from "../menuItems/DetailsMenuItem";

function RowDotMenu(props) {
    const {
        baseId,
        onDetailsSelected,
        onEditQuotasSelected,
        onEditSubscriptionSelected,
    } = props;

    return (
        <>
            <DotMenu
                baseId={baseId}
                render={(onClose) => [
                    <DetailsMenuItem
                        baseId={baseId}
                        onDetailsSelected={onDetailsSelected}
                        onClose={onClose}
                    />,
                    <EditSubscriptionMenuItem
                        baseId={baseId}
                        onEditSelected={onEditSubscriptionSelected}
                        onClose={onClose}
                    />,
                    <EditQuotasMenuItem
                        baseId={baseId}
                        onEditSelected={onEditQuotasSelected}
                        onClose={onClose}
                    />,
                ]}
            />
        </>
    );
}

export default RowDotMenu;
