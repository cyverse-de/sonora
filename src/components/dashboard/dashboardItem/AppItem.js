import React, { useState } from "react";
import { useMutation } from "react-query";

import { Launch, Info, People, Apps } from "@material-ui/icons";
import { IconButton, MenuItem } from "@material-ui/core";

import { formatDate } from "@cyverse-de/ui-lib";

import NavigationConstants from "common/NavigationConstants";

import { appFavorite } from "serviceFacades/apps";

import * as constants from "../constants";
import ItemBase, { ItemAction } from "./ItemBase";
import { useTranslation } from "i18n";
import AppFavorite from "components/apps/AppFavorite";

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
        const { showErrorAnnouncer, setDetailsApp } = props;
        const { t } = useTranslation("dashboard");

        // Extract app details. Note: dashboard-aggregator only queries the DE database.
        const app = props.content;

        // State variables.
        const [isFavorite, setIsFavorite] = useState(app.is_favorite);

        // Functions to build keys and links.
        const baseId = `${constants.KIND_APPS}-${app.system_id}-${app.id}`;
        const buildKey = (keyType) => `${baseId}-${keyType}`;
        const buildHRef = (refType) =>
            `${NavigationConstants.APPS}/${app.system_id}/${app.id}/${refType}`;

        const [favorite] = useMutation(appFavorite, {
            onSuccess: () => {
                setIsFavorite(!isFavorite);
            },
            onError: (e) => {
                showErrorAnnouncer(t("favoritesUpdateError", { error: e }), e);
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
                <AppFavorite
                    key={buildKey("favorite")}
                    isFavorite={isFavorite}
                    isExternal={false}
                    onFavoriteClick={onFavoriteClick}
                    baseId={buildKey("favorite")}
                    size="medium"
                />,
                <ItemAction
                    ariaLabel={t("launchAria")}
                    key={buildKey("launch")}
                    tooltipKey="launchAction"
                >
                    <IconButton href={buildHRef("launch")}>
                        <Launch color="primary" />
                    </IconButton>
                </ItemAction>,
                <ItemAction
                    ariaLabel={t("shareAria")}
                    key={buildKey("share")}
                    tooltipKey="shareAction"
                >
                    <IconButton href={buildHRef("share")}>
                        <People color="primary" />
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
                        <IconButton onClick={() => setDetailsApp(app)}>
                            <Info color="primary" />
                        </IconButton>
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
