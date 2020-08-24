import { useState, useLayoutEffect, useEffect } from "react";

import { build as buildID } from "@cyverse-de/ui-lib";

import ids from "./ids";
import * as constants from "./constants";

export const makeID = (...names) => buildID(ids.BASE, ...names);

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

// Adapted from https://medium.com/@alexandereardon/uselayouteffect-and-ssr-192986cdcf7a
// Should get react to shut up about useLayoutEffect with SSR, which gets displayed even
// though we actually have a legitimate use-case for useLayoutEffect below.
const useIsomorphicLayoutEffect =
    typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Adapted from https://stackoverflow.com/questions/49058890/how-to-get-a-react-components-size-height-width-before-render
// and https://stackoverflow.com/questions/19014250/rerender-view-on-browser-resize-with-react/19014495#19014495
export const useDashboardSettings = ({ marginRight = 16, dashboardEl }) => {
    const [dimensions, setDimensions] = useState({
        height: 0,
        width: 0,
        paddingLeft: 0,
        paddingRight: 0,
    });
    const [cardWidth, setCardWidth] = useState(0);
    const [cardHeight, setCardHeight] = useState(0);
    const [numColumns, setNumColumns] = useState(0);

    useIsomorphicLayoutEffect(() => {
        function updater() {
            if (dashboardEl.current) {
                setDimensions({
                    width: dashboardEl.current.offsetWidth,
                    height: dashboardEl.current.offsetHeight,
                    paddingLeft: parseFloat(
                        window
                            .getComputedStyle(dashboardEl.current)
                            .getPropertyValue("padding-left")
                    ),
                    paddingRight: parseFloat(
                        window
                            .getComputedStyle(dashboardEl.current)
                            .getPropertyValue("padding-right")
                    ),
                });
            }
        }
        window.addEventListener("resize", updater);
        updater();
        return () => window.removeEventListener("resize", updater);
    }, [dashboardEl, setDimensions]);

    // This is used because media queries misbehave on the server and this lets
    // us set values before rendering occurs.
    useIsomorphicLayoutEffect(() => {
        const { width, paddingLeft, paddingRight } = dimensions;

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

        const actualWidth = width - paddingLeft - paddingRight;

        // Yeah, the 6 is magical. Haven't figured out why it's needed yet.
        const cardWidth =
            newColumns > 1
                ? Math.floor(actualWidth / newColumns - marginRight) - 6
                : actualWidth;

        // Try to get a 4:3 ration for width to height
        const cardHeight = Math.floor(cardWidth - cardWidth / 3);

        setCardWidth(cardWidth);
        setCardHeight(cardHeight);
        setNumColumns(newColumns);
    }, [dimensions, marginRight, setCardWidth, numColumns, setNumColumns]);

    return [cardWidth, cardHeight, numColumns];
};
