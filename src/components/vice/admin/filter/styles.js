import { makeStyles } from "@material-ui/core";

export default makeStyles((theme) => ({
    actions: {
        //display: "flex",
    },
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
        marginLeft: "auto",
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
    },
    selectRoot: {
        width: 250,
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: "50ch",
    },
}));
