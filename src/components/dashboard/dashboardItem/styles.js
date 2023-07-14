import { makeStyles } from "@material-ui/styles";

export default makeStyles((theme) => ({
    tripleDotMenu: {
        marginLeft: "auto",
    },
    avatar: {
        background: (props) => props.color,
        height: theme.spacing(3),
        width: theme.spacing(3),
    },
    cardHeaderDefault: {
        background: theme.palette.white,
    },
    avatarIcon: {
        color: (props) => theme.palette.white,
        backgroundColor: (props) => props.color,
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
    root: {
        flexGrow: 1,
        paddingTop: 0,
        paddingRight: theme.spacing(2),
        paddingBottom: theme.spacing(2),
        paddingLeft: theme.spacing(2),
    },
    legacyCard: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
    backdrop: {
        backgroundColor: theme.palette.leaf,
        animation: "$strobe 3.5s infinite",
    },
    "@keyframes strobe": {
        "0%": { backgroundColor: "rgba(55, 143, 67, 0.25)" },
        "10%": { backgroundColor: "rgba(55, 143, 67, 0.23)" },
        "20%": { backgroundColor: "rgba(55, 143, 67, 0.2)" },
        "30%": { backgroundColor: "rgba(55, 143, 67, 0.15)" },
        "40%": { backgroundColor: "rgba(55, 143, 67, 0.1)" },
        "50%": { backgroundColor: "rgba(55, 143, 67, 0.07)" },
        "60%": { backgroundColor: "rgba(55, 143, 67, 0.1)" },
        "70%": { backgroundColor: "rgba(55, 143, 67, 0.15)" },
        "80%": { backgroundColor: "rgba(55, 143, 67, 0.2)" },
        "90%": { backgroundColor: "rgba(55, 143, 67, 0.23)" },
        "100%": { backgroundColor: "rgba(55, 143, 67, .25)" },
    },
}));
