const styles = (theme) => ({
    metadataTableContainer: {
        overflow: "auto",
    },
    attributeTableContainer: {
        width: "100%",
        height: "100%",
    },
    metadataFormTitle: {
        paddingLeft: theme.spacing(1),
        flex: 1,
        overflow: "auto",
    },
    metadataFormToolbar: { alignItems: "flex-start" },
    tableHead: {
        backgroundColor: theme.palette.lightGray,
        position: "sticky",
        top: 0,
    },
    deleteIcon: {
        color: theme.palette.error.main,
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
    avuListingTitle: {
        flex: 1,
    },
    errorSubTitle: {
        color: theme.palette.error.dark,
    },
    childAVUsContainer: {
        flexDirection: "column", // needed for AccordionDetails layout
        paddingLeft: theme.typography.pxToRem(4),
        paddingRight: theme.typography.pxToRem(4),
    },
    dotMenu: { marginLeft: theme.spacing(2) },
});

export default styles;
