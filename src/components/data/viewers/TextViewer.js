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

import { build } from "@cyverse-de/ui-lib";

import Skeleton from "@material-ui/lab/Skeleton";
import SplitView from "./SplitView";

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
    const [isFileSaving, setFileSaving] = React.useState();
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
    const Editor = () => (
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
    const Preview = () => (
        <div
            dangerouslySetInnerHTML={{
                __html: markDownPreview,
            }}
        ></div>
    );
    const busy = loading || isFileSaving;
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
                onSaving={() => setFileSaving(true)}
                onSaveComplete={() => {
                    setFileSaving(false);
                    setDirty(false);
                }}
            />
            {busy && (
                <Skeleton
                    animation="wave"
                    width="100%"
                    height={viewerConstants.DEFAULT_VIEWER_HEIGHT}
                />
            )}
            {!busy && mode === viewerConstants.GITHUB_FLAVOR_MARKDOWN && (
                <SplitView
                    leftPanel={Editor()}
                    rightPanel={Preview()}
                    leftPanelTitle={t("editor")}
                    rightPanelTitle={t("preview")}
                />
            )}
            {!busy && mode !== viewerConstants.GITHUB_FLAVOR_MARKDOWN && (
                <Editor />
            )}
        </>
    );
}
