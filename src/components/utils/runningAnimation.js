/**
 * A light-green and strobing backdrop that indicates a running analysis.
 *
 * @author sboleyn, psarando
 *
 */
import { keyframes } from "tss-react";

const strobe = keyframes({
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
});

const styles = (theme) => ({
    backdrop: {
        backgroundColor: theme.palette.leaf,
        animation: `${strobe} 3.5s infinite`,
    },
});

export default styles;
