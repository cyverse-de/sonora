import React, { useState } from "react";
import { useQueryClient, useMutation } from "react-query";

import Link from "next/link";

import { PlayArrow, Info, Apps } from "@mui/icons-material";
import { IconButton } from "@mui/material";

import { formatDate } from "components/utils/DateFormatter";

import { appFavorite, APP_BY_ID_QUERY_KEY } from "serviceFacades/apps";

import * as constants from "../constants";
import ItemBase, { ItemAction } from "./ItemBase";
import AppFavorite from "components/apps/AppFavorite";
import { useAppLaunchLink } from "components/apps/utils";

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
        const { showErrorAnnouncer, setDetailsApp, t, theme } = props;

        // Extract app details. Note: dashboard-aggregator only queries the DE database.
        const app = props.content;

        // State variables.
        const [isFavorite, setIsFavorite] = useState(app.is_favorite);

        // Functions to buildID keys and links.
        const baseId = `${constants.KIND_APPS}-${app.system_id}-${app.id}`;
        const buildKey = (keyType) => `${baseId}-${keyType}`;

        // Get QueryClient from the context
        const queryClient = useQueryClient();

        const { mutate: favorite } = useMutation(appFavorite, {
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

        const [launchHref, launchAs] = useAppLaunchLink(app.system_id, app.id);
        return item.addActions(
            [
                app.is_public && (
                    <AppFavorite
                        key={buildKey("favorite")}
                        isFavorite={isFavorite}
                        isExternal={false}
                        onFavoriteClick={onFavoriteClick}
                        baseId={buildKey("favorite")}
                        buttonStyle={{
                            margin: theme.spacing(1),
                        }}
                    />
                ),
                <ItemAction
                    ariaLabel={t("launchAria")}
                    key={buildKey("launch")}
                    tooltipKey="launchAction"
                >
                    <Link href={launchHref} as={launchAs} passHref>
                        <IconButton
                            style={{
                                margin: theme.spacing(1),
                            }}
                            size="small"
                        >
                            <PlayArrow color="primary" />
                        </IconButton>
                    </Link>
                </ItemAction>,
                <ItemAction
                    ariaLabel={t("openDetailsAria")}
                    key={`${constants.KIND_APPS}-${props.content.id}-details`}
                    tooltipKey="detailsAction"
                >
                    <IconButton
                        onClick={() =>
                            setDetailsApp({
                                ...app,
                                onFavoriteUpdated: (isFavoriteNow) =>
                                    setIsFavorite(!isFavoriteNow),
                            })
                        }
                        style={{
                            margin: theme.spacing(1),
                        }}
                        size="small"
                    >
                        <Info color="primary" />
                    </IconButton>
                </ItemAction>,
            ].filter((e) => e)
        );
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
