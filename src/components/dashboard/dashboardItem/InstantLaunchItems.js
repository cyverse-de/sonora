import React from "react";

import { formatDate } from "@cyverse-de/ui-lib";

import { IconButton } from "@material-ui/core";
import { Info, InsertEmoticon as Smiley } from "@material-ui/icons";

import * as constants from "../constants";
import ItemBase, { ItemAction } from "./ItemBase";
import InstantLaunchButton from "components/instantlaunches";

const sanitizeContent = (content) => {
    return {
        ...content,
        user: content.integrator,
        description: content.app_description,
        name: content.app_name,
    };
};

class InstantLaunchItem extends ItemBase {
    constructor(props) {
        super({
            kind: constants.KIND_INSTANT_LAUNCHES,
            content: sanitizeContent(props.content),
            section: props.section,
            height: props.height,
            width: props.width,
        });
    }

    static create(props) {
        const item = new InstantLaunchItem(props);
        const {
            showErrorAnnouncer,
            setDetailsApp,
            t,
            theme,
            content: instantLaunch,
        } = props;

        const baseId = `${constants.KIND_INSTANT_LAUNCHES}-${instantLaunch.id}`;
        const buildKey = (keyType) => `${baseId}-${keyType}`;

        // Leave the resource unset in the InstantLaunchButton to launch something without inputs.
        return item.addActions([
            <ItemAction
                ariaLabel={t("launchAria")}
                key={buildKey("launch")}
                tooltipKey="launchAction"
            >
                <InstantLaunchButton
                    instantLaunch={instantLaunch}
                    showErrorAnnouncer={showErrorAnnouncer}
                />
            </ItemAction>,

            <ItemAction
                ariaLabel={t("openDetailsAria")}
                key={`${constants.KIND_INSTANT_LAUNCHES}-${instantLaunch.id}-details`}
                tooltipKey="detailsAction"
            >
                <IconButton
                    onClick={() =>
                        setDetailsApp({
                            id: instantLaunch.app_id,
                            system_id:
                                instantLaunch.submission?.system_id ||
                                constants.DEFAULT_SYSTEM_ID,
                            onFavoriteUpdated: () => {},
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
        ]);
    }

    getOrigination(t) {
        const date = new Date(this.content.added_on);
        return [t("integratedBy"), formatDate(date.valueOf())];
    }

    getAvatarIcon(classes) {
        return (
            <Smiley
                color="primary"
                classes={{ colorPrimary: classes.avatarIcon }}
            />
        );
    }
}

export default InstantLaunchItem;
