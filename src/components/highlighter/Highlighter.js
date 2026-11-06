import React from "react";
import Highlight from "react-highlight-words";
import PropTypes from "prop-types";
/**
 * @author aramsey, psarando
 * A function which will take a search term and some text,
 * and highlight the search term within the text.
 *
 * Note that children is expected to be a string, and not a React component.
 */

function Highlighter(props) {
    let { search, children } = props;
    return search ? (
        <Highlight
            autoEscape
            highlightStyle={{
                background: "#FF0",
            }}
            searchWords={[search]}
            textToHighlight={children}
        />
    ) : (
        children
    );
}

Highlighter.propTypes = {
    search: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.instanceOf(RegExp),
    ]),
    children: PropTypes.string,
};

export default Highlighter;
