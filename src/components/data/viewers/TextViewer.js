/**
 * View text files
 *
 * @author sriram
 *
 */
import React, { useEffect, useState } from "react";

import ids from "./ids";
import Toolbar from "./Toolbar";

import PageWrapper from "components/layout/PageWrapper";
import constants from "../../../constants";

import { build } from "@cyverse-de/ui-lib";

import { CircularProgress } from "@material-ui/core";

import { Controlled as CodeMirror } from "react-codemirror2";

import "codemirror/lib/codemirror.css";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/mode/htmlmixed/htmlmixed.js";
import "codemirror/mode/r/r.js";
import "codemirror/mode/python/python.js";
import "codemirror/mode/gfm/gfm.js";
import "codemirror/mode/yaml/yaml.js";

export default function TextViewer(props) {
    const {
        baseId,
        path,
        resourceId,
        data,
        loading,
        handlePathChange,
        onRefresh,
        fileName,
        editable,
        mode,
        onNewFileSaved,
        createFileType,
    } = props;
    const [showLineNumbers, setShowLineNumbers] = useState(true);
    const [editorValue, setEditorValue] = useState();
    const [editorInstance, setEditorInstance] = useState(null);
    const [dirty, setDirty] = useState(false);
    const [fileSaveStatus, setFileSaveStatus] = useState();

    useEffect(() => {
        if (editorInstance) {
            editorInstance.setSize("100%", "75vh");
        }
    }, [editorInstance]);

    useEffect(() => {
        setEditorValue(data);
    }, [data]);

    const getContent = () => {
        return editorValue;
    };

    return (
        <PageWrapper
            appBarHeight={120}
            id={build(baseId, ids.VIEWER_PLAIN, fileName)}
        >
            <Toolbar
                baseId={build(baseId, ids.VIEWER_DOC, ids.TOOLBAR)}
                path={path}
                resourceId={resourceId}
                allowLineNumbers={true}
                showLineNumbers={showLineNumbers}
                onShowLineNumbers={(show) => setShowLineNumbers(show)}
                handlePathChange={handlePathChange}
                onRefresh={onRefresh}
                fileName={fileName}
                editing={editable}
                dirty={dirty}
                createFileType={createFileType}
                onNewFileSaved={onNewFileSaved}
                getFileContent={getContent}
                onSaving={setFileSaveStatus}
                onSaveComplete={() => setDirty(false)}
            />
            {(loading || fileSaveStatus === constants.LOADING) && (
                <CircularProgress
                    thickness={7}
                    color="primary"
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                    }}
                />
            )}
            <CodeMirror
                editorDidMount={(editor) => {
                    setEditorInstance(editor);
                }}
                value={editorValue}
                options={{
                    mode,
                    lineNumbers: showLineNumbers,
                    readOnly: !editable,
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
        </PageWrapper>
    );
}
