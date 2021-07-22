import React from "react";
import { useTranslation } from "i18n";
import { IconButton, Tooltip } from "@material-ui/core";
import buildID from "components/utils/DebugIDUtil";
import ids from "./ids";
import FavoriteIcon from "@material-ui/icons/Favorite";
import UnFavoriteIcon from "@material-ui/icons/FavoriteBorderOutlined";

export default function AppFavorite(props) {
    const {
        isFavorite,
        isExternal,
        onFavoriteClick,
        baseId,
        size = "small",
        buttonStyle,
    } = props;
    const { t } = useTranslation("apps");
    if (isFavorite) {
        return (
            <Tooltip title={t("removeFromFavorites")}>
                <IconButton
                    id={buildID(baseId, ids.APP_FAVORITE)}
                    onClick={() => onFavoriteClick(isExternal)}
                    disabled={isExternal}
                    size={size}
                    style={buttonStyle}
                >
                    <FavoriteIcon color="primary" />
                </IconButton>
            </Tooltip>
        );
    } else {
        return (
            <Tooltip title={t("addToFavorites")}>
                <IconButton
                    id={buildID(baseId, ids.APP_UNFAVORITE)}
                    onClick={() => onFavoriteClick(isExternal)}
                    disabled={isExternal}
                    size={size}
                    style={buttonStyle}
                >
                    <UnFavoriteIcon color="primary" />
                </IconButton>
            </Tooltip>
        );
    }
}
