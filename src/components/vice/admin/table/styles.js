import { makeStyles } from "tss-react/mui";

export default makeStyles()((theme) => ({
    root: {
        width: "100%",
    },
    paper: {
        width: "100%",
        marginBottom: theme.spacing(5),
    },
    title: {
        padding: theme.spacing(2),
    },
    table: {
        height: "100%",
    },
    extended: {
        display: "flex",
        flexWrap: "wrap",
        flexShrink: 0,
        flexGrow: 0,
    },
    row: {
        "& > *": {
            borderBottom: "unset",
        },
    },
    dataEntry: {
        textOverFlow: "ellipsis",

        [theme.breakpoints.up("xs")]: {
            width: "100%",
            marginLeft: 0,
            marginRight: 0,
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(1),
        },
        [theme.breakpoints.up("sm")]: {
            width: 300,
            marginLeft: 0,
            marginRight: 0,
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(1),
        },
        [theme.breakpoints.up("lg")]: {
            width: 350,
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(2),
            marginRight: theme.spacing(2),
        },
    },
    dataEntryLabel: {
        marginRight: theme.spacing(1),
        fontWeight: 500,
    },
    actionButton: {
        marginRight: theme.spacing(1),
        marginBottom: theme.spacing(1),
        marginTop: theme.spacing(1),
    },
    paperPopper: {
        border: "1px solid",
        padding: theme.spacing(1),
        backgroundColor: theme.palette.background.paper,
    },
}));
