/**
 * View text files
 *
 * @author sriram
 *
 */
import React, { useEffect, useState } from "react";
import { useTranslation } from "i18n";
import { Controlled as CodeMirror } from "react-codemirror2";

import ids from "./ids";
import Toolbar from "./Toolbar";
import markdownToHtml from "components/utils/markdownToHtml";
import viewerConstants from "./constants";
import constants from "../../../constants";

import { build } from "@cyverse-de/ui-lib";

import { CircularProgress, Typography } from "@material-ui/core";

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

    const { t } = useTranslation("data");

    const [showLineNumbers, setShowLineNumbers] = useState(true);
    const [wrapText, setWrapText] = useState(false);
    const [editorValue, setEditorValue] = useState();
    const [editorInstance, setEditorInstance] = useState(null);
    const [dirty, setDirty] = useState(false);
    const [fileSaveStatus, setFileSaveStatus] = useState();
    const [markDownPreview, setMarkdownPreview] = useState("");

    useEffect(() => {
        require("codemirror/lib/codemirror.css");
        require("codemirror/mode/javascript/javascript.js");
        require("codemirror/mode/htmlmixed/htmlmixed.js");
        require("codemirror/mode/r/r.js");
        require("codemirror/mode/python/python.js");
        require("codemirror/mode/gfm/gfm.js");
        require("codemirror/mode/yaml/yaml.js");
        require("codemirror/mode/dockerfile/dockerfile.js");
    }, []);

    useEffect(() => {
        if (editorInstance) {
            editorInstance.setSize("100%", "78vh");
        }
    }, [editorInstance]);

    useEffect(() => {
        setEditorValue(data);
    }, [data, mode]);

    useEffect(() => {
        if (mode === viewerConstants.GITHUB_FLAVOR_MARKDOWN) {
            markdownToHtml(editorValue).then((html) => {
                setMarkdownPreview(html);
            });
        }
    }, [editorValue, mode]);

    const getContent = () => {
        return editorValue;
    };

    return (
        <>
            <Toolbar
                baseId={build(baseId, ids.VIEWER_DOC, ids.TOOLBAR)}
                path={path}
                resourceId={resourceId}
                allowLineNumbers={true}
                showLineNumbers={showLineNumbers}
                onShowLineNumbers={setShowLineNumbers}
                wrapText={wrapText}
                onWrapText={setWrapText}
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
            <div style={{ width: "100%" }}>
                <div
                    style={{
                        float: "left",
                        width:
                            mode === viewerConstants.GITHUB_FLAVOR_MARKDOWN
                                ? "50%"
                                : "100%",
                    }}
                >
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
                                editorInstance
                                    ? !editorInstance.isClean()
                                    : false
                            );
                        }}
                    />
                </div>
                {mode === viewerConstants.GITHUB_FLAVOR_MARKDOWN && (
                    <>
                        <Typography variant="subtitle2">{t("preview")}</Typography>
                        <div
                            dangerouslySetInnerHTML={{
                                __html: markDownPreview,
                            }}
                            style={{
                                float: "right",
                                width: "50%",
                            }}
                        ></div>
                    </>
                )}
            </div>
        </>
    );
}
