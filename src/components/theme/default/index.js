import { createMuiTheme } from "@material-ui/core/styles";
import { palette } from "@cyverse-de/ui-lib";

const theme = createMuiTheme({
    palette: {
        primary: {
            main: palette.blue,
        },
        secondary: {
            main: palette.lightBlue,
        },
        ...palette,
    },
});

export default theme;
