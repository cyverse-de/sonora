import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core";
import classnames from "classnames";
import { injectIntl } from "react-intl";
import intlData from "./messages";
import { formatMessage, withI18N } from "@cyverse-de/ui-lib";

const useStyles = makeStyles((theme) => ({
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
}));

function AppName(props) {
    const { baseDebugId, isDisabled, name, onAppNameClicked, intl } = props;
    const classes = useStyles();
    const classname =
        isDisabled || !onAppNameClicked
            ? classes.name
            : classnames(classes.name, classes.nameHover);
    const handleClick = isDisabled ? undefined : onAppNameClicked;
    let title = "";
    if (handleClick) {
        title = isDisabled
            ? formatMessage(intl, "disabledAppTooltip")
            : formatMessage(intl, "useAppTooltip");
    }
    return (
        <div
            id={baseDebugId}
            title={title}
            className={classname}
            onClick={handleClick}
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    e.preventDefault();
                    e.stopPropagation();
                    handleClick && handleClick(e);
                }
            }}
            tabIndex="0"
            role="button"
        >
            {name}
        </div>
    );
}
AppName.propTypes = {
    isDisabled: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    onAppNameClicked: PropTypes.func,
    searchText: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.instanceOf(RegExp),
    ]),
};
export default withI18N(injectIntl(AppName), intlData);
