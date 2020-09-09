/**
 * View text files
 *
 * @author sriram
 *
 */
import React, { useState } from "react";

import SyntaxHighlighter from "react-syntax-highlighter";
import PageWrapper from "components/layout/PageWrapper";

import Toolbar from "./Toolbar";

import { CircularProgress } from "@material-ui/core";

export default function TextViewer(props) {
    const { path, resourceId, data, loading, mode } = props;
    const [showLineNumbers, setShowLineNumbers] = useState(true);
    return (
        <PageWrapper appBarHeight={120}>
            <Toolbar
                path={path}
                resourceId={resourceId}
                allowLineNumbers={true}
                showLineNumbers={showLineNumbers}
                onShowLineNumbers={(show) => setShowLineNumbers(show)}
            />
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
                }}
                language={mode}
                showLineNumbers={showLineNumbers}
                showInlineLineNumbers={true}
                wrapLines={true}
            >
                {data}
            </SyntaxHighlighter>
        </PageWrapper>
    );
}
