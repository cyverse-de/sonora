/**
 * @author sboleyn
 *
 * A custom hook that provides screen size-based breakpoints.
 * Designed as an alternative to MUI's deprecated Hidden component,
 * it allows for conditional rendering of components based on the current
 * screen size.
 */

import { useTheme, useMediaQuery } from "@mui/material";

function useBreakpoints() {
    const theme = useTheme();

    return {
        isXsDown: useMediaQuery(theme.breakpoints.down("xs")),
        isSmDown: useMediaQuery(theme.breakpoints.down("sm")),
        isMdDown: useMediaQuery(theme.breakpoints.down("md")),
        isLgDown: useMediaQuery(theme.breakpoints.down("lg")),
        isXlDown: useMediaQuery(theme.breakpoints.down("xl")),

        isXsUp: useMediaQuery(theme.breakpoints.up("xs")),
        isSmUp: useMediaQuery(theme.breakpoints.up("sm")),
        isMdUp: useMediaQuery(theme.breakpoints.up("md")),
        isLgUp: useMediaQuery(theme.breakpoints.up("lg")),
        isXlUp: useMediaQuery(theme.breakpoints.up("xl")),
    };
}

export default useBreakpoints;
