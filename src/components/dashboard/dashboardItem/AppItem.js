import React from "react";

import Link from "next/link";

import { PlayArrow, Info, Apps } from "@mui/icons-material";
import { IconButton } from "@mui/material";

import { formatDate } from "components/utils/DateFormatter";

import * as constants from "../constants";
import ItemBase, { ItemAction } from "./ItemBase";
import AppFavorite from "components/apps/AppFavorite";
import { useAppLaunchLink } from "components/apps/utils";

const AppItemLaunchAction = ({ app, t, theme }) => {
    const [launchHref, launchAs] = useAppLaunchLink(app.system_id, app.id);

    return (
        <ItemAction ariaLabel={t("launchAria")} tooltipKey="launchAction">
            <Link href={launchHref} as={launchAs} passHref legacyBehavior>
                <IconButton
                    style={{
                        margin: theme.spacing(1),
                    }}
                    size="small"
                >
                    <PlayArrow color="primary" />
                </IconButton>
            </Link>
        </ItemAction>
    );
};

class AppItem extends ItemBase {
    constructor(props) {
        super({
            kind: constants.KIND_APPS,
            content: props.content,
            section: props.section,
            height: props.height,
            width: props.width,
            config: props.config,
        });
    }

    static create(props) {
        const item = new AppItem(props);
        const { setDetailsApp, t, theme } = props;

        // Extract app details. Note: dashboard-aggregator only queries the DE database.
        const app = props.content;

        // Functions to buildID keys and links.
        const baseId = `${constants.KIND_APPS}-${app.system_id}-${app.id}`;
        const buildKey = (keyType) => `${baseId}-${keyType}`;

        return item.addActions(
            [
                app.is_public && (
                    <AppFavorite
                        key={buildKey("favorite")}
                        app={app}
                        isExternal={false}
                        baseId={buildKey("favorite")}
                        buttonStyle={{
                            margin: theme.spacing(1),
                        }}
                    />
                ),
                <AppItemLaunchAction
                    key={buildKey("launch")}
                    app={app}
                    t={t}
                    theme={theme}
                />,
                <ItemAction
                    ariaLabel={t("openDetailsAria")}
                    key={`${constants.KIND_APPS}-${props.content.id}-details`}
                    tooltipKey="detailsAction"
                >
                    <IconButton
                        onClick={() => setDetailsApp(app)}
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
