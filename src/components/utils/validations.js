import constants from "../../constants";
const nonEmptyField = (value, t) =>
    value && value.length > 0 ? undefined : t("emptyValue");
const minValue = (value, t) =>
    value && value < 0 ? t("mustBeZeroOrMore") : undefined;
const nonEmptyMinValue = (value, t) => {
    if (isNaN(value)) {
        return t("mustBeNumber");
    } else {
        if (value < 0) {
            return t("mustBeZeroOrMore");
        }
        if (value.length < 1) {
            return t("emptyValue");
        }
    }
};
const urlField = (value, t, isRequired = true) => {
    if (!isRequired) {
        if (value === "") {
            return;
        } else {
            return !constants.URL_REGEX.test(value)
                ? t("inValidUrl")
                : undefined;
        }
    }
    return !constants.URL_REGEX.test(value) ? t("inValidUrl") : undefined;
};

export { nonEmptyField, minValue, nonEmptyMinValue, urlField };
