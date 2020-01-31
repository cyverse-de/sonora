import { createMuiTheme } from "@material-ui/core/styles";
import { palette } from "@cyverse-de/ui-lib";

const cyverseColors = {
    white: "#ffffff",
    lightSilver: "#e2e2e2",
    silver: "#a5a4a4",
    blueGrey: "#525A68",
    black: "#000000",
    darkNavy: "#142248",
    navy: "#004471",
    cobalt: "#0971AB", // primary
    sky: "#99D9EA",
    yellow: "#F7D21E",
    gold: "#F8981D",
    redSun: "#F1592B",
    violet: "#AA2173",
    indigo: "#4A2E8D",
    leaf: "#378F43",
    grass: "#7CB342",
    ...palette,
};

export const themePalette = {
    type: "light",

    // All intentions should be defined with references to colors from the new palette.
    primary: {
        main: cyverseColors.cobalt,
    },
    secondary: {
        main: cyverseColors.sky,
    },
    error: {
        main: cyverseColors.redSun,
    },
    warning: {
        main: cyverseColors.yellow,
    },
    info: {
        main: cyverseColors.silver,
    },
    success: {
        main: cyverseColors.grass,
    },

    ...cyverseColors, // allow all of the colors to be referenced in the palette.
};

const theme = createMuiTheme({
    palette: themePalette,
    typography: {
        button: {
            textTransform: "none",
        },
        useNextVariants: true,
    },
});

export default theme;
