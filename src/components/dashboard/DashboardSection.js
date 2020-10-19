import React, { useState } from "react";
import clsx from "clsx";

import { Typography, Collapse, Button } from "@material-ui/core";

import getItem from "./dashboardItem";

import useStyles from "./styles";
import * as fns from "./functions";
import * as constants from "./constants";
import ids from "./ids";
import { useTranslation } from "i18n";

const DashboardSection = ({
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
}) => {
    const classes = useStyles();
    const { t } = useTranslation("dashboard");
    const [expanded, setExpanded] = useState(false);

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

            <Collapse in={expanded}>
                <div className={classes.sectionItems}>{collapsible}</div>
            </Collapse>

            {displayShowMore && (
                <Button
                    onClick={() => setExpanded(!expanded)}
                    className={classes.showMoreBtn}
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
        cardWidth,
        cardHeight,
        data,
        showDivider,
        numColumns,
        limit,
        showErrorAnnouncer,
        setDetailsApp,
    }) {
        const sorted = data[this.kind][this.name].sort((first, second) => {
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
                items={sorted}
                name={t(this.label)}
                section={this.name}
                showDivider={showDivider}
                cardWidth={cardWidth}
                cardHeight={cardHeight}
                numColumns={numColumns}
                limit={limit}
                showErrorAnnouncer={showErrorAnnouncer}
                setDetailsApp={setDetailsApp}
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
