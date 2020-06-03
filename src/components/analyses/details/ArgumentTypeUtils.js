import ArgumentTypes from "./ArgumentTypes";

const INPUT_TYPES = [
    ArgumentTypes.PARAM_TYPE.FILE_INPUT,
    ArgumentTypes.PARAM_TYPE.FOLDER_INPUT,
    ArgumentTypes.PARAM_TYPE.MULTIFILE_SELECTOR,
    ArgumentTypes.PARAM_TYPE.FILE_FOLDER_INPUT,
];

const REFERENCE_GENOME_TYPES = [
    ArgumentTypes.PARAM_TYPE.REFERENCE_ANNOTATION,
    ArgumentTypes.PARAM_TYPE.REFERENCE_GENOME,
    ArgumentTypes.PARAM_TYPE.REFERENCE_SEQUENCE,
];

/**
 * Determine if the parameter is of selection type
 * @param {string} type - analysis parameter type
 * @returns {boolean}
 */
const isSelectionArgumentType = (type) => {
    return (
        isSimpleSelectionArgumentType(type) ||
        type === ArgumentTypes.PARAM_TYPE.TREE_SELECTION
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
        type === ArgumentTypes.PARAM_TYPE.TEXT_SELECTION ||
        type === ArgumentTypes.PARAM_TYPE.INTEGER_SELECTION ||
        type === ArgumentTypes.PARAM_TYPE.DOUBLE_SELECTION
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
        type === ArgumentTypes.PARAM_TYPE.TEXT ||
        type === ArgumentTypes.PARAM_TYPE.MULTILINE_TEXT ||
        type === ArgumentTypes.PARAM_TYPE.ENV_VAR ||
        type === ArgumentTypes.PARAM_TYPE.INTEGER ||
        type === ArgumentTypes.PARAM_TYPE.DOUBLE
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
