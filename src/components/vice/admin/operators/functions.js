import buildID from "components/utils/DebugIDUtil";

import ids from "./ids";

export const id = (...name) => buildID(ids.BASE, ...name);

// RFC 1123 label — lowercase, alphanumerics and dashes,
// must start and end with an alphanumeric, max 63 chars.
const NAME_RE = /^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/;

/**
 * Live validation for the operator editor. Returns an object whose keys are
 * field names ("name", "url", "priority") and values are translation
 * arguments — { key, values? } — so the caller can resolve them with `t()`.
 *
 * @param {object} draft           the in-progress operator
 * @param {Array}  allOperators    the existing operators (for uniqueness)
 * @param {string} originalId      the id of the operator being edited (skipped
 *                                 in uniqueness checks); undefined for create.
 */
export const validateOperator = (draft, allOperators = [], originalId) => {
    const errs = {};

    // ---- name ----
    if (!draft.name || !draft.name.trim()) {
        errs.name = { key: "operatorNameRequired" };
    } else if (draft.name.length > 63) {
        errs.name = { key: "operatorNameTooLong" };
    } else if (!NAME_RE.test(draft.name)) {
        errs.name = { key: "operatorNameInvalid" };
    } else if (
        allOperators.some((o) => o.name === draft.name && o.id !== originalId)
    ) {
        errs.name = { key: "operatorNameTaken" };
    }

    // ---- url ----
    if (!draft.url || !draft.url.trim()) {
        errs.url = { key: "operatorUrlRequired" };
    } else {
        let parsed;
        try {
            parsed = new URL(draft.url);
        } catch (_) {
            // fall through
        }
        if (!parsed) {
            errs.url = { key: "operatorUrlInvalid" };
        } else if (
            parsed.protocol !== "http:" &&
            parsed.protocol !== "https:"
        ) {
            errs.url = { key: "operatorUrlScheme" };
        } else if (!parsed.hostname) {
            errs.url = { key: "operatorUrlNoHost" };
        }
    }

    // ---- priority ----
    if (
        draft.priority === "" ||
        draft.priority === null ||
        draft.priority === undefined
    ) {
        errs.priority = { key: "operatorPriorityRequired" };
    } else {
        const n = Number(draft.priority);
        if (!Number.isInteger(n)) {
            errs.priority = { key: "operatorPriorityInteger" };
        } else if (n < 0) {
            errs.priority = { key: "operatorPriorityNonNegative" };
        } else if (n > 9999) {
            errs.priority = { key: "operatorPriorityTooLarge" };
        } else if (
            allOperators.some((o) => o.priority === n && o.id !== originalId)
        ) {
            errs.priority = { key: "operatorPriorityTaken" };
        }
    }

    return errs;
};
