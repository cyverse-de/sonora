export default (theme) => ({
    accordionDetails: { flexDirection: "column" },

    // Keeps the content panel at a static height
    // so the nav buttons don't move around below it.
    stepContent: {
        height: "42vh",
        overflow: "auto",
    },
});
