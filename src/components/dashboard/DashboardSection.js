import React, { useState } from "react";

import { Typography, Collapse, Button, Divider } from "@mui/material";

import { useConfig } from "contexts/config";

import getItem from "./dashboardItem";

import useStyles from "./styles";
import * as fns from "./functions";
import * as constants from "./constants";
import ids from "./ids";

const DashboardSection = ({
    t,
    theme,
    name,
    kind,
    items,
    id,
    section,
    cardWidth,
    cardHeight,
    limit,
    numColumns,
    showErrorAnnouncer,
    setDetailsApp,
    setDetailsAnalysis,
    setPendingAnalysis,
    setTerminateAnalysis,
    computeLimitExceeded,
}) => {
    const { classes, cx } = useStyles();
    const [expanded, setExpanded] = useState(false);
    const [config] = useConfig();

    const isNewsSection = section === constants.SECTION_NEWS;
    const isEventsSection = section === constants.SECTION_EVENTS;

    if (!limit) {
        limit = numColumns;
    }

    const displayShowMore = limit < items.length || expanded;

    const itemComponent = (item, index) =>
        getItem({
            kind,
            section,
            content: item,
            height: cardHeight,
            width: cardWidth,
            classes,
            showErrorAnnouncer,
            setDetailsApp,
            setDetailsAnalysis,
            setPendingAnalysis,
            setTerminateAnalysis,
            config,
            theme,
            t,
            computeLimitExceeded,
        }).component(index);

    const uncollapsed = items.slice(0, limit).map(itemComponent);
    const collapsible = items.slice(limit).map(itemComponent);

    return (
        <div
            className={cx(
                classes.section,
                isNewsSection && classes.sectionNews,
                isEventsSection && classes.sectionEvents
            )}
            id={id}
        >
            <Typography
                variant="h6"
                style={{
                    color: theme.palette.info.main,
                }}
            >
                {name}
            </Typography>
            <Divider
                style={{
                    margin: 0,
                    color: theme.palette.info.main,
                }}
            />
            <div className={classes.sectionItems}>{uncollapsed}</div>
            <Collapse in={expanded}>
                <div className={classes.sectionItems}>{collapsible}</div>
            </Collapse>
            {displayShowMore && (
                <Button
                    onClick={() => setExpanded(!expanded)}
                    className={classes.showMoreBtn}
                    color="primary"
                >
                    <Typography variant="button" display="block">
                        {expanded ? t("showFewer") : t("showMore")}
                    </Typography>
                </Button>
            )}
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
        theme,
        cardWidth,
        cardHeight,
        data,
        showDivider,
        numColumns,
        limit,
        showErrorAnnouncer,
        setDetailsApp,
        setDetailsAnalysis,
        setPendingAnalysis,
        setTerminateAnalysis,
        computeLimitExceeded,
    }) {
        let sectionItems;

        if (data && Array.isArray(data[this.kind])) {
            sectionItems = data[this.kind];
        } else
            sectionItems = data[this.kind][this.name].sort((first, second) => {
                const firstParsed = Date.parse(first.date_added);
                const secondParsed = Date.parse(second.date_added);

                let retval;

                // The return values are reversed so we get reverse chronological order.
                if (firstParsed < secondParsed) {
                    retval = 1;
                } else if (firstParsed > secondParsed) {
                    retval = -1;
                } else {
                    retval = 0;
                }

                return retval;
            });
        return (
            <DashboardSection
                id={this.id}
                kind={this.kind}
                key={`${this.kind}-${this.name}`}
                items={sectionItems}
                name={t(this.label)}
                section={this.name}
                showDivider={showDivider}
                cardWidth={cardWidth}
                cardHeight={cardHeight}
                numColumns={numColumns}
                limit={limit}
                showErrorAnnouncer={showErrorAnnouncer}
                setDetailsApp={setDetailsApp}
                setDetailsAnalysis={setDetailsAnalysis}
                setPendingAnalysis={setPendingAnalysis}
                setTerminateAnalysis={setTerminateAnalysis}
                computeLimitExceeded={computeLimitExceeded}
                t={t}
                theme={theme}
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

export class RecentlyUsedApps extends SectionBase {
    constructor() {
        super(
            constants.KIND_APPS,
            constants.SECTION_RECENTLY_USED,
            "recentlyUsedApps",
            ids.SECTION_RECENTLY_USED_APPS
        );
    }
}

export class PopularFeaturedApps extends SectionBase {
    constructor() {
        super(
            constants.KIND_APPS,
            constants.SECTION_POPULAR_FEATURED,
            "popularFeaturedApps",
            ids.SECTION_POPULAR_FEATURED_APPS
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

export class InstantLaunches extends SectionBase {
    constructor() {
        super(
            constants.KIND_INSTANT_LAUNCHES,
            constants.SECTION_INSTANT_LAUNCHES,
            "instantLaunches",
            ids.SECTION_INSTANT_LAUNCHES
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
            params.limit = Math.ceil(params.numColumns / 2);
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
        if (params.numColumns > 1) {
            params.numColumns = Math.ceil(params.numColumns - 1);
            const dimMulti = 1.0 + 1 / params.numColumns;
            params.cardHeight = params.cardHeight * dimMulti;
            params.cardWidth = params.cardWidth * dimMulti;
        }

        return super.getComponent(params);
    }
}
