/**
 * @author sriram
 *
 * A button that will allow users to switch between grid and table display listing
 *
 *
 */
import React from "react";

import ids from "./ids";
import intlData from "./messages";

import { injectIntl } from "react-intl";

import { Hidden, IconButton, Tooltip } from "@material-ui/core";
import { build, formatMessage, getMessage, withI18N } from "@cyverse-de/ui-lib";

import {
    GridOn as GridIcon,
    FormatListBulleted as TableIcon,
} from "@material-ui/icons";

function DisplayTypeSelector(props) {
    const { isGridView, baseId, toggleDisplay, intl } = props;
    return (
        <Hidden smDown>
            {isGridView && (
                <Tooltip
                    id={build(baseId, ids.TABLE_VIEW_BTN, ids.TOOLTIP)}
                    title={getMessage("tableView")}
                    aria-label={formatMessage(intl, "tableView")}
                >
                    <IconButton
                        id={build(baseId, ids.TABLE_VIEW_BTN)}
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
                    id={build(baseId, ids.GRID_VIEW_BTN, ids.TOOLTIP)}
                    title={getMessage("gridView")}
                    aria-label={formatMessage(intl, "gridView")}
                >
                    <IconButton
                        id={build(baseId, ids.GRID_VIEW_BTN)}
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

export default withI18N(injectIntl(DisplayTypeSelector), intlData);
