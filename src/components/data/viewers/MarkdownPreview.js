/**
 *
 * A component to that renders HTML preview of a markdown
 *
 * @author sriram
 *
 */
import React, { useEffect, useState } from "react";
import markdownToHtml from "components/utils/markdownToHtml";

import viewerConstants from "./constants";
import { Paper } from "@mui/material";

export default function MarkdownPreview(props) {
    const { markdown } = props;
    const [markDownPreview, setMarkdownPreview] = useState("");

    useEffect(() => {
        if (markdown) {
            markdownToHtml(markdown).then((html) => {
                setMarkdownPreview(html);
            });
        }
    }, [markdown]);

    return (
        <Paper
            style={{
                background: "#fff",
                height: viewerConstants.DEFAULT_VIEWER_HEIGHT,
                overflow: "scroll",
            }}
            dangerouslySetInnerHTML={{
                __html: markDownPreview,
            }}
        />
    );
}
