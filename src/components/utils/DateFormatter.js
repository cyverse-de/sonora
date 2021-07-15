/**
 @author sriram
 */

import lightFormat from "date-fns/lightFormat";
import toDate from "date-fns/toDate";
import dateConstants from "../dateConstants";

/**
 * Format a date with the given format or return a `-`.
 * @param longDate
 * @param dateFormat
 * @returns {string}
 */
function formatDate(longDate, dateFormat = dateConstants.LONG_DATE_FORMAT) {
    const longDateInt = parseInt(longDate, 10);
    return longDateInt
        ? lightFormat(toDate(new Date(longDateInt)), dateFormat)
        : dateConstants.EMPTY_DATE;
}

/**
 * Format current date with the give format
 * @param format
 * @returns {string}
 */
function formatCurrentDate(format = dateConstants.LONG_DATE_FORMAT) {
    return formatDate(new Date().valueOf(), format);
}

/**
 * Format a Date object with the given format
 * @param Date Object
 * @param format
 * @returns {string}
 */
function formatDateObject(dateObj, dateFormat) {
    return dateObj
        ? formatDate(dateObj.valueOf(), dateFormat)
        : dateConstants.EMPTY_DATE;
}

export { formatDate, formatCurrentDate, formatDateObject };
