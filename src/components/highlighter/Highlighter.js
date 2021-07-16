import React from "react";
import Highlight from "react-highlighter";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles/index";

/**
 * @author aramsey
 * A function which will take a search term and some text,
 * and highlight the search term within the text
 */

const styles = (theme) => ({
    highlightColor: {
        background: "#FF0",
    },
});
function Highlighter(props) {
    let { search, children, classes } = props;
    return (
        <Highlight matchClass={classes.highlightColor} search={search}>
            {children}
        </Highlight>
    );
}

Highlighter.propTypes = {
    search: PropTypes.any.isRequired,
    children: PropTypes.any.isRequired,
};

export default withStyles(styles)(Highlighter);
