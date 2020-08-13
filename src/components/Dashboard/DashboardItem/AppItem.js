import React from "react";

import { Launch, Info, Favorite, People, Apps } from "@material-ui/icons";
import { IconButton, MenuItem } from "@material-ui/core";

import { formatDate } from "@cyverse-de/ui-lib";

import * as constants from "../constants";

import ItemBase, { ItemAction } from "./ItemBase";

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
        return item
            .addActions([
                <ItemAction
                    arialLabel="favorite"
                    key={`${constants.KIND_APPS}-${props.content.id}-favorite`}
                    tooltipKey="favoriteAction"
                >
                    <IconButton>
                        <Favorite />
                    </IconButton>
                </ItemAction>,
                <ItemAction
                    ariaLabel="launch"
                    key={`${constants.KIND_APPS}-${props.content.id}-launch`}
                    tooltipKey="launchAction"
                >
                    <IconButton>
                        <Launch />
                    </IconButton>
                </ItemAction>,
                <ItemAction
                    arialLabel="share"
                    key={`${constants.KIND_APPS}-${props.content.id}-share`}
                    tooltipKey="shareAction"
                >
                    <IconButton>
                        <People />
                    </IconButton>
                </ItemAction>,
            ])
            .addMenuActions([
                <MenuItem
                    key={`${constants.KIND_APPS}-${props.content.id}-details`}
                >
                    <ItemAction
                        arialLabel="open details"
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
