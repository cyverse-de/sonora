import { emphasize } from "@material-ui/core/styles/colorManipulator";

// Copied from https://material-ui.com/demos/autocomplete/
export default (theme) => ({
    root: {
        flexGrow: 1,
        // height: 250,
    },
    input: {
        display: "flex",
        padding: 0,
    },
    valueContainer: {
        display: "flex",
        flex: 1,
        alignItems: "center",
    },
    chip: {
        margin: `${theme.spacing(0.5)}px ${theme.spacing(0.25)}px`,
    },
    chipFocused: {
        backgroundColor: emphasize(
            theme.palette.type === "light"
                ? theme.palette.grey[300]
                : theme.palette.grey[700],
            0.08
        ),
    },
    noOptionsMessage: {
        fontSize: 16,
        padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    },
    singleValue: {
        fontSize: 16,
    },
    placeholder: {
        position: "absolute",
        left: 2,
        fontSize: 16,
    },
});
