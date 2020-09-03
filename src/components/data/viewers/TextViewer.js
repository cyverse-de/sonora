/**
 * View text files
 *
 * @author sriram
 *
 */
import React from "react";

import SyntaxHighlighter from "react-syntax-highlighter";

export default function TextViewer(props) {
    return (
        <SyntaxHighlighter
            language={props.mode}
            showLineNumbers={true}
            showInlineLineNumbers={true}
            wrapLines={true}
        >
            {props.data}
        </SyntaxHighlighter>
    );
}
