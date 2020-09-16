/**
 * View text files
 *
 * @author sriram
 *
 */
import React, { useState } from "react";

import SyntaxHighlighter from "react-syntax-highlighter";

import { parseNameFromPath } from "../utils";
import PageWrapper from "components/layout/PageWrapper";
import ids from "./ids";
import Toolbar from "./Toolbar";

import { build } from "@cyverse-de/ui-lib";
import { CircularProgress } from "@material-ui/core";

export default function TextViewer(props) {
    const { baseId, path, resourceId, data, loading, mode, onRefresh } = props;
    const [showLineNumbers, setShowLineNumbers] = useState(true);
    const fileName = parseNameFromPath(path);
    return (
        <PageWrapper
            appBarHeight={120}
            id={build(baseId, ids.VIEWER_PLAIN, fileName)}
        >
            <Toolbar
                baseId={build(baseId, ids.VIEWER_DOC, ids.TOOLBAR)}
                path={path}
                resourceId={resourceId}
                allowLineNumbers={true}
                showLineNumbers={showLineNumbers}
                onShowLineNumbers={(show) => setShowLineNumbers(show)}
                onRefresh={onRefresh}
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
