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
import { Hidden, IconButton, Tooltip } from "@mui/material";
import buildID from "components/utils/DebugIDUtil";

import {
    GridOn as GridIcon,
    FormatListBulleted as TableIcon,
} from "@mui/icons-material";

function DisplayTypeSelector(props) {
    const { isGridView, baseId, toggleDisplay } = props;
    const { t } = useTranslation("util");
    return (
        <Hidden mdDown>
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
                        size="large"
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
                        size="large"
                    >
                        <GridIcon />
                    </IconButton>
                </Tooltip>
            )}
        </Hidden>
    );
}

export default DisplayTypeSelector;
