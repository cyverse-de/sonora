import { IconButton, Tooltip } from "@material-ui/core";
import { build, formatMessage } from "@cyverse-de/ui-lib";
import ids from "./ids";
import FavoriteIcon from "@material-ui/icons/Favorite";
import UnFavoriteIcon from "@material-ui/icons/FavoriteBorderOutlined";
import React from "react";

export function AppFavorite(props) {
    const { isFavorite, isExternal, onFavoriteClick, intl, baseId } = props;

    if (isFavorite) {
        return (
            <Tooltip title={formatMessage(intl, "removeFromFavorites")}>
                <IconButton
                    id={build(baseId, ids.APP_FAVORITE)}
                    onClick={() => onFavoriteClick(isExternal)}
                    disabled={isExternal}
                    size="small"
                >
                    <FavoriteIcon color="primary" />
                </IconButton>
            </Tooltip>
        );
    } else {
        return (
            <Tooltip title={formatMessage(intl, "addToFavorites")}>
                <IconButton
                    id={build(baseId, ids.APP_UNFAVORITE)}
                    onClick={() => onFavoriteClick(isExternal)}
                    disabled={isExternal}
                    size="small"
                >
                    <UnFavoriteIcon color="primary" />
                </IconButton>
            </Tooltip>
        );
    }
}
