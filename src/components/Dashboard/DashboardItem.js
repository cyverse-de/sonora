import React from "react";
import clsx from "clsx";

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

import { build as buildID, getMessage } from "@cyverse-de/ui-lib";

import * as fns from "./functions";
import * as constants from "./constants";
import ids from "./ids";
import useStyles from "./styles";
import {
    Launch,
    Info,
    Favorite,
    Share,
    Replay,
    Stop,
    FolderOpen,
    Twitter,
    Facebook,
    OpenInBrowser,
    CalendarToday,
} from "@material-ui/icons";

const DashboardLink = ({ kind, content, headerClass, children }) => {
    const isNewTab =
        kind === constants.KIND_EVENTS || kind === constants.KIND_FEEDS;
    const target = fns.getLinkTarget(kind, content);

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
const DashboardItem = ({
    kind,
    content,
    section,
    intl,
    width,
    height,
    actions,
}) => {
    const classes = useStyles({ width, height });
    const theme = useTheme();

    const isMediumOrLarger = useMediaQuery(theme.breakpoints.up("md"));

    const cardID = buildID(kind, content.id);

    const description = fns.cleanDescription(content.description);
    const [origination, date] = fns.getOrigination(kind, content, intl);
    const user = fns.cleanUsername(content.username);
    const [headerClass, avatarClass] = fns.getSectionClass(section, classes);
    const rootClass = clsx(classes.cardHeaderDefault, headerClass);

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
                            {fns.getAvatarIcon(kind, avatarClass)}
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
                            kind={kind}
                            content={content}
                            headerClass={headerClass}
                        >
                            {content.name}
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
                    {description || getMessage("noDescriptionProvided")}
                </Typography>
            </CardContent>

            <CardActions
                classes={{
                    root: classes.actionsRoot,
                }}
            >
                {actions}
            </CardActions>
        </Card>
    );
};

const ItemAction = ({ children, ariaLabel, handleClick }) => (
    <IconButton aria-label={ariaLabel} onClick={handleClick}>
        {children}
    </IconButton>
);

export class ItemBase {
    constructor({ kind, content, actions = [] }) {
        this.kind = kind;
        this.content = content;
        this.actions = actions;
    }

    addAction(action) {
        this.actions = [...this.actions, action];
        return this;
    }

    getComponent(props) {
        return (
            <DashboardItem kind={this.kind} content={this.content} {...props} />
        );
    }
}

export class AppItem extends ItemBase {
    constructor(content) {
        super({
            kind: constants.KIND_APPS,
            content: content,
            actions: [
                <ItemAction
                    ariaLabel="launch"
                    key={`${constants.KIND_APPS}-${content.id}-launch`}
                >
                    <Launch />
                </ItemAction>,
                <ItemAction
                    arialLabel="open details"
                    key={`${constants.KIND_APPS}-${content.id}-details`}
                >
                    <Info />
                </ItemAction>,
                <ItemAction
                    arialLabel="favorite"
                    key={`${constants.KIND_APPS}-${content.id}-favorite`}
                >
                    <Favorite />
                </ItemAction>,
                <ItemAction
                    arialLabel="share"
                    key={`${constants.KIND_APPS}-${content.id}-share`}
                >
                    <Share />
                </ItemAction>,
            ],
        });
    }
}

export class AnalysesItem extends ItemBase {
    constructor(content) {
        super({
            kind: constants.KIND_ANALYSES,
            content: content,
            actions: [
                <ItemAction
                    ariaLabel="relaunch"
                    key={`${constants.KIND_ANALYSES}-${content.id}-relaunch`}
                >
                    <Replay />
                </ItemAction>,
                <ItemAction
                    ariaLabel="stop"
                    key={`${constants.KIND_ANALYSES}-${content.id}-stop`}
                >
                    <Stop />
                </ItemAction>,
                <ItemAction
                    ariaLabel="open details"
                    key={`${constants.KIND_ANALYSES}-${content.id}-details`}
                >
                    <Info />
                </ItemAction>,
                <ItemAction
                    ariaLabel="share"
                    key={`${constants.KIND_ANALYSES}-${content.id}-share`}
                >
                    <Share />
                </ItemAction>,
                <ItemAction
                    ariaLabel="go to output files"
                    key={`${constants.KIND_ANALYSES}-${content.id}-outputs`}
                >
                    <FolderOpen />
                </ItemAction>,
            ],
        });
    }
}

export class NewsItem extends ItemBase {
    constructor(content) {
        super({
            kind: constants.KIND_FEEDS,
            content: content,
            actions: [
                <ItemAction
                    ariaLabel="tweet"
                    key={`${constants.KIND_FEEDS}-${content.id}-tweet`}
                >
                    <Twitter />
                </ItemAction>,
                <ItemAction
                    ariaLabel="facebook"
                    key={`${constants.KIND_FEEDS}-${content.id}-facebook`}
                >
                    <Facebook />
                </ItemAction>,
                <ItemAction
                    ariaLabel="open"
                    key={`${constants.KIND_FEEDS}-${content.id}-open`}
                >
                    <OpenInBrowser />
                </ItemAction>,
                <ItemAction
                    ariaLabel="show link"
                    key={`${constants.KIND_FEEDS}-${content.id}-link`}
                >
                    <Link />
                </ItemAction>,
            ],
        });
    }
}

export class EventItem extends ItemBase {
    constructor(content) {
        super({
            kind: constants.KIND_EVENTS,
            content: content,
            actions: [
                <ItemAction
                    ariaLabel="tweet"
                    key={`${constants.KIND_EVENTS}-${content.id}-tweet`}
                >
                    <Twitter />
                </ItemAction>,
                <ItemAction
                    ariaLabel="facebook"
                    key={`${constants.KIND_EVENTS}-${content.id}-facebook`}
                >
                    <Facebook />
                </ItemAction>,
                <ItemAction
                    ariaLabel="open"
                    key={`${constants.KIND_EVENTS}-${content.id}-open`}
                >
                    <OpenInBrowser />
                </ItemAction>,
                <ItemAction
                    ariaLabel="show link"
                    key={`${constants.KIND_EVENTS}-${content.id}-link`}
                >
                    <Link />
                </ItemAction>,
                <ItemAction
                    ariaLabel="add to calendar"
                    key={`${constants.KIND_EVENTS}-${content.id}-calendar`}
                >
                    <CalendarToday />
                </ItemAction>,
            ],
        });
    }
}

export default DashboardItem;
