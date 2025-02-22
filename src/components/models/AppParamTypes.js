const AppParamTypes = {
    DOUBLE: "Double",
    DOUBLE_SELECTION: "DoubleSelection",
    ENV_VAR: "EnvironmentVariable",
    FILE_FOLDER_INPUT: "FileFolderInput",
    FILE_INPUT: "FileInput",
    FILE_OUTPUT: "FileOutput",
    FLAG: "Flag",
    FOLDER_INPUT: "FolderInput",
    FOLDER_OUTPUT: "FolderOutput",
    INFO: "Info",
    INTEGER: "Integer",
    INTEGER_SELECTION: "IntegerSelection",
    MULTIFILE_OUTPUT: "MultiFileOutput",
    MULTIFILE_SELECTOR: "MultiFileSelector",
    MULTILINE_TEXT: "MultiLineText",
    REFERENCE_ANNOTATION: "ReferenceAnnotation",
    REFERENCE_GENOME: "ReferenceGenome",
    REFERENCE_SEQUENCE: "ReferenceSequence",
    TEXT: "Text",
    TEXT_SELECTION: "TextSelection",
};

export const DeprecatedParamTypes = {
    TREE_SELECTION: "TreeSelection",
};

export const ValidatorTypes = {
    CHARACTER_LIMIT: "CharacterLimit",
    DOUBLE_ABOVE: "DoubleAbove",
    DOUBLE_BELOW: "DoubleBelow",
    DOUBLE_RANGE: "DoubleRange",
    INT_ABOVE: "IntAbove",
    INT_BELOW: "IntBelow",
    INT_RANGE: "IntRange",
    REGEX: "Regex",
};

export default AppParamTypes;
