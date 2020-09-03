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
    const { name, searchTerm, onClick, href } = props;
    const classes = useStyles();
    return (
        <Link
            href={href}
            onClick={onClick}
            ref={ref}
            className={classes.dataLink}
        >
            <Highlighter search={searchTerm}>{name}</Highlighter>
        </Link>
    );
});

export default NameLink;
