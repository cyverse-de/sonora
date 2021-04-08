import AppParamTypes, {
    DeprecatedParamTypes,
} from "components/models/AppParamTypes";

const INPUT_TYPES = [
    AppParamTypes.FILE_INPUT,
    AppParamTypes.FOLDER_INPUT,
    AppParamTypes.MULTIFILE_SELECTOR,
    AppParamTypes.FILE_FOLDER_INPUT,
];

const REFERENCE_GENOME_TYPES = [
    AppParamTypes.REFERENCE_ANNOTATION,
    AppParamTypes.REFERENCE_GENOME,
    AppParamTypes.REFERENCE_SEQUENCE,
];

/**
 * Determine if the parameter is of selection type
 * @param {string} type - analysis parameter type
 * @returns {boolean}
 */
const isSelectionArgumentType = (type) => {
    return (
        isSimpleSelectionArgumentType(type) ||
        type === DeprecatedParamTypes.TREE_SELECTION
    );
};

/**
 * Determine if the parameter is of  simple selection type
 *
 * @param {string} type - analysis parameter type
 * @returns {boolean}
 */
const isSimpleSelectionArgumentType = (type) => {
    return (
        type === AppParamTypes.TEXT_SELECTION ||
        type === AppParamTypes.INTEGER_SELECTION ||
        type === AppParamTypes.DOUBLE_SELECTION
    );
};

/**
 * Determine if the pararameter is of Text type
 *
 * @param {string} type - analysis parameter type
 * @returns {boolean}
 */
const isTextType = (type) => {
    return (
        type === AppParamTypes.TEXT ||
        type === AppParamTypes.MULTILINE_TEXT ||
        type === AppParamTypes.ENV_VAR ||
        type === AppParamTypes.INTEGER ||
        type === AppParamTypes.DOUBLE
    );
};

/**
 * Determine if the pararameter is of Input type
 *
 * @param {string} type - analysis parameter type
 * @returns {boolean}
 */
const isInputType = (type) => {
    return INPUT_TYPES.includes(type);
};

/**
 * Determine if the pararameter is of reference genome type
 *
 * @param {string} type - analysis parameter type
 * @returns {boolean}
 */
const isReferenceGenomeType = (type) => {
    return REFERENCE_GENOME_TYPES.includes(type);
};

/**
 * Parse selection value from analysis parameter
 *
 * @param {object} parameter
 * @returns {object} parameter with display value
 */
const parseSelectionValue = (parameter) => {
    const val = parameter.param_value.value;
    if (!val) {
        return null;
    }
    parameter.displayValue = val.display;
    return parameter;
};

/**
 * Parse string value from analysis parameter
 *
 * @param {object} parameter
 * @returns {object} parameter with display value
 */
const parseStringValue = (parameter) => {
    const val = parameter.param_value.value;
    parameter.displayValue = val;
    return parameter;
};

export {
    isSelectionArgumentType,
    isSimpleSelectionArgumentType,
    isTextType,
    isInputType,
    isReferenceGenomeType,
    parseSelectionValue,
    parseStringValue,
};
