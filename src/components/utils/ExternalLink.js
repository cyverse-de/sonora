/**
 * A MUI Link for linking to external pages, opening in new tab.
 *
 * @author psarando
 */
import React from "react";

import { Link } from "@mui/material";

const ExternalLink = (props) => {
    return (
        <Link
            target="_blank"
            rel="noopener noreferrer"
            {...props}
            underline="hover"
        />
    );
};

export default ExternalLink;
