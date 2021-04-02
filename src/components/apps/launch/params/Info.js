/**
 * Form field for displaying Info text parameters.
 *
 * @author psarando
 */
import React from "react";

import markdownToHtml from "components/utils/markdownToHtml";

import { Typography } from "@material-ui/core";

export default function Info({ param, ...props }) {
    const [infoHtml, setInfoHtml] = React.useState("");

    React.useEffect(() => {
        if (param?.label) {
            markdownToHtml(param.label).then((html) => setInfoHtml(html));
        } else {
            setInfoHtml("");
        }
    }, [param]);

    return (
        <Typography
            gutterBottom
            variant="body1"
            dangerouslySetInnerHTML={{ __html: infoHtml }}
            {...props}
        />
    );
}
