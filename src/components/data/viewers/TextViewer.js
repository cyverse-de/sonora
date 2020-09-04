/**
 * View text files
 *
 * @author sriram
 *
 */
import React from "react";

import SyntaxHighlighter from "react-syntax-highlighter";
import PageWrapper from "components/layout/PageWrapper";
export default function TextViewer(props) {
    return (
        <PageWrapper appBarHeight={60}>
            <SyntaxHighlighter
                customStyle={{ overflow: "auto", width: "auto" }}
                language={props.mode}
                showLineNumbers={true}
                showInlineLineNumbers={true}
                wrapLines={true}
            >
                {props.data}
            </SyntaxHighlighter>
        </PageWrapper>
    );
}
