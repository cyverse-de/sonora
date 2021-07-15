import { createMuiTheme } from "@material-ui/core/styles";
import palette from "./CyVersePalette";

/**
 * Creates and returns a new theme. If an existing theme object is passed in,
 * it will be merged with the ui-lib theme.
 *
 * @param {object} theme - A theme to override/add on to the default ui-lib theme.
 * @returns {object}
 */
export default (theme) =>
    createMuiTheme(
        {
            palette: {
                type: "light",

                // All intentions should be defined with references to colors from the new palette.
                primary: {
                    main: palette.cobalt,
                },
                secondary: {
                    main: palette.sky,
                },
                error: {
                    main: palette.alertRed,
                },
                warning: {
                    main: palette.yellow,
                },
                info: {
                    main: palette.blueGrey,
                },
                success: {
                    main: palette.grass,
                },
                action: {
                    hover: "rgba(0, 0, 0, 0.1)", // was 0.04
                    hoverOpacity: 0.1,
                    selected: "rgba(0, 0, 0, 0.2)", // was 0.08
                    selectedOpacity: 0.2,
                },

                ...palette, // allow all of the colors to be referenced in the palette.
            },
            typography: {
                button: {
                    textTransform: "none",
                },
                useNextVariants: true,
            },
        },

        theme || {} // Allow callers to override/add to the theme with their own values.
    );
