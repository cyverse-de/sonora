import React from "react";

import { Launch, Info, Favorite, People, Apps } from "@material-ui/icons";
import { IconButton, MenuItem } from "@material-ui/core";

import { formatDate } from "@cyverse-de/ui-lib";

import NavigationConstants from "common/NavigationConstants";

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
        const { t } = useTranslation("dashboard");

        // Functions to build keys and links.
        const app = props.content;
        const buildKey = (keyType) =>
            `${constants.KIND_APPS}-${app.system_id}-${app.id}-${keyType}`;
        const buildRef = (refType) =>
            `${NavigationConstants.APPS}/${app.system_id}/${app.id}/${refType}`;

        console.log(props);

        return item
            .addActions([
                <ItemAction
                    ariaLabel={t("favoriteAria")}
                    key={buildKey("favorite")}
                    tooltipKey="favoriteAction"
                >
                    <IconButton href={buildRef("favorite")}>
                        <Favorite />
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
