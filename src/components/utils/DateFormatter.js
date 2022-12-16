/**
 @author sriram
 */

import lightFormat from "date-fns/lightFormat";
import toDate from "date-fns/toDate";
import dateConstants from "./dateConstants";
import {
    formatDistance,
    formatDuration,
    fromUnixTime,
    intervalToDuration,
} from "date-fns";

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

/**
 *
 * @param timestamp - number of seconds
 * @returns {string} e.g. "1 day ago"
 */
function getFormattedDistance(timestamp) {
    if (timestamp) {
        const d = fromUnixTime(timestamp);
        return formatDistance(d, new Date());
    }
}

function getFormattedDuration(startTimestamp, endTimestamp) {
    const start =
        startTimestamp > 0 ? fromUnixTime(startTimestamp) : new Date();
    const end = endTimestamp > 0 ? fromUnixTime(endTimestamp) : new Date();

    const duration = intervalToDuration({ start, end });

    return formatDuration(duration, { delimiter: ", " });
}

export {
    formatDate,
    formatCurrentDate,
    formatDateObject,
    getFormattedDistance,
    getFormattedDuration,
};
