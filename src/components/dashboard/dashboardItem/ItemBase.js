import React from "react";
import clsx from "clsx";
import { Trans, useTranslation } from "i18n";
import ReactPlayer from "react-player/youtube";

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
} from "@material-ui/core";

import useAnalysisRunTime from "components/analyses/useAnalysisRunTime";
import buildID from "components/utils/DebugIDUtil";
import analysisStatus from "components/models/analysisStatus";

import ids from "../ids";
import * as constants from "../constants";
import * as fns from "../functions";
import useStyles from "./styles";

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

function AnalysisSubheader(props) {
    const { analysis, date: formattedDate } = props;
    const { t } = useTranslation(["dashboard", "apps"]);
    const { elapsedTime } = useAnalysisRunTime(analysis);
    const theme = useTheme();

    const status = analysis.status;
    const statusColor =
        status === analysisStatus.COMPLETED
            ? theme.palette.primary.main
            : status === analysisStatus.RUNNING
            ? theme.palette.success.main
            : status === analysisStatus.FAILED
            ? theme.palette.error.main
            : null;

    return (
        <Trans
            t={t}
            i18nKey={
                elapsedTime
                    ? "analysisRunningOrigination"
                    : "analysisOrigination"
            }
            values={{
                status,
                date: formattedDate,
                runningTime: elapsedTime,
            }}
            components={{
                bold: <strong />,
                status: <span style={{ color: statusColor }} />,
            }}
        />
    );
}

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
    const classes = useStyles({
        width: item.width,
        height: item.height,
        color,
    });

    const { t } = useTranslation(["dashboard", "apps"]);

    const isMediumOrLarger = useMediaQuery(theme.breakpoints.up("md"));

    const cardID = item.id;
    const user = item.username;

    const description = fns.cleanDescription(item.content.description);
    const [origination, date] = item.getOrigination(t);

    return (
        <Card
            classes={{ root: classes.dashboardCard }}
            id={fns.makeID(ids.ITEM, cardID)}
            elevation={4}
        >
            <CardHeader
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
                    item.kind === constants.KIND_ANALYSES ? (
                        <AnalysisSubheader
                            analysis={item.content}
                            date={date}
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
                    classes: { colorPrimary: classes.cardHeaderText },
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
    const classes = useStyles({ width: item.width, height: item.height });
    const { t } = useTranslation(["dashboard", "apps"]);

    const [origination, date] = item.getOrigination(t);
    const description = fns.cleanDescription(item.content.description);
    const user = item.username;

    return (
        <div
            className={clsx(
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
    const classes = useStyles(item);

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
        this.username = fns.cleanUsername(content.username);
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
