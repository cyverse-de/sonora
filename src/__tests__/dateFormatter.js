/**
 *
 * @author Sriram
 *
 */

import {
    formatCurrentDate,
    formatDate,
    formatDateObject,
} from "../../src/util/DateFormatter";

import { format } from "date-fns";
import { legacyParse } from "@date-fns/upgrade/v2";

test("format current date", () => {
    expect(formatCurrentDate("MM:dd:yy")).toBe(
        format(legacyParse(new Date()), "MM:dd:yy")
    );
});

test("format Date object", () => {
    const dateNow = new Date();
    expect(formatDateObject(dateNow)).toBe(
        format(legacyParse(dateNow), "yyyy-MM-dd HH:mm:ss")
    );
});

test("format Date", () => {
    expect(formatDate("1558389094590")).toBe(
        format(legacyParse(1558389094590), "yyyy-MM-dd HH:mm:ss")
    );
});

test("format empty Date", () => {
    expect(formatDate()).toBe("-");
});

test("format empty Date", () => {
    expect(formatDate(null)).toBe("-");
});

test("format empty Date", () => {
    expect(formatDate(undefined)).toBe("-");
});

test("format null Date object", () => {
    expect(formatDateObject(null)).toBe("-");
});

test("format null Date object", () => {
    expect(formatDateObject(undefined)).toBe("-");
});
