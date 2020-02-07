/**
 * @author aramsey
 *
 * A component intended for displaying data file sizes in a readable format
 */
import numeral from "numeral";

export function getFileSize(size) {
    if (!size) {
        return "-";
    }
    if (size < 1024) {
        return numeral(size).format("0 ib");
    }

    return numeral(size).format("0.0 ib");
}
