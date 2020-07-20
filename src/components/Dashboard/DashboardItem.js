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
} from "@material-ui/core";

import { useTheme } from "@material-ui/styles";

import { build as buildID, getMessage } from "@cyverse-de/ui-lib";

import * as fns from "./functions";
import * as constants from "./constants";
import ids from "./ids";
import useStyles from "./styles";

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
export default ({ kind, content, section, intl, width, height }) => {
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
            ></CardActions>
        </Card>
    );
};
