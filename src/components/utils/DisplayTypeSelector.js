/**
 * @author sriram
 *
 * A button that will allow users to switch between grid and table display listing
 *
 *
 */
import React from "react";
import { useTranslation } from "i18n";

import ids from "./ids";
import { Hidden, IconButton, Tooltip } from "@material-ui/core";
import buildID from "components/utils/DebugIDUtil";

import {
    GridOn as GridIcon,
    FormatListBulleted as TableIcon,
} from "@material-ui/icons";

function DisplayTypeSelector(props) {
    const { isGridView, baseId, toggleDisplay } = props;
    const { t } = useTranslation("util");
    return (
        <Hidden smDown>
            {isGridView && (
                <Tooltip
                    id={buildID(baseId, ids.TABLE_VIEW_BTN, ids.TOOLTIP)}
                    title={t("tableView")}
                    aria-label={t("tableView")}
                >
                    <IconButton
                        id={buildID(baseId, ids.TABLE_VIEW_BTN)}
                        edge="start"
                        onClick={() => toggleDisplay()}
                        color="primary"
                    >
                        <TableIcon />
                    </IconButton>
                </Tooltip>
            )}
            {!isGridView && (
                <Tooltip
                    id={buildID(baseId, ids.GRID_VIEW_BTN, ids.TOOLTIP)}
                    title={t("gridView")}
                    aria-label={t("gridView")}
                >
                    <IconButton
                        id={buildID(baseId, ids.GRID_VIEW_BTN)}
                        edge="start"
                        onClick={() => toggleDisplay()}
                        color="primary"
                    >
                        <GridIcon />
                    </IconButton>
                </Tooltip>
            )}
        </Hidden>
    );
}

export default DisplayTypeSelector;
