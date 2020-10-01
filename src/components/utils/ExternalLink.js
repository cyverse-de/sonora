/**
 * A MUI Link for linking to external pages, opening in new tab.
 *
 * @author psarando
 */
import React from "react";

import { Link } from "@material-ui/core";

const ExternalLink = (props) => {
    return <Link target="_blank" rel="noopener noreferrer" {...props} />;
};

export default ExternalLink;
