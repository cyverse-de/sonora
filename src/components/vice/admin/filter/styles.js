import makeStyles from "@mui/styles/makeStyles";

export default makeStyles((theme) => ({
    chip: {
        margin: theme.spacing(1),
    },
    chips: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "flex-start",
    },
    collapse: {
        margin: theme.spacing(2),
        overflow: "auto",
        height: "100%",
    },
    info: {
        color: theme.palette.info.main,
    },
    expand: {
        transform: "rotate(0deg)",
        transition: theme.transitions.create("transform", {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: "rotate(180deg)",
    },
    root: {
        marginBottom: theme.spacing(4),
        width: "100%",
    },
    sectionRoot: {
        display: "flex",
        marginBottom: theme.spacing(5),
        [theme.breakpoints.down("lg")]: {
            flexDirection: "column",
            justifyContent: "center",
        },
    },
    selectRoot: {
        width: 250,
        [theme.breakpoints.down("md")]: {
            width: "100%",
        },
    },
    textField: {
        [theme.breakpoints.up("xs")]: {
            width: "100%",
            marginLeft: 0,
            marginRight: 0,
            marginBottom: theme.spacing(1),
        },
        [theme.breakpoints.up("sm")]: {
            width: "50ch",
        },
        [theme.breakpoints.up("md")]: {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
            marginBottom: 0,
        },
    },
}));
