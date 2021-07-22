import React, { useState } from "react";
import { useTranslation } from "i18n";
import PropTypes from "prop-types";

import { IconButton, makeStyles, Menu, MenuItem } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";

import InfoIcon from "@material-ui/icons/InfoOutlined";
import UnFavoriteIcon from "@material-ui/icons/FavoriteBorderOutlined";
import FavoriteIcon from "@material-ui/icons/Favorite";
import CommentsIcon from "@material-ui/icons/CommentOutlined";
import PlayIcon from "@material-ui/icons/PlayArrow";
import buildID from "components/utils/DebugIDUtil";

import ids from "./ids";

/**
 *
 * @author sriram
 *
 * Menu items for Apps Tile and table view
 *
 */
const useStyles = makeStyles((theme) => ({
    menuItem: {
        padding: 5,
        fontSize: 10,
    },
    toolbarItemColor: {
        color: theme.palette.darkBlue,
    },
}));

function AppMenu(props) {
    const {
        onAppInfoClick,
        onCommentsClick,
        onFavoriteClick,
        onQuickLaunchClick,
        baseDebugId,
        isExternal,
        isFavorite,
    } = props;
    const { t } = useTranslation("apps");
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClose = () => setAnchorEl(null);
    const classes = useStyles();
    return (
        <div>
            <IconButton
                id={buildID(baseDebugId, ids.DOT_MENU)}
                aria-label={t("more")}
                aria-owns={open ? "long-menu" : null}
                aria-haspopup="true"
                onClick={(event) => setAnchorEl(event.currentTarget)}
                size="small"
            >
                <MoreVertIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                <MenuItem
                    id={buildID(baseDebugId, ids.APP_INFO)}
                    className={classes.menuItem}
                    data-disabled={false}
                    onClick={() => {
                        onAppInfoClick();
                        handleClose();
                    }}
                >
                    <InfoIcon className={classes.toolbarItemColor} />
                    {t("appInfo")}
                </MenuItem>
                {!isFavorite && !isExternal && (
                    <MenuItem
                        id={buildID(baseDebugId, ids.FAVORITES)}
                        disabled={false}
                        className={classes.menuItem}
                        data-disabled={false}
                        onClick={() => {
                            onFavoriteClick();
                            handleClose();
                        }}
                    >
                        <FavoriteIcon className={classes.toolbarItemColor} />
                        {t("addToFavorites")}
                    </MenuItem>
                )}
                {isFavorite && !isExternal && (
                    <MenuItem
                        id={buildID(baseDebugId, ids.FAVORITES)}
                        disabled={false}
                        className={classes.menuItem}
                        data-disabled={false}
                        onClick={() => {
                            onFavoriteClick();
                            handleClose();
                        }}
                    >
                        <UnFavoriteIcon className={classes.toolbarItemColor} />
                        {t("removeFromFavorites")}
                    </MenuItem>
                )}
                {!isExternal && [
                    <MenuItem
                        id={buildID(baseDebugId, ids.APP_QUICK_LAUNCH)}
                        key={ids.APP_QUICK_LAUNCH}
                        disabled={false}
                        className={classes.menuItem}
                        data-disabled={false}
                        onClick={() => {
                            onQuickLaunchClick();
                            handleClose();
                        }}
                    >
                        <PlayIcon className={classes.toolbarItemColor} />
                        {t("quickLaunch")}
                    </MenuItem>,
                    <MenuItem
                        id={buildID(baseDebugId, ids.APP_COMMENTS)}
                        key={ids.APP_COMMENTS}
                        disabled={false}
                        className={classes.menuItem}
                        data-disabled={false}
                        onClick={() => {
                            onCommentsClick();
                            handleClose();
                        }}
                    >
                        <CommentsIcon className={classes.toolbarItemColor} />
                        {t("comments")}
                    </MenuItem>,
                ]}
                {isExternal && [
                    <MenuItem
                        id={buildID(baseDebugId, ids.FAVORITES)}
                        key={ids.FAVORITES}
                        className={classes.menuItem}
                        data-disabled={false}
                        onClick={handleClose}
                    >
                        {t("favoriteNotSupported")}
                    </MenuItem>,
                    <MenuItem
                        id={buildID(baseDebugId, ids.APP_COMMENTS)}
                        key={ids.APP_COMMENTS}
                        className={classes.menuItem}
                        data-disabled={false}
                        onClick={handleClose}
                    >
                        {t("commentsNotSupported")}
                    </MenuItem>,
                ]}
            </Menu>
        </div>
    );
}
AppMenu.propTypes = {
    onAppInfoClick: PropTypes.func,
    onCommentsClick: PropTypes.func,
    onFavoriteClick: PropTypes.func,
    onQuickLaunchClick: PropTypes.func,
    baseDebugId: PropTypes.string.isRequired,
    isExternal: PropTypes.bool.isRequired,
    isFavorite: PropTypes.bool.isRequired,
};
export default AppMenu;
