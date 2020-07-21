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

import {
    build as buildID,
    getMessage,
    formatDate,
    formatMessage,
} from "@cyverse-de/ui-lib";

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
    // kind,
    // content,
    // section,
    // intl,
    // width,
    // height,
    // actions,
    intl,
    item,
}) => {
    const classes = useStyles({ width: item.width, height: item.height });
    const theme = useTheme();

    const isMediumOrLarger = useMediaQuery(theme.breakpoints.up("md"));

    const cardID = item.id;
    const user = item.username;

    const description = fns.cleanDescription(item.content.description);
    const [origination, date] = item.getOrigination(intl);

    const [headerClass, avatarClass] = fns.getSectionClass(
        item.section,
        classes
    );
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
                            {fns.getAvatarIcon(item.kind, avatarClass)}
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
                            kind={item.kind}
                            content={item.content}
                            headerClass={headerClass}
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
                    {description || getMessage("noDescriptionProvided")}
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

const ItemAction = ({ children, ariaLabel, handleClick }) => (
    <IconButton aria-label={ariaLabel} onClick={handleClick}>
        {children}
    </IconButton>
);

export class ItemBase {
    constructor({ kind, section, content, height, width, actions = [] }) {
        this.kind = kind;
        this.section = section;
        this.content = content;
        this.actions = actions;
        this.height = height;
        this.width = width;
        this.id = buildID(content.id);
        this.username = fns.cleanUsername(content.username);
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

    getSectionClass(_classes) {
        return {};
    }

    getLinkIcon() {
        return {};
    }

    getLinkTarget() {
        return {};
    }
}

export class AppItem extends ItemBase {
    constructor(props) {
        super({
            kind: constants.KIND_APPS,
            content: props.content,
            section: props.section,
            height: props.height,
            width: props.width,
        });
    }

    static create(props) {
        const item = new AppItem(props);
        return item.addActions([
            <ItemAction
                ariaLabel="launch"
                key={`${constants.KIND_APPS}-${props.content.id}-launch`}
            >
                <Launch />
            </ItemAction>,
            <ItemAction
                arialLabel="open details"
                key={`${constants.KIND_APPS}-${props.content.id}-details`}
            >
                <Info />
            </ItemAction>,
            <ItemAction
                arialLabel="favorite"
                key={`${constants.KIND_APPS}-${props.content.id}-favorite`}
            >
                <Favorite />
            </ItemAction>,
            <ItemAction
                arialLabel="share"
                key={`${constants.KIND_APPS}-${props.content.id}-share`}
            >
                <Share />
            </ItemAction>,
        ]);
    }

    getOrigination(intl) {
        let origination;
        let date;

        if (this.content.integration_date) {
            origination = formatMessage(intl, "integratedBy");
            date = new Date(this.content.integration_date);
        } else {
            origination = formatMessage(intl, "editedBy");
            date = new Date(this.content.edited_date);
        }

        return [origination, formatDate(date.valueOf())];
    }
}

export class AnalysisItem extends ItemBase {
    constructor({ section, content, height, width }) {
        super({
            kind: constants.KIND_ANALYSES,
            content,
            section,
            height,
            width,
        });
    }

    static create(props) {
        const item = new AnalysisItem(props);
        return item.addActions([
            <ItemAction
                ariaLabel="relaunch"
                key={`${constants.KIND_ANALYSES}-${props.content.id}-relaunch`}
            >
                <Replay />
            </ItemAction>,
            <ItemAction
                ariaLabel="stop"
                key={`${constants.KIND_ANALYSES}-${props.content.id}-stop`}
            >
                <Stop />
            </ItemAction>,
            <ItemAction
                ariaLabel="open details"
                key={`${constants.KIND_ANALYSES}-${props.content.id}-details`}
            >
                <Info />
            </ItemAction>,
            <ItemAction
                ariaLabel="share"
                key={`${constants.KIND_ANALYSES}-${props.content.id}-share`}
            >
                <Share />
            </ItemAction>,
            <ItemAction
                ariaLabel="go to output files"
                key={`${constants.KIND_ANALYSES}-${props.content.id}-outputs`}
            >
                <FolderOpen />
            </ItemAction>,
        ]);
    }

    getOrigination(intl) {
        const origination = formatMessage(intl, "startedBy");
        const date = new Date(this.content.start_date);

        return [origination, formatDate(date.valueOf())];
    }
}

export class NewsItem extends ItemBase {
    constructor({ section, content, height, width }) {
        super({
            kind: constants.KIND_FEEDS,
            content,
            section,
            height,
            width,
        });
    }

    static create(props) {
        const item = new NewsItem(props);
        return item.addActions([
            <ItemAction
                ariaLabel="tweet"
                key={`${constants.KIND_FEEDS}-${props.content.id}-tweet`}
            >
                <Twitter />
            </ItemAction>,
            <ItemAction
                ariaLabel="facebook"
                key={`${constants.KIND_FEEDS}-${props.content.id}-facebook`}
            >
                <Facebook />
            </ItemAction>,
            <ItemAction
                ariaLabel="open"
                key={`${constants.KIND_FEEDS}-${props.content.id}-open`}
            >
                <OpenInBrowser />
            </ItemAction>,
            <ItemAction
                ariaLabel="show link"
                key={`${constants.KIND_FEEDS}-${props.content.id}-link`}
            >
                <Link />
            </ItemAction>,
        ]);
    }

    getOrigination(intl) {
        const origination = formatMessage(intl, "publishedBy");
        const date = new Date(this.content.date_added);
        return [origination, formatDate(date.valueOf())];
    }
}

export class EventItem extends ItemBase {
    constructor({ section, content, height, width }) {
        super({
            kind: constants.KIND_EVENTS,
            content,
            section,
            height,
            width,
        });
    }

    static create(props) {
        const item = new EventItem(props);
        return item.addActions([
            <ItemAction
                ariaLabel="tweet"
                key={`${constants.KIND_EVENTS}-${props.content.id}-tweet`}
            >
                <Twitter />
            </ItemAction>,
            <ItemAction
                ariaLabel="facebook"
                key={`${constants.KIND_EVENTS}-${props.content.id}-facebook`}
            >
                <Facebook />
            </ItemAction>,
            <ItemAction
                ariaLabel="open"
                key={`${constants.KIND_EVENTS}-${props.content.id}-open`}
            >
                <OpenInBrowser />
            </ItemAction>,
            <ItemAction
                ariaLabel="show link"
                key={`${constants.KIND_EVENTS}-${props.content.id}-link`}
            >
                <Link />
            </ItemAction>,
            <ItemAction
                ariaLabel="add to calendar"
                key={`${constants.KIND_EVENTS}-${props.content.id}-calendar`}
            >
                <CalendarToday />
            </ItemAction>,
        ]);
    }

    getOrigination(intl) {
        const origination = formatMessage(intl, "by");
        const date = new Date();
        return [origination, formatDate(date.valueOf())];
    }
}

export const getItem = (props) => {
    switch (props.kind) {
        case constants.KIND_ANALYSES:
            return AnalysisItem.create(props);
        case constants.KIND_APPS:
            return AppItem.create(props);
        case constants.KIND_EVENTS:
            return new EventItem(props);
        default:
            return new NewsItem(props);
    }
};

export default DashboardItem;
