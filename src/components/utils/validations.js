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

export { nonEmptyField, minValue, nonEmptyMinValue };
