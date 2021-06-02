/**
 *
 * A component to that renders HTML preview of a markdown
 *
 * @author sriram
 *
 */
import React from "react";

export default function MarkdownPreview(props) {
    const { html } = props;
    return (
        <div
            dangerouslySetInnerHTML={{
                __html: html,
            }}
        ></div>
    );
}
