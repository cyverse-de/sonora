const nonEmptyField = (value) =>
    value && value.length > 0 ? undefined : "Empty Value";
const minValue = (value) =>
    value && value < 0 ? "Must be at least 0" : undefined;
const nonEmptyMinValue = (value) => {
    if (isNaN(value)) {
        return "Value must be a number";
    } else {
        if (value < 0) {
            return "Must be at least 0";
        }
        if (value.length < 1) {
            return "Empty Value";
        }
    }
};

export { nonEmptyField, minValue, nonEmptyMinValue };
