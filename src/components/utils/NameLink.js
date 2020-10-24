/**
 * A component that display a Name field using material-ui/Link.
 * This component needs to wrapped by next/Link to avoid whole app refresh issue.
 *
 * @example
 *  <Link href={href} as={as} passHref><NameLink name="test" /></Link>
 *
 *
 * @author sriram
 */

import React from "react";
import { Highlighter } from "@cyverse-de/ui-lib";
import { Link, makeStyles } from "@material-ui/core";
const useStyles = makeStyles((theme) => ({
    link: {
        cursor: "pointer",
        "&:hover": {
            textDecoration: "underline",
            color: theme.palette.primary.main,
        },
    },
}));
const NameLink = React.forwardRef((props, ref) => {
    const { id, name, title, searchTerm, onClick, href } = props;
    const classes = useStyles();
    return (
        <Link
            id={id}
            title={title}
            href={href}
            onClick={onClick}
            ref={ref}
            className={classes.dataLink}
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    onClick(e);
                }
            }}
        >
            <Highlighter search={searchTerm || ""}>{name}</Highlighter>
        </Link>
    );
});

export default NameLink;
