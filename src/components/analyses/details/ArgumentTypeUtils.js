import ArgumentTypes from "./ArgumentTypes";

const isSelectionArgumentType = (type) => {
    return (
        isSimpleSelectionArgumentType(type) ||
        type === ArgumentTypes.PARAM_TYPE.TREE_SELECTION
    );
};

const isSimpleSelectionArgumentType = (type) => {
    return (
        type === ArgumentTypes.PARAM_TYPE.TEXT_SELECTION ||
        type === ArgumentTypes.PARAM_TYPE.INTEGER_SELECTION ||
        type === ArgumentTypes.PARAM_TYPE.DOUBLE_SELECTION ||
        type === ArgumentTypes.PARAM_TYPE.SELECTION ||
        type === ArgumentTypes.PARAM_TYPE.VALUE_SELECTION
    );
};

const isTextType = (type) => {
    return (
        type === ArgumentTypes.PARAM_TYPE.TEXT ||
        type === ArgumentTypes.PARAM_TYPE.MULTILINE_TEXT ||
        type === ArgumentTypes.PARAM_TYPE.ENV_VAR ||
        type === ArgumentTypes.PARAM_TYPE.OUTPUT ||
        type === ArgumentTypes.PARAM_TYPE.NUMBER ||
        type === ArgumentTypes.PARAM_TYPE.INTEGER ||
        type === ArgumentTypes.PARAM_TYPE.DOUBLE
    );
};

const INPUT_TYPES = [
    ArgumentTypes.PARAM_TYPE.INPUT,
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

const isInputType = (type) => {
    return INPUT_TYPES.includes(type);
};

const isReferenceGenomeType = (type) => {
    return REFERENCE_GENOME_TYPES.includes(type);
};

const parseSelectionValue = (ap) => {
    const val = ap.param_value.value;
    if (!val) {
        return [];
    }
    ap.displayValue = val.display;
    return ap;
};

const parseStringValue = (ap) => {
    const val = ap.param_value.value;
    ap.displayValue = val;
    return ap;
};

export {
    isSelectionArgumentType,
    isSimpleSelectionArgumentType,
    isTextType,
    INPUT_TYPES,
    REFERENCE_GENOME_TYPES,
    isInputType,
    isReferenceGenomeType,
    parseSelectionValue,
    parseStringValue,
};
