/**
 *
 * Code mirror based Editor
 *
 * @author sriram
 *
 */
import React, { useEffect, useState } from "react";
import { Controlled as CodeMirror } from "react-codemirror2";

import viewerConstants from "./constants";

import Skeleton from "@material-ui/lab/Skeleton";



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

    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (mode) {
            require(`codemirror/mode/${mode}/${mode}.js`);
            setReady(true);
        } else {
            setReady(true);
        }
    }, [mode]);

    if (ready) {
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
                    setDirty(
                        editorInstance ? !editorInstance.isClean() : false
                    );
                }}
            />
        );
    } else {
        return (
            <Skeleton
                animation="wave"
                width="100%"
                height={viewerConstants.DEFAULT_VIEWER_HEIGHT}
            />
        );
    }
}
