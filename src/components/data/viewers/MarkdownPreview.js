/**
 *
 * A component to that renders HTML preview of a markdown
 *
 * @author sriram
 *
 */
import React from "react";
import viewerConstants from "./constants";
import { Paper } from "@material-ui/core";
export default function MarkdownPreview(props) {
    const { html } = props;
    return (
        <Paper
            style={{
                background: "#fff",
                height: viewerConstants.DEFAULT_VIEWER_HEIGHT,
            }}
            dangerouslySetInnerHTML={{
                __html: html,
            }}
        ></Paper>
    );
}
