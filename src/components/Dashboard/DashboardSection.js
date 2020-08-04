import React from "react";
import clsx from "clsx";

import { Divider, Typography, Collapse, Button } from "@material-ui/core";

import getItem from "./DashboardItem";

import useStyles from "./styles";
import * as fns from "./functions";
import * as constants from "./constants";
import ids from "./ids";
import { useTranslation } from "react-i18next";

const DashboardSection = ({
    name,
    kind,
    items,
    id,
    section,
    cardWidth,
    cardHeight,
    showDivider = true,
    limit,
    numColumns,
}) => {
    const classes = useStyles();
    const { t } = useTranslation("dashboard");
    const [expanded, setExpanded] = React.useState(false);

    const isNewsSection = section === constants.SECTION_NEWS;
    const isEventsSection = section === constants.SECTION_EVENTS;

    if (!limit) {
        limit = numColumns;
    }

    console.log(`${section} ${limit}`);

    const itemComponent = (item, index) =>
        getItem({
            kind,
            section,
            content: item,
            height: cardHeight,
            width: cardWidth,
            classes,
        }).component(index);

    const uncollapsed = items.slice(0, limit).map(itemComponent);
    const collapsible = items.slice(limit).map(itemComponent);

    return (
        <div
            className={clsx(
                classes.section,
                isNewsSection && classes.sectionNews,
                isEventsSection && classes.sectionEvents
            )}
            id={id}
        >
            {showDivider && <Divider classes={{ root: classes.dividerRoot }} />}

            <Typography
                noWrap
                gutterBottom
                variant="h5"
                component="h5"
                color="primary"
            >
                {name}
            </Typography>

            <div className={classes.sectionItems}>{uncollapsed}</div>

            <Collapse collapseHeight={`${cardHeight + 32}px`} in={expanded}>
                <div className={classes.sectionItems}>{collapsible}</div>
            </Collapse>

            <Button
                onClick={() => setExpanded(!expanded)}
                className={classes.showMoreBtn}
            >
                <Typography variant="button" display="block">
                    {expanded ? t("showFewer") : t("showMore")}
                </Typography>
            </Button>
        </div>
    );
};

class SectionBase {
    constructor(kind, name, labelName, idBase) {
        this.kind = kind;
        this.name = name;
        this.label = labelName;
        this.id = fns.makeID(idBase);
    }

    getComponent({
        t,
        cardWidth,
        cardHeight,
        data,
        showDivider,
        numColumns,
        limit,
    }) {
        return (
            <DashboardSection
                id={this.id}
                kind={this.kind}
                key={`${this.kind}-${this.name}`}
                items={data[this.kind][this.name]}
                name={t(this.label)}
                section={this.name}
                showDivider={showDivider}
                cardWidth={cardWidth}
                cardHeight={cardHeight}
                numColumns={numColumns}
                limit={limit}
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

    getComponent(params) {
        return super.getComponent(params);
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
    getComponent(params) {
        return super.getComponent(params);
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
    getComponent(params) {
        return super.getComponent(params);
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

    getComponent(params) {
        return super.getComponent(params);
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

    getComponent(params) {
        if (!params.limit) {
            params.limit = (params.numColumns - 1) * 2;
        }
        return super.getComponent(params);
    }
}

export class EventsFeed extends SectionBase {
    constructor() {
        super(
            constants.KIND_FEEDS,
            constants.SECTION_EVENTS,
            "eventsFeed",
            ids.SECTION_EVENTS
        );
    }

    getComponent(params) {
        if (!params.limit) {
            params.limit = (params.numColumns - 2) * 2;
        }
        return super.getComponent(params);
    }
}

export class VideosFeed extends SectionBase {
    constructor() {
        super(
            constants.KIND_FEEDS,
            constants.SECTION_VIDEOS,
            "videosFeed",
            ids.SECTION_VIDEOS
        );
    }

    getComponent(params) {
        return super.getComponent(params);
    }
}
