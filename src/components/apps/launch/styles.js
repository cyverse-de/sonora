import commonStyles from "../commonStyles";

const styles = (theme) => ({
    ...commonStyles(theme),

    spacer: {
        margin: theme.spacing(1),
        [theme.breakpoints.down("sm")]: {
            margin: theme.spacing(0.3),
        },
    },
    appInfoTypography: {
        color: theme.palette.info.main,
        margin: theme.spacing(0.5),
        [theme.breakpoints.down("sm")]: {
            margin: theme.spacing(0.3),
        },
    },
    paramsReview: {
        margin: theme.spacing(1),
        [theme.breakpoints.down("sm")]: {
            margin: theme.spacing(0.3),
        },
    },
    inputSelectorBrowseButton: {
        marginLeft: theme.spacing(1),
        [theme.breakpoints.down("sm")]: {
            marginLeft: theme.spacing(0.1),
        },
    },
    inputSelectorTextFiled: {
        paddingRight: theme.spacing(1),
        [theme.breakpoints.down("sm")]: {
            paddingRight: theme.spacing(0.1),
        },
    },
    detailsButton: {
        margin: theme.spacing(0.5),
        [theme.breakpoints.down("sm")]: {
            margin: theme.spacing(0),
        },
        float: "right",
    },
});

export default styles;
