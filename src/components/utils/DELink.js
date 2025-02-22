/**
 * A component that displays highlight-able text in a material-ui Link.
 * This component is intended for links to other in-app DE pages
 * and should be wrapped by a next/link to avoid whole-app page refreshes.
 *
 * @example
 *  <Link href={href} as={as} passHref>
 *      <DELink text="testing" searchTerm="test" />
 *  </Link>
 *
 *
 * @author sriram
 */

import React from "react";
import Highlighter from "components/highlighter/Highlighter";
import { Link } from "@mui/material";
import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles()((theme) => ({
    link: {
        cursor: "pointer",
        "&:hover": {
            textDecoration: "underline",
            color: theme.palette.primary.main,
        },
    },
}));

const DELink = React.forwardRef(function DELink(props, ref) {
    const { id, text, title, searchTerm, onClick, href } = props;
    const { classes } = useStyles();
    return (
        <Link
            id={id}
            title={title}
            href={href}
            onClick={onClick}
            ref={ref}
            className={classes.link}
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    onClick(e);
                }
            }}
            underline="hover"
        >
            <Highlighter search={searchTerm || ""}>{text}</Highlighter>
        </Link>
    );
});

export default DELink;
