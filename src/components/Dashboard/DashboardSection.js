import React, { useLayoutEffect, useState, useRef } from "react";

import { Divider, Typography } from "@material-ui/core";

import { getMessage } from "@cyverse-de/ui-lib";

import DashboardItem from "./DashboardItem";

import useStyles from "./styles";
import * as fns from "./functions";
import * as constants from "./constants";
import ids from "./ids";

const DashboardSection = ({ name, kind, items, id, section, intl }) => {
    const classes = useStyles();

    const dashboardEl = useRef();

    // Adapted from https://stackoverflow.com/questions/49058890/how-to-get-a-react-components-size-height-width-before-render
    // and https://stackoverflow.com/questions/19014250/rerender-view-on-browser-resize-with-react/19014495#19014495
    const [dimensions, setDimensions] = useState({ height: 0, width: 0 });

    useLayoutEffect(() => {
        function updater() {
            if (dashboardEl.current) {
                setDimensions({
                    width: dashboardEl.current.offsetWidth,
                    height: dashboardEl.current.offsetHeight,
                });
            }
        }
        window.addEventListener("resize", updater);
        updater();
        return () => window.removeEventListener("resize", updater);
    }, [dashboardEl, setDimensions]);

    const [columns, width, height] = fns.useDashboardSettings(dimensions);

    return (
        <div className={classes.section} id={id}>
            <Typography
                noWrap
                gutterBottom
                variant="h5"
                component="h5"
                color="primary"
            >
                {name}
            </Typography>

            <Divider classes={{ root: classes.dividerRoot }} />

            <div ref={dashboardEl} className={classes.sectionItems}>
                {items.map((item) => (
                    <DashboardItem
                        kind={kind}
                        content={item}
                        key={item.id}
                        section={section}
                        intl={intl}
                        columns={columns}
                        width={width}
                        height={height}
                    />
                ))}
            </div>
        </div>
    );
};

class SectionBase {
    constructor(kind, name, labelName, idBase) {
        this.kind = kind;
        this.name = name;
        this.label = getMessage(labelName);
        this.id = fns.makeID(idBase);
    }

    getComponent({ intl, data }) {
        return (
            <DashboardSection
                id={this.id}
                kind={this.kind}
                key={`${this.kind}-${this.name}`}
                items={data[this.kind][this.name]}
                name={this.label}
                section={this.name}
                intl={intl}
            />
        );
    }
}

export class RecentAnalyses extends SectionBase {
    constructor() {
        super(
            constants.KIND_ANALYSES,
            constants.SECTION_RECENT,
            "recentAnalyses",
            ids.SECTION_RECENT_ANALYSES
        );
    }
}

export class RunningAnalyses extends SectionBase {
    constructor() {
        super(
            constants.KIND_ANALYSES,
            constants.SECTION_RUNNING,
            "runningAnalyses",
            ids.SECTION_RECENT_ANALYSES
        );
    }
}

export class RecentlyAddedApps extends SectionBase {
    constructor() {
        super(
            constants.KIND_APPS,
            constants.SECTION_RECENTLY_ADDED,
            "recentlyAddedApps",
            ids.SECTION_RECENTLY_ADDED_APPS
        );
    }
}

export class PublicApps extends SectionBase {
    constructor() {
        super(
            constants.KIND_APPS,
            constants.SECTION_PUBLIC,
            "publicApps",
            ids.SECTION_PUBLIC_APPS
        );
    }
}

export class NewsFeed extends SectionBase {
    constructor() {
        super(
            constants.KIND_FEEDS,
            constants.SECTION_NEWS,
            "newsFeed",
            ids.SECTION_NEWS
        );
    }
}

export class EventsFeed extends SectionBase {
    constructor() {
        super(
            constants.KIND_EVENTS,
            constants.SECTION_EVENTS,
            "eventsFeed",
            ids.SECTION_EVENTS
        );
    }
}
