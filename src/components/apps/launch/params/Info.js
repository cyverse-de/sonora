/**
 * Form field for displaying Info text parameters.
 *
 * @author psarando
 */
import React from "react";

import sanitizeHtml from "sanitize-html";

import { Typography } from "@material-ui/core";

export default function Info({ param, ...props }) {
    return (
        <Typography
            gutterBottom
            variant="body1"
            dangerouslySetInnerHTML={{
                __html: sanitizeHtml(param?.label),
            }}
            {...props}
        />
    );
}
