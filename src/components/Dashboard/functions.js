import { useState, useLayoutEffect } from "react";

import { build as buildID } from "@cyverse-de/ui-lib";

import ids from "./ids";
import * as constants from "./constants";

export const makeID = (...names) => buildID(ids.BASE, ...names);

export const getSectionClass = (section, classes) => {
    let header;
    let avatar;
    switch (section) {
        case constants.SECTION_EVENTS:
            header = classes.cardHeaderEvents;
            avatar = classes.cardHeaderEventsAvatar;
            break;
        case constants.SECTION_NEWS:
            header = classes.cardHeaderNews;
            avatar = classes.cardHeaderNewsAvatar;
            break;
        case constants.SECTION_PUBLIC:
            header = classes.cardHeaderPublic;
            avatar = classes.cardHeaderPublicAvatar;
            break;
        case constants.SECTION_RECENT:
            header = classes.cardHeaderRecent;
            avatar = classes.cardHeaderRecentAvatar;
            break;
        case constants.SECTION_RECENTLY_ADDED:
            header = classes.cardHeaderRecentlyAdded;
            avatar = classes.cardHeaderRecentlyAddedAvatar;
            break;
        default:
            header = classes.cardHeaderDefault;
            avatar = classes.cardHeaderDefaultAvatar;
            break;
    }
    return [header, avatar];
};

export const cleanUsername = (username) => {
    let user;
    if (username) {
        if (username.endsWith(constants.USER_SUFFIX)) {
            user = username.replace(constants.USER_SUFFIX, "");
        } else {
            user = username;
        }
    } else {
        user = constants.CYVERSE;
    }
    return user;
};

export const cleanField = (field, comparator) => {
    let retval;
    if (field.length > comparator) {
        retval = field.slice(0, comparator) + "...";
    } else {
        retval = field;
    }
    return retval;
};

export const cleanDescription = (description) =>
    cleanField(description, constants.DESC_MAX_LENGTH);

export const useDashboardSettings = ({
    width,
    marginRight = 16,
    padding = 16,
}) => {
    //const [columns, setColumns] = useState(5);
    const [cardWidth, setCardWidth] = useState(0);
    const [cardHeight, setCardHeight] = useState(0);

    // This is used because media queries misbehave on the server and this lets
    // us set values before rendering occurs.
    useLayoutEffect(() => {
        let newColumns;

        if (width >= constants.XL_PIXELS) {
            newColumns = constants.XL_NUM_COLUMNS;
        } else if (width >= constants.LG_PIXELS) {
            newColumns = constants.LG_NUM_COLUMNS;
        } else if (width >= constants.MD_PIXELS) {
            newColumns = constants.MD_NUM_COLUMNS;
        } else if (width >= constants.SM_PIXELS) {
            newColumns = constants.SM_NUM_COLUMNS;
        } else if (width >= constants.XS_PIXELS) {
            newColumns = constants.XS_NUM_COLUMNS;
        } else {
            // probably won't get here. probably.
            newColumns = constants.LG_NUM_COLUMNS;
        }
        //setColumns(newColumns);

        const cardWidth = Math.floor(
            width / newColumns - marginRight - (padding * 2) / newColumns
        );

        // Try to get a 4:3 ration for width to height
        const cardHeight = Math.floor(cardWidth - cardWidth / 3);

        setCardWidth(cardWidth);
        setCardHeight(cardHeight);
    }, [width, marginRight, setCardWidth, padding]);

    return [cardWidth, cardHeight];
};
