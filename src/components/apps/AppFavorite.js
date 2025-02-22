import React from "react";

import { useQueryClient, useMutation } from "react-query";

import { useTranslation } from "i18n";

import withErrorAnnouncer from "components/error/withErrorAnnouncer";
import buildID from "components/utils/DebugIDUtil";
import ids from "./ids";
import { appFavorite, APP_BY_ID_QUERY_KEY } from "serviceFacades/apps";

import { CircularProgress, IconButton, Tooltip } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import UnFavoriteIcon from "@mui/icons-material/FavoriteBorderOutlined";

function AppFavorite(props) {
    const {
        app,
        isExternal,
        baseId,
        size = "small",
        buttonStyle,
        showErrorAnnouncer,
    } = props;

    const [isFavorite, setIsFavorite] = React.useState(app.is_favorite);

    const { t } = useTranslation("apps");

    const queryClient = useQueryClient();

    const { mutate: favorite, isLoading } = useMutation(appFavorite, {
        onSuccess: () => {
            queryClient.invalidateQueries([
                APP_BY_ID_QUERY_KEY,
                { systemId: app.system_id, appId: app.id },
            ]);
            setIsFavorite(!isFavorite);
        },
        onError: (e) => {
            showErrorAnnouncer(t("favoritesUpdateError", { error: e }), e);
        },
    });

    const onFavoriteClick = () => {
        favorite({
            isFav: !isFavorite,
            appId: app.id,
            systemId: app.system_id,
        });
    };

    if (isLoading) {
        return <CircularProgress size={24} />;
    } else if (isFavorite) {
        return (
            <Tooltip title={t("removeFromFavorites")}>
                <IconButton
                    id={buildID(baseId, ids.APP_FAVORITE)}
                    onClick={onFavoriteClick}
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
                    onClick={onFavoriteClick}
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

export default withErrorAnnouncer(AppFavorite);
