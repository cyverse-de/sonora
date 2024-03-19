import { makeStyles } from "tss-react/mui";

export default makeStyles()((theme) => ({
    dividerRoot: {
        marginBottom: theme.spacing(3),
    },
    footer: {
        width: "100%",
        height: 128, // This is needed to get the vertical scrolling to stop cutting off the bottom of the content.

        [theme.breakpoints.down("md")]: {
            height: 32,
        },
    },
    section: {
        marginTop: theme.spacing(2),
        width: "100%",
    },
    sectionNews: {
        width: "66%",
        [theme.breakpoints.down("lg")]: {
            width: "100%",
        },
    },
    sectionEvents: {
        width: "33%",
        overflowWrap: "break-word",
        overflow: "hidden",
        [theme.breakpoints.down("lg")]: {
            width: "100%",
        },
    },
    sectionItems: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "flex-start",
        paddingRight: 0,

        // Try to eek as much space out of the iPhone SE cards as possible.
        [theme.breakpoints.down("lg")]: {
            padding: 0,
        },
    },
    subtitle: {
        marginBottom: theme.spacing(2),
    },
    gridRoot: {
        overflow: "auto", // Needed for vertical scrolling.
        paddingTop: 1,
        paddingLeft: theme.spacing(3),
        paddingBottom: 1,
        paddingRight: theme.spacing(3),

        [theme.breakpoints.down("md")]: {
            paddingLeft: theme.spacing(1),
            paddingRight: theme.spacing(1),
        },
    },
    showMoreBtn: {
        marginTop: theme.spacing(2),
        padding: 0,
        marginLeft: theme.spacing(0),
        marginBottom: theme.spacing(1),
    },
}));
