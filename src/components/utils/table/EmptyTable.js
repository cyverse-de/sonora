import React from "react";
import PropTypes from "prop-types";

import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";

/**
 * A component for displaying a message in a table when the table doesn't otherwise have
 * data to display
 *
 * @param props
 * @returns {*}
 * @constructor
 */
function EmptyTable(props) {
    const { message, numColumns } = props;
    return (
        <TableRow>
            <TableCell colSpan={numColumns}>
                <Typography component="p">{message}</Typography>
            </TableCell>
        </TableRow>
    );
}

EmptyTable.propTypes = {
    message: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
        .isRequired,
    numColumns: PropTypes.number.isRequired,
};

export default EmptyTable;
