const styles = (theme) => ({
    metadataTableContainer: {
        overflow: "auto",
    },
    attributeTableContainer: {
        width: "100%",
        height: "100%",
    },
    flex: {
        flex: 1,
    },
    tableHead: {
        backgroundColor: theme.palette.lightGray,
        position: "sticky",
        top: 0,
    },
    deleteIcon: {
        margin: 5,
        "&:hover": {
            backgroundColor: theme.palette.error.dark,
        },
    },
    toolbar: {
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
    },
    spacer: {
        flex: "1 1 100%",
    },
    actions: {
        color: theme.palette.text.secondary,
    },
    title: {
        paddingLeft: theme.spacing(1),
        flex: "0 0 auto",
        maxWidth: "25rem",
    },
    errorSubTitle: {
        color: theme.palette.error.dark,
    },
    childAVUsContainer: {
        flexDirection: "column", // needed for AccordionDetails layout
        paddingLeft: theme.typography.pxToRem(4),
        paddingRight: theme.typography.pxToRem(4),
    },
});

export default styles;
