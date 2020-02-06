/**
 * @author aramsey
 *
 * This component is intended to be used as a link with text.
 * The anchor tag is not used because the `href` attribute is required
 * and must have a valid value in order to make the element keyboard
 * accessible.  Using a valid `href` attribute seems to clash with nextjs's
 * router and causes the browser to navigate to the requested page twice.
 */

import React from "react";
import { makeStyles } from "@material-ui/core";
import styles from "../styles";

const useStyles = makeStyles(styles);

function SpanLink(props) {
    const classes = useStyles();
    const { onClick, children } = props;

    const keyboardHandler = (event) => {
        // if space key or enter key
        if (event.keyCode === 32 || event.keyCode === 13) {
            onClick();
        }
    };

    return (
        <span
            tabIndex={0}
            onClick={onClick}
            onKeyDown={keyboardHandler}
            className={classes.dataLink}
        >
            {children}
        </span>
    );
}

export default SpanLink;
