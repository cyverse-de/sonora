/**
 * @author aramsey
 *
 * A component that acts as a header to the data listing view.
 * It contains the primary actions a user would want to accomplish with
 * data and also allows toggling the table or grid view.
 */

import React from "react";

import { build, formatMessage, getMessage, withI18N } from "@cyverse-de/ui-lib";
import {
    Button,
    Hidden,
    IconButton,
    makeStyles,
    Toolbar,
    Tooltip,
} from "@material-ui/core";
import {
    Apps as GridIcon,
    FormatListBulleted as TableIcon,
    Info,
    Share,
} from "@material-ui/icons";
import { injectIntl } from "react-intl";

import DataDotMenu from "./listing/DataDotMenu";
import ids from "./ids";
import messages from "./messages";
import styles from "./styles";
import UploadMenuBtn from "./UploadMenuBtn";
import DataNavigation from "./DataNavigation";

const useStyles = makeStyles(styles);

function Header(props) {
    const classes = useStyles();
    const {
        baseId,
        path,
        error,
        isGridView,
        toggleDisplay,
        onDownloadSelected,
        onEditSelected,
        onMetadataSelected,
        onDeleteSelected,
        intl,
        dataRoots,
        userHomePath,
        userTrashPath,
    } = props;

    let headerId = build(baseId, ids.HEADER);

    return (
        <>
            <Toolbar variant="dense">
                <DataNavigation
                    path={path}
                    error={error}
                    baseId={baseId}
                    dataRoots={dataRoots}
                    userHomePath={userHomePath}
                    userTrashPath={userTrashPath}
                />
            </Toolbar>
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
                <Button
                    id={build(headerId, ids.DETAILS_BTN)}
                    variant="contained"
                    disableElevation
                    color="primary"
                    className={classes.button}
                    onClick={() => console.log("Details")}
                >
                    <Info className={classes.buttonIcon} />
                    <Hidden xsDown>{getMessage("details")}</Hidden>
                </Button>
                <UploadMenuBtn baseId={headerId} />
                <Button
                    id={build(headerId, ids.SHARE_BTN)}
                    variant="contained"
                    disableElevation
                    color="primary"
                    className={classes.button}
                    onClick={() => console.log("Share")}
                >
                    <Share className={classes.buttonIcon} />
                    <Hidden xsDown>{getMessage("share")}</Hidden>
                </Button>
                <DataDotMenu
                    baseId={headerId}
                    onDownloadSelected={onDownloadSelected}
                    onEditSelected={onEditSelected}
                    onMetadataSelected={onMetadataSelected}
                    onDeleteSelected={onDeleteSelected}
                    ButtonProps={{ className: classes.whiteDotMenu }}
                />
            </Toolbar>
        </>
    );
}

export default withI18N(injectIntl(Header), messages);
