import { makeStyles } from "@material-ui/styles";

export default makeStyles((theme) => ({
    actionsRoot: {
        marginLeft: "auto",
    },
    avatar: {
        background: theme.palette.white,
        color: theme.palette.gray,
    },
    cardHeaderDefault: {
        background: theme.palette.primary.main,
        marginBottom: theme.spacing(2),
    },
    cardHeaderDefaultAvatar: {
        color: theme.palette.primary.main,
    },
    cardHeaderContent: {
        width: "75%",
    },
    cardHeaderEvents: {
        background: theme.palette.violet,
    },
    cardHeaderEventsAvatar: {
        color: theme.palette.violet,
    },
    cardHeaderNews: {
        background: theme.palette.indigo,
    },
    cardHeaderNewsAvatar: {
        color: theme.palette.indigo,
    },
    cardHeaderPublic: {
        background: theme.palette.darkNavy,
    },
    cardHeaderPublicAvatar: {
        color: theme.palette.darkNavy,
    },
    cardHeaderRecent: {
        background: theme.palette.navy,
    },
    cardHeaderRecentAvatar: {
        color: theme.palette.navy,
    },
    cardHeaderRecentlyAdded: {
        background: theme.palette.gold,
    },
    cardHeaderRecentlyAddedAvatar: {
        color: theme.palette.gold,
    },
    cardHeaderText: {
        color: theme.palette.white,
    },
    dashboardCard: {
        display: "flex",
        flexDirection: "column",
        marginTop: theme.spacing(2),

        width: (props) => props.width,
        height: (props) => props.height,

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
        width: (props) => props.width,
        height: (props) => props.height,
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
}));
