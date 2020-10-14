import React, { useState } from "react";

import { useMutation } from "react-query";

import { Launch, Info, People, Apps } from "@material-ui/icons";
import { IconButton, MenuItem } from "@material-ui/core";

import FavoriteIcon from "@material-ui/icons/Favorite";
import UnFavoriteIcon from "@material-ui/icons/FavoriteBorderOutlined";

import { formatDate } from "@cyverse-de/ui-lib";

import NavigationConstants from "common/NavigationConstants";

import { appFavorite } from "serviceFacades/apps";

import * as constants from "../constants";
import ItemBase, { ItemAction } from "./ItemBase";
import { useTranslation } from "i18n";

class AppItem extends ItemBase {
    constructor(props) {
        super({
            kind: constants.KIND_APPS,
            content: props.content,
            section: props.section,
            height: props.height,
            width: props.width,
        });
    }

    static create(props) {
        const item = new AppItem(props);
        const { t } = useTranslation(["dashboard", "apps"]);

        // Extract app details. Note: dashboard-aggregator only queries the DE database.
        const app = props.content;

        // State variables.
        const [isFavorite, setIsFavorite] = useState(app.is_favorite);

        // Functions to build keys and links.
        const baseId = `${constants.KIND_APPS}-${app.system_id}-${app.id}`;
        const buildKey = (keyType) => `${baseId}-${keyType}`;
        const buildRef = (refType) =>
            `${NavigationConstants.APPS}/${app.system_id}/${app.id}/${refType}`;
        const getFavoriteActionKey = () =>
            isFavorite ? "apps:removeFromFavorites" : "apps:addToFavorites";

        const [favorite] = useMutation(appFavorite, {
            onSuccess: () => {
                setIsFavorite(!isFavorite);
            },
            onError: (e) => {
                console.log(e);
            },
        });

        const onFavoriteClick = () => {
            favorite({
                isFav: !app.is_favorite,
                appId: app.id,
                systemId: app.system_id,
            });
        };

        return item
            .addActions([
                <ItemAction
                    ariaLabel={t("favoriteAria")}
                    key={buildKey("favorite")}
                    tooltipKey={getFavoriteActionKey()}
                >
                    <IconButton
                        id={buildKey("favorite-toggleFavorite")}
                        onClick={onFavoriteClick}
                        size="small"
                    >
                        {isFavorite ? (
                            <FavoriteIcon color="primary" />
                        ) : (
                            <UnFavoriteIcon color="primary" />
                        )}
                    </IconButton>
                </ItemAction>,
                <ItemAction
                    ariaLabel={t("launchAria")}
                    key={buildKey("launch")}
                    tooltipKey="launchAction"
                >
                    <IconButton href={buildRef("launch")}>
                        <Launch />
                    </IconButton>
                </ItemAction>,
                <ItemAction
                    ariaLabel={t("shareAria")}
                    key={buildKey("share")}
                    tooltipKey="shareAction"
                >
                    <IconButton href={buildRef("share")}>
                        <People />
                    </IconButton>
                </ItemAction>,
            ])
            .addMenuActions([
                <MenuItem
                    key={`${constants.KIND_APPS}-${props.content.id}-details`}
                >
                    <ItemAction
                        ariaLabel={t("openDetailsAria")}
                        key={`${constants.KIND_APPS}-${props.content.id}-details`}
                        tooltipKey="detailsAction"
                    >
                        <Info />
                    </ItemAction>
                </MenuItem>,
            ]);
    }

    getOrigination(t) {
        let origination;
        let date;

        if (this.content.integration_date) {
            origination = t("integratedBy");
            date = new Date(this.content.integration_date);
        } else {
            origination = t("editedBy");
            date = new Date(this.content.edited_date);
        }

        return [origination, formatDate(date.valueOf())];
    }

    getAvatarIcon(classes) {
        return (
            <Apps
                color="primary"
                classes={{ colorPrimary: classes.avatarIcon }}
            />
        );
    }

    getLinkTarget() {
        return `/apps/${this.content.id}/details`;
    }
}

export default AppItem;
