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
import buildID from "components/utils/DebugIDUtil";
import ids from "../ids";

function RowDotMenu(props) {
    const {
        baseId,
        onDetailsSelected,
        onEditQuotasSelected,
        onEditSubscriptionSelected,
    } = props;

    return (
        <DotMenu
            baseId={baseId}
            render={(onClose) => [
                <DetailsMenuItem
                    baseId={baseId}
                    onDetailsSelected={onDetailsSelected}
                    onClose={onClose}
                    key={buildID(baseId, ids.DETAILS_MENU_ITEM)}
                />,
                <EditSubscriptionMenuItem
                    baseId={baseId}
                    onEditSelected={onEditSubscriptionSelected}
                    onClose={onClose}
                    key={buildID(baseId, ids.EDIT_SUBSCRIPTION_MENU_ITEM)}
                />,
                <EditQuotasMenuItem
                    baseId={baseId}
                    onEditSelected={onEditQuotasSelected}
                    onClose={onClose}
                    key={buildID(baseId, ids.EDIT_QUOTAS_MENU_ITEM)}
                />,
            ]}
        />
    );
}

export default RowDotMenu;
