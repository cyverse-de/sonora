/**
 *  @author sriram
 *
 **/

import React, { useState } from "react";
import classnames from "classnames";
import { injectIntl } from "react-intl";
import md5 from "md5";
import PropTypes from "prop-types";

import AppStatusIcon from "./AppStatusIcon";
import intlData from "./messages";
import palette from "../../util/CyVersePalette";
import Rate from "../rating/Rate";
import withI18N from "../../util/I18NWrapper";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core";
import AppName from "./AppName";
import AppMenu from "./AppMenu";
import { build } from "../../lib";
import ids from "./ids";
import Highlighter from "../highlighter/Highlighter";

const styles = (theme) => ({
    card: {
        minWidth: 280,
        maxWidth: 280,
        minHeight: 100,
        maxHeight: 100,
        margin: 15,
        padding: 5,
        cursor: "pointer",
        "&:hover": {
            backgroundColor:
                theme.palette.type === "light"
                    ? "rgba(0, 0, 0, 0.13)"
                    : "rgba(255, 255, 255, 0.28)",
        },
    },
    selectedCard: {
        backgroundColor:
            theme.palette.type === "light"
                ? palette.lightBlue
                : "rgba(255, 255, 255, 0.16)",
    },
    avatar: {
        float: "left",
        margin: 10,
    },
    type: {
        textAlign: "center",
        fontSize: 10,
    },
    name: {
        margin: 10,
        fontSize: 12,
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        overflow: "hidden",
        display: "inline-block",
        maxWidth: 150,
    },
    nameHover: {
        "&:hover": {
            textDecoration: "underline",
            cursor: "pointer",
        },
    },
    more: {
        float: "right",
        height: 105,
    },
    creator: {
        margin: 10,
        top: 50,
        fontSize: 12,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        display: "inline-block",
        maxWidth: 150,
    },
    status: {
        position: "relative",
        top: 40,
        right: -5,
    },
    rating: {
        width: "80%",
    },
});

function AppTile(props) {
    const {
        classes,
        uuid,
        name,
        creator,
        rating,
        type,
        isPublic,
        isBeta,
        isDisabled,
        isExternal,
        isFavorite,
        onRatingChange,
        intl,
        selected,
        onDeleteRatingClick,
        onAppNameClick,
        onAppSelected,
        onAppInfoClick,
        onCommentsClick,
        onFavoriteClick,
        onQuickLaunchClick,
        baseDebugId,
        searchText,
    } = props;

    const {
        average: averageRating,
        user: userRating,
        total: totalRating,
    } = rating;

    const getGravatarIconSrc = `https://www.gravatar.com/avatar/${md5(
        uuid
    )}?d=identicon&s=60`;
    const tileId = build(baseDebugId, uuid);
    return (
        <Paper
            className={
                selected
                    ? classnames(classes.card, classes.selectedCard)
                    : classes.card
            }
            onClick={onAppSelected}
            id={tileId}
        >
            <div className={classes.avatar}>
                <div>
                    <img
                        id={build(tileId, ids.CARD)}
                        onClick={onAppNameClick}
                        src={getGravatarIconSrc}
                        alt="avatar image"
                    />
                </div>
                <div className={classes.type}>{type.toLowerCase()}</div>
            </div>
            <div>
                <AppName
                    baseDebugId={build(tileId, ids.APP_NAME)}
                    intl={intl}
                    name={name}
                    isDisabled={isDisabled}
                    classes={classes}
                    onAppNameClicked={onAppNameClick}
                    searchText={searchText}
                />
                <div className={classes.more}>
                    <AppMenu
                        onAppInfoClick={onAppInfoClick}
                        onCommentsClick={onCommentsClick}
                        onFavoriteClick={onFavoriteClick}
                        onQuickLaunchClick={onQuickLaunchClick}
                        baseDebugId={tileId}
                        isExternal={isExternal}
                        isFavorite={isFavorite}
                    />
                    <div className={classes.status}>
                        <AppStatusIcon
                            isPublic={isPublic}
                            isBeta={isBeta}
                            isDisabled={isDisabled}
                        />
                    </div>
                </div>
            </div>

            <div className={classes.creator}>
                <Highlighter search={searchText}>{creator}</Highlighter>
            </div>
            <div className={classes.rating}>
                <Rate
                    name={uuid}
                    value={userRating || averageRating}
                    readOnly={isExternal || !isPublic}
                    total={totalRating}
                    onChange={onRatingChange}
                    onDelete={userRating ? onDeleteRatingClick : undefined}
                />
            </div>
        </Paper>
    );
}

AppTile.propTypes = {
    uuid: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    creator: PropTypes.string.isRequired,
    rating: PropTypes.shape({
        average: PropTypes.number,
        user: PropTypes.number,
        total: PropTypes.number,
    }),
    type: PropTypes.string.isRequired,
    isPublic: PropTypes.bool,
    isBeta: PropTypes.bool,
    isDisabled: PropTypes.bool,
    isExternal: PropTypes.bool,
    isFavorite: PropTypes.bool,
    onRatingChange: PropTypes.func,
    onDeleteRatingClick: PropTypes.func,
    onAppNameClick: PropTypes.func.isRequired,
    onAppSelected: PropTypes.func.isRequired,
    selected: PropTypes.bool,
    onAppInfoClick: PropTypes.func.isRequired,
    onCommentsClick: PropTypes.func,
    onFavoriteClick: PropTypes.func,
    onQuickLaunchClick: PropTypes.func,
    baseDebugId: PropTypes.string.isRequired,
    searchText: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.instanceOf(RegExp),
    ]),
};

export default withStyles(styles)(withI18N(injectIntl(AppTile), intlData));
