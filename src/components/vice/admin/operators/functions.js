import buildID from "components/utils/DebugIDUtil";

import ids from "./ids";

export const id = (...name) => buildID(ids.BASE, ...name);

// RFC 1123 label — lowercase, alphanumerics and dashes,
// must start and end with an alphanumeric, max 63 chars.
const NAME_RE = /^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/;

// Validates an http(s) base URL, returning a translated error key or undefined
// when valid. `prefix` selects the matching i18n keys (e.g. "operatorUrl").
const validateHttpUrl = (t, value, prefix) => {
    let parsed;
    try {
        parsed = new URL(value);
    } catch (_) {
        // fall through
    }
    if (!parsed) {
        return t(`${prefix}Invalid`);
    } else if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        return t(`${prefix}Scheme`);
    } else if (!parsed.hostname) {
        return t(`${prefix}NoHost`);
    }
    return undefined;
};

/**
 * Live validation for the operator editor. Returns an object whose keys are
 * field names ("name", "url", "base_url", "priority") and values are the
 * translated error messages Formik expects.
 *
 * @param {function} t              the i18n translation function
 * @param {object}   draft          the in-progress operator
 * @param {Array}    allOperators   the existing operators (for uniqueness)
 * @param {string}   originalId     the id of the operator being edited (skipped
 *                                  in uniqueness checks); undefined for create.
 */
export const validateOperator = (t, draft, allOperators = [], originalId) => {
    const errs = {};

    // ---- name ----
    if (!draft.name || !draft.name.trim()) {
        errs.name = t("operatorNameRequired");
    } else if (draft.name.length > 63) {
        errs.name = t("operatorNameTooLong");
    } else if (!NAME_RE.test(draft.name)) {
        errs.name = t("operatorNameInvalid");
    } else if (
        allOperators.some((o) => o.name === draft.name && o.id !== originalId)
    ) {
        errs.name = t("operatorNameTaken");
    }

    // ---- url ----
    if (!draft.url || !draft.url.trim()) {
        errs.url = t("operatorUrlRequired");
    } else {
        const urlError = validateHttpUrl(t, draft.url, "operatorUrl");
        if (urlError) {
            errs.url = urlError;
        }
    }

    // ---- base_url (optional) ----
    if (draft.base_url && draft.base_url.trim()) {
        const baseUrlError = validateHttpUrl(
            t,
            draft.base_url.trim(),
            "operatorBaseUrl"
        );
        if (baseUrlError) {
            errs.base_url = baseUrlError;
        }
    }

    // ---- priority ----
    if (
        draft.priority === "" ||
        draft.priority === null ||
        draft.priority === undefined
    ) {
        errs.priority = t("operatorPriorityRequired");
    } else {
        const n = Number(draft.priority);
        if (!Number.isInteger(n)) {
            errs.priority = t("operatorPriorityInteger");
        } else if (n < 0) {
            errs.priority = t("operatorPriorityNonNegative");
        } else if (n > 9999) {
            errs.priority = t("operatorPriorityTooLarge");
        } else if (
            allOperators.some((o) => o.priority === n && o.id !== originalId)
        ) {
            errs.priority = t("operatorPriorityTaken");
        }
    }

    return errs;
};
