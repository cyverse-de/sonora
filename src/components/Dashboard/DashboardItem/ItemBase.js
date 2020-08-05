import React from "react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

import {
    Avatar,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Link,
    useMediaQuery,
    Typography,
    IconButton,
} from "@material-ui/core";

import { useTheme } from "@material-ui/styles";

import { build as buildID } from "@cyverse-de/ui-lib";

import ids from "../ids";
import * as constants from "../constants";
import * as fns from "../functions";
import useStyles from "../styles";

const DashboardLink = ({ target, kind, headerClass, children }) => {
    const isNewTab =
        kind === constants.KIND_EVENTS || kind === constants.KIND_FEEDS;

    return isNewTab ? (
        <Link
            href={target}
            target="_blank"
            rel="noopener noreferrer"
            color="inherit"
            underline="always"
            classes={{ root: headerClass }}
        >
            {children}
        </Link>
    ) : (
        <Link
            href={target}
            color="inherit"
            underline="always"
            classes={{ root: headerClass }}
        >
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
    const classes = useStyles({ width: item.width, height: item.height });
    const theme = useTheme();
    const { t } = useTranslation("dashboard");

    const isMediumOrLarger = useMediaQuery(theme.breakpoints.up("md"));

    const cardID = item.id;
    const user = item.username;

    const description = fns.cleanDescription(item.content.description);
    const [origination, date] = item.getOrigination(t);

    const rootClass = clsx(classes.cardHeaderDefault, item.headerClass);

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
                            {item.getAvatarIcon()}
                        </Avatar>
                    )
                }
                classes={{
                    root: rootClass,
                    content: classes.cardHeaderContent,
                }}
                title={
                    <Typography
                        noWrap={true}
                        variant="h6"
                        color="primary"
                        classes={{ root: classes.cardHeaderText }}
                    >
                        <DashboardLink
                            target={item.getLinkTarget()}
                            kind={item.kind}
                            headerClass={item.headerClass}
                        >
                            {item.content.name}
                        </DashboardLink>
                    </Typography>
                }
                titleTypographyProps={{
                    noWrap: true,
                    variant: "h6",
                    color: "primary",
                    classes: { colorPrimary: classes.cardHeaderText },
                }}
                subheader={
                    <Typography
                        noWrap
                        color="textSecondary"
                        variant="subtitle2"
                        classes={{
                            colorTextSecondary: classes.cardHeaderText,
                        }}
                    >
                        {`${origination} ${user} on ${date}`}
                    </Typography>
                }
            />
            <CardContent
                classes={{
                    root: classes.root,
                }}
            >
                <Typography color="textSecondary" variant="body2" component="p">
                    {description || t("noDescriptionProvided")}
                </Typography>
            </CardContent>

            <CardActions
                classes={{
                    root: classes.actionsRoot,
                }}
            >
                {item.actions}
            </CardActions>
        </Card>
    );
};

export const DashboardFeedItem = ({ item }) => {
    const classes = useStyles({ width: item.width, height: item.height });
    const { t } = useTranslation("dashboard");

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
                <DashboardLink
                    target={item.getLinkTarget()}
                    kind={item.kind}
                    headerClass={item.headerClass}
                >
                    {item.content.name}
                </DashboardLink>
            </Typography>

            <Typography noWrap color="textSecondary" variant="subtitle2">
                {`${origination} ${user} on ${date}`}
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
        <iframe
            className={classes.dashboardVideo}
            aria-label={item.content.name}
            title={item.content.name}
            width="100%"
            height="100%"
            src={item.getLinkTarget()}
            frameBorder="0"
            controls="1"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
        ></iframe>
    );
};

export const ItemAction = ({ children, ariaLabel, handleClick }) => (
    <IconButton aria-label={ariaLabel} onClick={handleClick}>
        {children}
    </IconButton>
);

class ItemBase {
    constructor({
        kind,
        section,
        content,
        height,
        width,
        classes,
        actions = [],
    }) {
        this.kind = kind;
        this.section = section;
        this.content = content;
        this.actions = actions;
        this.height = height;
        this.width = width;
        this.id = buildID(content.id);
        this.username = fns.cleanUsername(content.username);
        this.classes = classes;
        this.headerClass = null;
        this.avatarClass = null;
    }

    addActions(actions) {
        this.actions = [...this.actions, ...actions];
        return this;
    }

    // meant to be implemented by sub-classes.
    getOrigination(_intl) {
        return [];
    }

    getAvatarIcon(_colorClass) {
        return {};
    }

    setSectionClass() {
        const [headerClass, avatarClass] = fns.getSectionClass(
            this.section,
            this.classes
        );
        this.headerClass = headerClass;
        this.avatarClass = avatarClass;
        return this;
    }

    getLinkTarget() {
        return this.content.link;
    }

    component(index) {
        return <DashboardItem key={fns.makeID(this.id, index)} item={this} />;
    }
}

export default ItemBase;
