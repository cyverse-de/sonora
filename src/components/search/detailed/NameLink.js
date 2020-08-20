import React from "react";
import { Highlighter } from "@cyverse-de/ui-lib";
import { Link as MuiLink, makeStyles } from "@material-ui/core";
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
        <MuiLink
            href={href}
            onClick={onClick}
            ref={ref}
            className={classes.dataLink}
        >
            <Highlighter search={searchTerm}>{name}</Highlighter>
        </MuiLink>
    );
});

export default NameLink;
