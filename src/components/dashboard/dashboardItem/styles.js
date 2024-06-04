import { makeStyles } from "tss-react/mui";

export default makeStyles()((theme, props) => ({
    tripleDotMenu: {
        marginLeft: "auto",
    },
    avatar: {
        background: props?.color,
        height: theme.spacing(3),
        width: theme.spacing(3),
    },
    cardHeaderDefault: {
        background: theme.palette.white,
    },
    avatarIcon: {
        color: theme.palette.white,
        backgroundColor: props?.color,
        height: theme.spacing(2),
        width: theme.spacing(2),
    },
    cardHeaderContent: {
        width: "75%",
    },
    cardHeaderText: {
        color: theme.palette.primary.main,
    },
    dashboardCard: {
        display: "flex",
        flexDirection: "column",
        marginTop: theme.spacing(2),

        width: props?.width,
        height: props?.height,

        [theme.breakpoints.up("xs")]: {
            marginRight: theme.spacing(0),
        },

        [theme.breakpoints.up("sm")]: {
            marginRight: theme.spacing(2),
        },

        [theme.breakpoints.up("lg")]: {
            marginRight: theme.spacing(2),
        },
    },
    dashboardVideo: {
        width: props?.width,
        height: props?.height,
        float: "none",
        clear: "both",
        marginRight: theme.spacing(2),
        marginTop: theme.spacing(2),
    },
    eventsItem: {
        marginTop: theme.spacing(2),
        width: "100%",
    },
    newsItem: {
        marginTop: theme.spacing(2),
        width: "100%",
        paddingRight: theme.spacing(2),

        [theme.breakpoints.up("lg")]: {
            width: "47%",
        },
    },
    root: {
        flexGrow: 1,
        paddingTop: 0,
        paddingRight: theme.spacing(2),
        paddingBottom: theme.spacing(2),
        paddingLeft: theme.spacing(2),
    },
}));
