/**
 *
 * Code mirror based Editor
 *
 * @author sriram
 *
 */
import React, { useEffect } from "react";
import { Controlled as CodeMirror } from "react-codemirror2";

export const CODE_MIRROR_MODES = {
    R: "r",
    PYTHON: "python",
    GITHUB_FLAVORED_MARKDOWN: "gfm",
    YAML: "yaml",
    DOCKERFILE: "dockerfile",
    SHELL: "shell",
    PERL: "perl",
};

export default function Editor(props) {
    const {
        mode = "",
        showLineNumbers,
        editable,
        wrapText,
        editorInstance,
        setEditorInstance,
        setEditorValue,
        setDirty,
        editorValue,
    } = props;

    useEffect(() => {
        require("codemirror/mode/r/r.js");
        require("codemirror/mode/python/python.js");
        require("codemirror/mode/gfm/gfm.js");
        require("codemirror/mode/yaml/yaml.js");
        require("codemirror/mode/dockerfile/dockerfile.js");
        require("codemirror/mode/shell/shell.js");
        require("codemirror/mode/perl/perl.js");
    }, []);

    return (
        <CodeMirror
            editorDidMount={(editor) => {
                setEditorInstance(editor);
            }}
            value={editorValue}
            options={{
                mode,
                lineNumbers: showLineNumbers,
                readOnly: !editable,
                lineWrapping: wrapText,
            }}
            onBeforeChange={(editor, data, value) => {
                setEditorValue(value);
            }}
            onChange={(editor, value) => {
                setDirty(editorInstance ? !editorInstance.isClean() : false);
            }}
        />
    );
}
