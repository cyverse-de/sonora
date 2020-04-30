/**
 *  @author sriram
 *
 * A component that acts as a header to the apps listing view.
 * It contains the primary actions a user would want to accomplish with
 * apps and also allows toggling the table or grid view.
 *
 */
import {
    Button,
    Hidden,
    IconButton,
    makeStyles,
    Toolbar,
    Tooltip,
} from "@material-ui/core";
import React from "react";
import { build, formatMessage, getMessage, withI18N } from "@cyverse-de/ui-lib";
import ids from "./ids";
import {
    Apps as GridIcon,
    FormatListBulleted as TableIcon,
    Info,
} from "@material-ui/icons";
import { injectIntl } from "react-intl";
import messages from "./messages";

const useStyles = makeStyles((theme) => ({
    toolbar: {
        backgroundColor: theme.palette.primary.main,
    },
    menuButton: {
        color: theme.palette.info.contrastText,
    },
    divider: {
        flexGrow: 1,
    },
    button: {
        [theme.breakpoints.up("sm")]: {
            margin: theme.spacing(1),
        },
    },
}));
function Header(props) {
    const classes = useStyles();
    const {
        baseId,
        isGridView,
        toggleDisplay,
        detailsEnabled,
        onDetailsSelected,
        intl,
    } = props;
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
                <div className={classes.divider} />
                {detailsEnabled && (
                    <Button
                        id={build(headerId, ids.DETAILS_BTN)}
                        variant="contained"
                        disableElevation
                        color="primary"
                        className={classes.button}
                        onClick={onDetailsSelected}
                        startIcon={<Info className={classes.buttonIcon} />}
                    >
                        <Hidden xsDown>{getMessage("details")}</Hidden>
                    </Button>
                )}
            </Toolbar>
        </>
    );
}

export default withI18N(injectIntl(Header), messages);
