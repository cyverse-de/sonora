/**
 * @author sriram
 *
 * A custom Table row with banding
 * copied from https://material-ui.com/components/tables/#customized-tables
 *
 *
 **/
import withStyles from "@mui/styles/withStyles";
import TableRow from "@mui/material/TableRow";

export const DERow = withStyles((theme) => ({
    root: {
        "&:nth-of-type(odd)": {
            backgroundColor: "#f7f7f7",
        },
    },
}))(TableRow);
