/**
 *  @author sriram
 *
 * A component that acts as a header to the apps listing view.
 * It contains the primary actions a user would want to accomplish with
 * apps and also allows toggling the table or grid view.
 *
 */
import { IconButton, makeStyles, Toolbar, Tooltip } from "@material-ui/core";
import React from "react";
import { build, formatMessage, getMessage, withI18N } from "@cyverse-de/ui-lib";
import ids from "./ids";
import {
    Apps as GridIcon,
    FormatListBulleted as TableIcon,
} from "@material-ui/icons";
import { injectIntl } from "react-intl";
import messages from "./messages";
import AppNavigation from "./AppNavigation";

const useStyles = makeStyles((theme) => ({
    toolbar: {
        backgroundColor: theme.palette.primary.main,
    },
    menuButton: {
        color: theme.palette.primary.contrastText,
    },
}));
function Header(props) {
    const classes = useStyles();
    const { baseId, isGridView, toggleDisplay, intl } = props;
    const headerId = build(baseId, ids.HEADER);
    return (
        <>
            <Toolbar
                variant="dense"
                classes={{ root: classes.toolbar }}
                id={headerId}
            >
                {isGridView && (
                    <Tooltip
                        id={build(headerId, ids.TABLE_VIEW_BTN, ids.TOOLTIP)}
                        title={getMessage("tableView")}
                        aria-label={formatMessage(intl, "tableView")}
                    >
                        <IconButton
                            id={build(headerId, ids.TABLE_VIEW_BTN)}
                            edge="start"
                            className={classes.menuButton}
                            onClick={() => toggleDisplay()}
                        >
                            <TableIcon />
                        </IconButton>
                    </Tooltip>
                )}
                {!isGridView && (
                    <Tooltip
                        id={build(headerId, ids.GRID_VIEW_BTN, ids.TOOLTIP)}
                        title={getMessage("gridView")}
                        aria-label={formatMessage(intl, "gridView")}
                    >
                        <IconButton
                            id={build(headerId, ids.GRID_VIEW_BTN)}
                            edge="start"
                            className={classes.menuButton}
                            onClick={() => toggleDisplay()}
                        >
                            <GridIcon />
                        </IconButton>
                    </Tooltip>
                )}
            </Toolbar>
        </>
    );
}

export default withI18N(injectIntl(Header), messages);
