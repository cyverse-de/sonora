/**
 * View text files
 *
 * @author sriram
 *
 */
import React from "react";

import SyntaxHighlighter from "react-syntax-highlighter";
import PageWrapper from "components/layout/PageWrapper";
import { CircularProgress } from "@material-ui/core";

export default function TextViewer(props) {
    const { data, loading, mode } = props;
    return (
        <PageWrapper appBarHeight={120}>
            {loading && (
                <CircularProgress
                    thickness={7}
                    color="primary"
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                    }}
                />
            )}
            <SyntaxHighlighter
                customStyle={{
                    overflow: "auto",
                    width: "auto",
                    backgroundColor: "white",
                }}
                language={mode}
                showLineNumbers={true}
                showInlineLineNumbers={true}
                wrapLines={true}
            >
                {data}
            </SyntaxHighlighter>
        </PageWrapper>
    );
}
