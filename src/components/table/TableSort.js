/**
 * @author aramsey
 * Helper methods for sorting data for use in a table. (Copied from material-ui table demo)
 *
 * NOTE: If sorting does not work, it may be due to a difference between the column name and the key
 * for that column in the table's data.  For example, the column name might be "Integrated By"
 * but the key for that data is actually "integrator_name".  In this case, you must add an extra
 * "key" to your table column object.
 *
 * Example:
 *     {name: "Name",          numeric: false, enableSorting: true,},
 *     {name: "Integrated By", numeric: false, enableSorting: true, key: "integrator_name"},
 */

/**
 * Will sort the data supplied.  Example usage:
 * stableSort(data, getSorting(order, orderBy)).map(n => {
 *     return (
 *         <TableRow
 *         ...
 *         ...
 *         >
 *     )
 * }
 * @param array of data
 * @param cmp
 * @returns {*} sorted data
 */
function stableSort(array, cmp) {
    if (array && array.length > 0) {
        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
            const order = cmp(a[0], b[0]);
            if (order !== 0) return order;
            return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
    } else {
        return array;
    }
}

function desc(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getSorting(order, orderBy) {
    return order === "desc"
        ? (a, b) => desc(a, b, orderBy.toLowerCase())
        : (a, b) => -desc(a, b, orderBy.toLowerCase());
}

export { stableSort, getSorting };
