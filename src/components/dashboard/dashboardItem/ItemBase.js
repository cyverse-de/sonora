import React from "react";
import ReactPlayer from "react-player/youtube";
import { useTranslation } from "i18n";

import AnalysisSubheader from "./AnalysisSubheader";
import useAnalysisTimeLimitCountdown from "components/analyses/useAnalysisTimeLimitCountdown";
import buildID from "components/utils/DebugIDUtil";
import analysisStatus from "components/models/analysisStatus";

import {
    Avatar,
    Card,
    CardContent,
    CardHeader,
    Link,
    Tooltip,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";

import { makeStyles } from "tss-react/mui";

import styles from "components/utils/runningAnimation";

import ids from "../ids";
import * as constants from "../constants";
import * as fns from "../functions";
import useStyles from "./styles";

import { getUserName } from "../../utils/getUserName";

const useRunningAnalysesStyles = makeStyles()(styles);

const DashboardLink = ({ target, kind, children }) => {
    const isNewTab =
        kind === constants.KIND_EVENTS || kind === constants.KIND_FEEDS;

    return isNewTab ? (
        <Link
            href={target}
            target="_blank"
            rel="noopener noreferrer"
            color="inherit"
            underline="always"
        >
            {children}
        </Link>
    ) : (
        <Link href={target} color="inherit" underline="always">
            {children}
        </Link>
    );
};

/**
 * An item in the dashboard.
 *
 * @param {Object} props - The props for the component.
 * @param {String} props.kind - The kind of item. Example: "app" or "analysis".
 * @param {Object} props.content - The content for the item returned from the API.
 * @returns {Object}
 */
const DashboardItem = ({ item }) => {
    const theme = useTheme();
    const color = getSectionColor(item.section, theme);
    const { classes } = useStyles({
        width: item.width,
        height: item.height,
        color,
    });
    const { classes: running } = useRunningAnalysesStyles();

    const { t } = useTranslation(["dashboard", "apps", "analyses"]);

    const isMediumOrLarger = useMediaQuery(theme.breakpoints.up("md"));

    const cardID = item.id;
    const user = item.username;

    const description = fns.cleanDescription(item.content.description);
    const [origination, date] = item.getOrigination(t);

    const isAnalysis = item.kind === constants.KIND_ANALYSES;
    const isRunningAnalysis =
        isAnalysis && item.content.status === analysisStatus.RUNNING;

    const { timeLimitCountdown } = useAnalysisTimeLimitCountdown(
        isRunningAnalysis && item.content
    );

    return (
        <Card
            classes={{ root: classes.dashboardCard }}
            id={fns.makeID(ids.ITEM, cardID)}
            elevation={4}
        >
            <CardHeader
                className={isRunningAnalysis ? running.backdrop : undefined}
                avatar={
                    isMediumOrLarger && (
                        <Avatar className={classes.avatar}>
                            {item.getAvatarIcon(classes)}
                        </Avatar>
                    )
                }
                classes={{
                    root: classes.cardHeaderDefault,
                    content: classes.cardHeaderContent,
                }}
                title={item.content.name}
                titleTypographyProps={{
                    noWrap: true,
                    variant: "subtitle2",
                    classes: { colorPrimary: classes.cardHeaderText },
                }}
                subheader={
                    isAnalysis ? (
                        <AnalysisSubheader
                            analysis={item.content}
                            date={date}
                            timeLimitCountdown={timeLimitCountdown}
                        />
                    ) : (
                        t("origination", {
                            origination,
                            user,
                            date,
                        })
                    )
                }
                subheaderTypographyProps={{
                    noWrap: true,
                    variant: "caption",
                    style:
                        isRunningAnalysis && timeLimitCountdown
                            ? {
                                  color: theme.palette.primary.main,
                              }
                            : null,
                }}
            />
            <CardContent
                classes={{
                    root: classes.root,
                }}
            >
                <Typography
                    color="textSecondary"
                    variant="body2"
                    style={{ overflow: "ellipsis", height: "4.0em" }}
                >
                    {description || t("noDescriptionProvided")}
                </Typography>
            </CardContent>

            <div
                style={{
                    display: "flex",
                    direction: "row",
                }}
            >
                {item.actions}
            </div>
        </Card>
    );
};

export const DashboardFeedItem = ({ item }) => {
    const { classes, cx } = useStyles({
        width: item.width,
        height: item.height,
    });
    const { t } = useTranslation(["dashboard", "apps"]);

    const [origination, date] = item.getOrigination(t);
    const description = fns.cleanDescription(item.content.description);
    const user = item.username;

    return (
        <div
            className={cx(
                item.section === constants.SECTION_NEWS && classes.newsItem,
                item.section === constants.SECTION_EVENTS && classes.eventsItem
            )}
        >
            <Typography variant="h6" color="primary">
                <DashboardLink target={item.getLinkTarget()} kind={item.kind}>
                    {item.content.name}
                </DashboardLink>
            </Typography>

            <Typography noWrap color="textSecondary" variant="subtitle2">
                {t("origination", {
                    origination,
                    user,
                    date,
                })}
            </Typography>

            <Typography variant="body2" component="p">
                {description || t("noDescriptionProvided")}
            </Typography>
        </div>
    );
};

export const DashboardVideoItem = ({ item }) => {
    const { classes } = useStyles(item);

    return (
        <div
            className={classes.dashboardVideo}
            aria-label={item.content.name}
            title={item.content.name}
            width="100%"
            height="100%"
        >
            <ReactPlayer
                url={item.getLinkTarget()}
                light={item.content.thumbnailUrl || true}
                width="100%"
                height="100%"
                playing={true}
                controls={true}
            />
        </div>
    );
};

export const ItemAction = ({ children, tooltipKey, ariaLabel }) => {
    const { t } = useTranslation(["dashboard", "apps"]);

    // The nested div prevents props from the Tooltip from getting propagated
    // down to components that may not support them, like Next.js's Link.
    return (
        <Tooltip title={t(tooltipKey)} aria-label={ariaLabel}>
            <div>{children}</div>
        </Tooltip>
    );
};

export const getSectionColor = (section, theme) => {
    let color;

    switch (section) {
        case constants.SECTION_EVENTS:
            color = theme.palette.primary.violet;
            break;
        case constants.SECTION_NEWS:
            color = theme.palette.indigo;
            break;
        case constants.SECTION_PUBLIC:
            color = theme.palette.darkNavy;
            break;
        case constants.SECTION_RECENT:
            color = theme.palette.navy;
            break;
        case constants.SECTION_RECENTLY_ADDED:
            color = theme.palette.gold;
            break;
        default:
            color = theme.palette.primary.main;
            break;
    }

    return color;
};

class ItemBase {
    constructor({
        kind,
        section,
        content,
        height,
        width,
        config,
        actions = [],
        menuActions = [],
    }) {
        this.kind = kind;
        this.section = section;
        this.content = content;
        this.actions = actions;
        this.height = height;
        this.width = width;
        this.id = buildID(content.id);
        this.username = getUserName(content.username, config);
        this.menuActions = menuActions;
    }

    addActions(actions) {
        this.actions = [...this.actions, ...actions];
        return this;
    }

    addMenuActions(actions) {
        this.menuActions = [...this.menuActions, ...actions];
        return this;
    }

    // meant to be implemented by sub-classes.
    getOrigination(_intl) {
        return [];
    }

    getAvatarIcon(_classes) {
        return {};
    }

    getLinkTarget() {
        return this.content.link;
    }

    component(index) {
        return <DashboardItem key={fns.makeID(this.id, index)} item={this} />;
    }
}

export default ItemBase;
